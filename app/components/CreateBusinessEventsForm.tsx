"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import moment from "jalali-moment";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Cropper from "react-easy-crop";
import { MdOutlineFileUpload, MdDelete } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/floating-input";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createBusinessEvent, uploadCroppedImage } from "../services/request";
import { getCroppedImg } from "../helpers/cropImage";

const DEFAULT_IMAGE = "/images/default.webp";

type ImageData = { url: string };

interface Props {
  slug: string;
  onEventCreated?: (event: any) => void;
}

export default function CreateBusinessEventsForm({
  slug,
  onEventCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState<ImageData | null>(null);
  const [coverImage, setCoverImage] = useState<ImageData | null>(null);
  const [canReserve, setCanReserve] = useState(false);
  const [reserveCapacity, setReserveCapacity] = useState(0);
  const [cost, setCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [cropData, setCropData] = useState<{
    file: File;
    preview: string;
    onChange: (data: ImageData) => void;
  } | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (
    file: File,
    onChange: (data: ImageData) => void
  ) => {
    setCropData({ file, preview: URL.createObjectURL(file), onChange });
  };

  const handleCropSave = async () => {
    if (!cropData || !croppedAreaPixels) return;
    try {
      setUploadingImage(true);
      const croppedFile = await getCroppedImg(
        cropData.preview,
        croppedAreaPixels
      );
      const res = await uploadCroppedImage(croppedFile);
      const data = res.data?.[0];
      if (!data?.url) throw new Error("آپلود ناموفق بود");

      cropData.onChange({ url: data.url });
      setCropData(null);
      toast.success("تصویر با موفقیت آپلود شد");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.messages?.[0] || "خطا در کراپ یا آپلود تصویر"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (field: "main" | "cover") => {
    if (field === "main") setMainImage(null);
    if (field === "cover") setCoverImage(null);
  };

  const handleSubmit = async () => {
    if (!title || !startDate || !endDate) {
      toast.error("عنوان و تاریخ شروع و پایان الزامی است");
      return;
    }

    setLoading(true);

    const startAtUtc =
      moment
        .from(
          `${startDate.format("YYYY/MM/DD")} ${startTime}`,
          "fa",
          "YYYY/MM/DD HH:mm"
        )
        .toDate()
        .getTime() / 1000;

    const endAtUtc =
      moment
        .from(
          `${endDate.format("YYYY/MM/DD")} ${endTime}`,
          "fa",
          "YYYY/MM/DD HH:mm"
        )
        .toDate()
        .getTime() / 1000;

    const payload = {
      title,
      startAtUtc,
      endAtUtc,
      description: description || null,
      image: mainImage?.url || DEFAULT_IMAGE,
      coverImage: coverImage?.url || DEFAULT_IMAGE,
      canReserve,
      reserveCapacity,
      cost: cost || null,
    };

    try {
      const createdEvent = await createBusinessEvent(slug, payload);
      toast.success("رویداد با موفقیت ایجاد شد");

      onEventCreated?.(createdEvent);

      // ریست فرم
      setOpen(false);
      setTitle("");
      setStartDate(null);
      setEndDate(null);
      setStartTime("09:00");
      setEndTime("17:00");
      setDescription("");
      setMainImage(null);
      setCoverImage(null);
      setCanReserve(false);
      setReserveCapacity(0);
      setCost(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "خطا در ایجاد رویداد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 mt-4 mr-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md px-5 py-2 transition-all">
          + ایجاد رویداد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl w-full mx-auto p-6 max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            ایجاد رویداد جدید
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            لطفاً اطلاعات رویداد را وارد کنید
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <FloatingInput
            label="عنوان رویداد"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* تاریخ شروع */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">تاریخ شروع</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={startDate}
              onChange={setStartDate}
              format="YYYY/MM/DD"
              inputClass="w-full border rounded-md px-2 py-1 text-right"
              placeholder="۱۴۰۴/۰۶/۰۵"
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* تاریخ پایان */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">تاریخ پایان</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={endDate}
              onChange={setEndDate}
              format="YYYY/MM/DD"
              inputClass="w-full border rounded-md px-2 py-1 text-right"
              placeholder="۱۴۰۴/۰۶/۰۵"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-2"
            />
          </div>

          <Textarea
            placeholder="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-1 sm:col-span-2"
          />

          {/* تصاویر */}
          <div className="flex flex-col sm:flex-row gap-4 col-span-1 sm:col-span-2">
            {[
              {
                label: "تصویر اصلی",
                field: "main",
                value: mainImage,
                setValue: setMainImage,
              },
              {
                label: "تصویر کاور",
                field: "cover",
                value: coverImage,
                setValue: setCoverImage,
              },
            ].map((img) => (
              <div
                key={img.field}
                className="flex-1 flex flex-col items-center"
              >
                <label className="text-sm mb-1">{img.label}</label>
                <div
                  className="w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all relative overflow-hidden"
                  onClick={() =>
                    document.getElementById(`${img.field}ImageInput`)?.click()
                  }
                >
                  {uploadingImage ? (
                    <span>در حال آپلود...</span>
                  ) : (
                    <>
                      <MdOutlineFileUpload
                        size={36}
                        className="text-gray-400 mb-2"
                      />
                      <span className="text-gray-500 text-sm">
                        {img.value ? "عکس انتخاب شده" : "انتخاب تصویر"}
                      </span>
                    </>
                  )}
                  {img.value && (
                    <>
                      <MdDelete
                        size={20}
                        className="absolute top-1 right-1 text-red-500 cursor-pointer z-10"
                        onClick={() =>
                          handleRemoveImage(img.field as "main" | "cover")
                        }
                      />
                      <img
                        src={img.value.url}
                        alt={img.label}
                        className="absolute bottom-0 w-full h-full object-cover rounded-md"
                      />
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id={`${img.field}ImageInput`}
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileChange(e.target.files[0], img.setValue)
                  }
                />
              </div>
            ))}
          </div>

          {/* رزرو و هزینه */}
          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <input
              type="checkbox"
              checked={canReserve}
              onChange={(e) => setCanReserve(e.target.checked)}
            />
            <span>قابل رزرو</span>
          </div>

          {canReserve && (
            <Input
              type="number"
              placeholder="ظرفیت رزرو"
              value={reserveCapacity}
              onChange={(e) => setReserveCapacity(Number(e.target.value))}
              className="col-span-1 sm:col-span-2"
            />
          )}

          <Input
            type="number"
            placeholder="هزینه (اختیاری)"
            value={cost ?? ""}
            onChange={(e) => setCost(Number(e.target.value))}
            className="col-span-1 sm:col-span-2"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ایجاد"}
          </Button>
        </div>

        {/* Cropper Modal */}
        {cropData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-md w-full max-w-lg">
              <div className="relative w-full h-96">
                <Cropper
                  image={cropData.preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setCropData(null)} variant="outline">
                  انصراف
                </Button>
                <Button
                  onClick={handleCropSave}
                  className="bg-blue-600 text-white"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "در حال آپلود..." : "ذخیره"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
