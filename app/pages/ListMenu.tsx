"use client";

import { useEffect, useRef, useState } from "react";
import ContentProducts from "../components/ContentProducts";
import HaderMenu from "../components/MenuNavbar";
import EvenetsComponents from "../components/EvenetsComponents";
import { useParams } from "next/navigation";
// @ts-ignore
import { ListMenuProps } from "../types/interfaces";

function ListMenu({ menuData }: ListMenuProps) {
  const [scrolled, setScrolled] = useState(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const params = useParams();

  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) categoryRefs.current[index] = el;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#EBDCD0]">
      <section className="p-4 mx-auto">
        {slug && <EvenetsComponents slug={slug} />}
      </section>

      <header
        className={`w-full px-3 sm:px-6 mt-4 sticky top-0 z-50  transition-all duration-300 ${
          scrolled ? "bg-[#EBDCD0]" : "bg-transparent"
        }`}
      >
        <section className="rounded-md md:shadow-sm max-w-7xl mx-auto p-4 sm:p-6">
          <HaderMenu menuData={menuData} categoryRefs={categoryRefs} />
        </section>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 mt-6">
        <ContentProducts
          menuData={menuData}
          // @ts-ignore
          addToRefs={addToRefs}
        />
      </main>
    </div>
  );
}

export default ListMenu;
