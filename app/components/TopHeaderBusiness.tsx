"use client";
import Link from "next/link";
import { FaUserAstronaut, FaPowerOff } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import Accordion from "../ui/Acardeon";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "../hooks/useLocalStorage";

function TopHeaderBusiness() {
  const [showAcardeon, setShowAcardeon] = useState(false);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  //گرفتن اسم از localstorage
  const [fullname] = useLocalStorage("fullname", "");

  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(event.target as Node)
      ) {
        setShowAcardeon(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // delete token - posh to route login
  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    localStorage.removeItem("fullname");

    setShowAcardeon(false);
    router.replace("/auth/login");
  };

  return (
    <div className="flex items-center justify-between p-4 max-w-[1512.6px] mx-auto">
      <section className="flex items-center gap-4">
        <Link className="text-[17.5px] text-[#000000]" href="/">
          میسکا
        </Link>

        <Link
          href="/workspace/business"
          className="text-[14px] text-[#000000A6]"
        >
          کسب و کارها
        </Link>
      </section>

      {/* WRAPPER */}
      <div ref={accordionRef} className="relative">
        <div
          onClick={() => setShowAcardeon((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1"
        >
          <FaUserAstronaut size={12.25} color="gray" />
          <p className="text-[#000000A6] text-[14px]">
            {fullname ? fullname : "نام ثبت نشده است"}
          </p>
          <IoMdArrowDropdown />
        </div>

        {showAcardeon && (
          <section
            onClick={handleLogout}
            className="absolute top-8 left-0 z-50"
          >
            <Accordion
              icon={<FaPowerOff />}
              title="خروج"
              className="text-sm bg-white shadow-md"
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default TopHeaderBusiness;
