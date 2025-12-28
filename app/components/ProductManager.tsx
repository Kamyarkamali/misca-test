"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadCroppedImage,
} from "../services/request";
import ProductCard, { Product } from "./ProductCard";
import { ProductImages, Products } from "../types/types";
import { FloatingInput } from "@/components/floating-input";

type CreateProductForm = {
  name: string;
  price: number;
  isAvailable: boolean;
  calories: number | null;
  averagePreparationMinutes: number | null;
  imageId?: string | null;
};

type ProductManagerProps = {
  categoryId: string;
  slug: string;
  products?: Products[];
  fetchCategories: () => void;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

async function getCroppedBlob(imageSrc: string, crop: any) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );
  return new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg")
  );
}

export default function ProductManager({
  categoryId,
  slug,
  products = [],
  fetchCategories,
}: ProductManagerProps) {
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<ProductImages | null>(
    null
  );
  const DEFAULT_IMAGE_ID = "/images/default.webp";

  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [imageId, setImageId] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editProductLoading, setEditProductLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateProductForm>({
    defaultValues: {
      isAvailable: true,
      calories: null,
      averagePreparationMinutes: null,
      imageId: null,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
  } = useForm<CreateProductForm>({
    defaultValues: {
      name: "",
      price: 0,
      isAvailable: true,
      calories: null,
      averagePreparationMinutes: null,
      imageId: null,
    },
  });

  console.log(products);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  };

  const onCropComplete = useCallback((_: any, cropped: any) => {
    setCroppedArea(cropped);
  }, []);

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedArea) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      const file = new File([blob], "product.jpg", { type: "image/jpeg" });

      const res = await uploadCroppedImage(file);
      if (!res?.isSuccess || !res.data?.length) {
        toast.error("آپلود عکس ناموفق بود");
        return;
      }

      const image = res.data[0];
      //@ts-ignore
      setUploadedImage({ id: image.id, url: image.url });
      setImageId(image.id);
      toast.success("عکس با موفقیت آپلود شد");
      setImageSrc(null);
    } catch {
      toast.error("خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  };

  const onCreateProduct = async (data: CreateProductForm) => {
    setCreateLoading(true);
    try {
      const finalImageId = uploadedImage?.id ?? null;

      const payload = {
        ...data,
        categoryId,
        imageId: finalImageId,
        calories: data.calories ?? null,
        averagePreparationMinutes: data.averagePreparationMinutes ?? null,
      };

      await createProduct(payload, slug);

      toast.success("محصول با موفقیت ثبت شد");
      setIsCreateProductOpen(false);
      reset();
      setUploadedImage(null);
      setImageId(null);
      fetchCategories();
    } catch {
      toast.error("خطا در ثبت محصول");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditProduct = (product: Products) => {
    const productForCard: Product = {
      id: product.id,
      name: product.name,
      isAvailable: product.isAvailable,
      price: product.price,
      finalPrice: product.finalPrice,
      averagePreparationMinutes: product.averagePreparationMinutes ?? undefined,
      calories: product.calories ?? undefined,
      images: product.images,
    };

    setEditingProduct(product);
    resetEditForm({
      name: productForCard.name,
      price: productForCard.price,
      isAvailable: product.isAvailable,
      calories: productForCard.calories,
      averagePreparationMinutes: productForCard.averagePreparationMinutes,
    });
    setIsEditProductOpen(true);
  };

  const handleSaveProductEdit = async (data: CreateProductForm) => {
    if (!editingProduct) return;
    setEditProductLoading(true);

    try {
      const payload = {
        id: editingProduct.id,
        categoryId: categoryId,
        name: data.name,
        isAvailable: Boolean(data.isAvailable),
        calories: data.calories ?? null,
        averagePreparationMinutes: data.averagePreparationMinutes ?? null,
        imageId: uploadedImage?.id ?? editingProduct.imageId ?? null,
      };

      await updateProduct(payload, slug);

      toast.success("محصول بروزرسانی شد");
      setIsEditProductOpen(false);
      setUploadedImage(null);
      setImageId(null);
      fetchCategories();
    } catch {
      toast.error("خطا در ویرایش محصول");
    } finally {
      setEditProductLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId, slug);
      toast.success("محصول حذف شد");
      fetchCategories();
    } catch {
      toast.error("خطا در حذف محصول");
    }
  };

  useEffect(() => {
    if (!isCreateProductOpen) {
      setUploadedImage(null);
      setImageId(null);
      setImageSrc(null);
      reset();
    }
  }, [isCreateProductOpen, reset]);

  return (
    <div>
      <Button
        className="mt-4 bg-blue-500 hover:bg-blue-600"
        size="sm"
        onClick={() => setIsCreateProductOpen(true)}
      >
        + ثبت محصول
      </Button>

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                ...p,
                averagePreparationMinutes:
                  p.averagePreparationMinutes ?? undefined,
                calories: p.calories ?? undefined,
              }}
              // @ts-ignore
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <p className="text-red-300 font-bold mt-2">
          برای این دسته بندی محصولی ثبت نشده
        </p>
      )}

      <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ثبت محصول</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onCreateProduct)} className="space-y-3">
            <FloatingInput
              label="نام محصول"
              {...register("name", { required: true })}
            />
            <FloatingInput
              className="text-left"
              type="number"
              label="قیمت"
              {...register("price", { valueAsNumber: true })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register("isAvailable")} />
              محصول موجود است
            </label>

            <FloatingInput
              className="text-left"
              type="number"
              label="کالری (اختیاری)"
              {...register("calories", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            />
            <FloatingInput
              className="text-left"
              type="number"
              label="زمان آماده‌سازی (دقیقه)"
              {...register("averagePreparationMinutes", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            />

            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
              id="product-image"
            />
            <label
              htmlFor="product-image"
              className="w-23 h-23 border border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:text-blue-500 transition bg-gray-50"
            >
              <MdOutlineAddPhotoAlternate size={36} />
            </label>

            {imageSrc && (
              <div className="relative h-64 bg-black mt-2">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <Button
                  type="button"
                  className="absolute bottom-2 left-2"
                  onClick={handleUploadCroppedImage}
                  disabled={uploading}
                >
                  {uploading ? "در حال آپلود..." : "تایید عکس"}
                </Button>
              </div>
            )}

            {uploadedImage && (
              <div className="flex items-center gap-2 mt-2">
                <Image
                  // @ts-ignore
                  src={uploadedImage.url || DEFAULT_IMAGE_URL}
                  alt="uploaded"
                  width={48}
                  height={48}
                  className="rounded"
                />
                <button
                  type="button"
                  className="text-red-500 text-xs"
                  onClick={() => {
                    setUploadedImage(null);
                    setImageId(null);
                  }}
                >
                  حذف
                </button>
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
                disabled={createLoading}
              >
                {createLoading ? "در حال ثبت..." : "ثبت محصول"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش محصول</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleEditSubmit(handleSaveProductEdit)}
            className="space-y-3"
          >
            {/* نام محصول */}
            <FloatingInput
              label="نام محصول"
              {...registerEdit("name", { required: true })}
            />

            {/* قیمت */}
            <FloatingInput
              className="text-left"
              label="قیمت"
              type="number"
              {...registerEdit("price", { valueAsNumber: true })}
            />

            {/* موجود بودن */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...registerEdit("isAvailable")} />
              محصول موجود است
            </label>

            {/* کالری */}
            <FloatingInput
              className="text-left"
              label="کالری (اختیاری)"
              type="number"
              {...registerEdit("calories", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            />

            {/* زمان آماده‌سازی */}
            <FloatingInput
              className="text-left"
              label="زمان آماده سازی (دقیقه)"
              type="number"
              {...registerEdit("averagePreparationMinutes", {
                setValueAs: (v) => (v === "" ? null : Number(v)),
              })}
            />

            {/* @ts-ignore */}
            {editingProduct?.images?.[0]?.imageUrl && !imageSrc && (
              <div className="flex items-center gap-2 mt-2">
                <Image
                  /* @ts-ignore */
                  src={editingProduct.images[0].imageUrl}
                  alt="current"
                  width={64}
                  height={64}
                  className="rounded"
                />
              </div>
            )}

            {/* آپلود عکس جدید */}
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
              id="edit-product-image"
            />
            <label
              htmlFor="edit-product-image"
              className="w-23 h-23 border border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:text-blue-500 transition bg-gray-50"
            >
              <MdOutlineAddPhotoAlternate size={36} />
            </label>

            {/* Cropper */}
            {imageSrc && (
              <div className="relative h-64 bg-black mt-2">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
                <Button
                  type="button"
                  className="absolute bottom-2 left-2"
                  onClick={handleUploadCroppedImage}
                  disabled={uploading}
                >
                  {uploading ? "در حال آپلود..." : "تایید عکس"}
                </Button>
              </div>
            )}

            {/* نمایش تصویر آپلود شده */}
            {uploadedImage && (
              <div className="flex items-center gap-2 mt-2">
                <Image
                  // @ts-ignore
                  src={uploadedImage.url || DEFAULT_IMAGE_ID}
                  alt="uploaded"
                  width={48}
                  height={48}
                  className="rounded"
                />
                <button
                  type="button"
                  className="text-red-500 text-xs"
                  onClick={() => {
                    setUploadedImage(null);
                    setImageId(null);
                  }}
                >
                  حذف
                </button>
              </div>
            )}

            <DialogFooter>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer transition"
                type="submit"
                disabled={editProductLoading}
              >
                {editProductLoading ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
