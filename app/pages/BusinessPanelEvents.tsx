"use client";

import Image from "next/image";
import { BiCalendar, BiTime, BiFlag } from "react-icons/bi";
import CreateBusinessEventsForm from "../components/CreateBusinessEventsForm";
import { BusinessEvent } from "../types/interfaces";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchEvents } from "../services/request";
import UiLoader from "../ui/UiLoader";

const defaultImage = "/images/default.webp";

type EventsResponse = {
  items: BusinessEvent[];
  page: number;
  total: number;
};

export default function BusinessPanelEvents() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const { data, isLoading, error, mutate } = useSWR<EventsResponse>(
    slug ? ["business-events", slug] : null,
    // @ts-ignore
    () => fetchEvents(slug)
  );

  const handleEventCreated = async (newEvent: BusinessEvent) => {
    mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              items: [newEvent, ...prev.items],
            }
          : prev,
      false
    );

    await mutate();
  };

  console.log(data);

  const formatDate = (timestamp?: number) =>
    timestamp ? new Date(timestamp * 1000).toLocaleDateString("fa-IR") : "-";

  const formatTime = (timestamp?: number) =>
    timestamp
      ? new Date(timestamp * 1000).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "-";

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">خطا در دریافت اطلاعات</div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      {slug && (
        <CreateBusinessEventsForm
          slug={slug}
          onEventCreated={handleEventCreated}
        />
      )}

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-right text-gray-800">
        رویدادها
      </h2>

      {isLoading ? (
        <div className="text-center py-6 flex flex-col items-center text-gray-500 text-sm">
          <UiLoader />
          <p className="text-gray-600 font-bold">درحال لود ...</p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          هیچ رویدادی ثبت نشده است
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {data.items.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-md border shadow-sm hover:shadow transition overflow-hidden text-xs"
            >
              {/* image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={event.image || event.coverImage || defaultImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* content */}
              <div className="p-2 space-y-1 text-right">
                {/* title */}
                <h3 className="font-semibold text-[13px] truncate text-gray-900">
                  {event.title || "بدون عنوان"}
                </h3>

                {/* dates */}
                <div className="space-y-0.5 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <BiCalendar className="text-green-500" />
                      شروع
                    </span>
                    <span>{formatDate(event.startAtUtc)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <BiCalendar className="text-red-500" />
                      پایان
                    </span>
                    <span>{formatDate(event.endAtUtc)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <BiTime />
                      ساعت شروع
                    </span>
                    <span>{formatTime(event.startAtUtc)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <BiTime />
                      ساعت پایان
                    </span>
                    <span>{formatTime(event.endAtUtc)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
