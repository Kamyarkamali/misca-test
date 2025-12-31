"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getBusinessEvents } from "../services/request";

const DEFAULT_IMAGE = "/images/default.webp";

function formatDateTime(timestamp: number) {
  if (!timestamp) return null;

  const ms = Math.abs(timestamp) < 1e12 ? timestamp * 1000 : timestamp;

  const date = new Date(ms);

  return {
    date: date.toLocaleDateString("fa-IR"),
    time: date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function EvenetsComponents({ slug }: { slug: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getBusinessEvents({ slug, page: 30 })
      .then((res) => setEvents(res.items || []))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !events.length) return null;

  console.log(events);

  return (
    <section className="w-full  max-w-7xl mx-auto px-3 sm:px-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-right">رویدادها</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event) => {
          const start = formatDateTime(event.startAtUtc);
          const end = formatDateTime(event.endAtUtc);

          return (
            <div
              key={event.id}
              className="bg-[#ECE1D8] rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square w-full">
                <Image
                  src={event.coverImageUrl || event.imageUrl || DEFAULT_IMAGE}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2 text-right">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {start && end && (
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>
                      📅 {start.date} — {end.date}
                    </div>
                    <div>
                      ⏰ {start.time} تا {end.time}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
