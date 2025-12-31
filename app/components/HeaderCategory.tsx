"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { menuCategory } from "../data/menuData";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FiMenu } from "react-icons/fi";
import { HiHomeModern } from "react-icons/hi2";
import { FaUserAstronaut } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function HeaderCategory() {
  const params = useParams<{ slug?: string }>();
  const cafeName = params?.slug ?? "کافه";
  const [fullname] = useLocalStorage("fullname", "");

  const router = useRouter();

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    localStorage.removeItem("fullname");
    router.replace("/auth/login");
  };

  return (
    <header
      dir="rtl"
      className="
        sticky top-0 z-50
        bg-white
        border-b border-gray-200
      "
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <HiHomeModern className="text-[20px]" />
          <div className="flex flex-col leading-tight">
            <Link
              href={`${`/b/${cafeName}/menu`}`}
              className="text-[14.5px] font-semibold"
            >
              {cafeName}
            </Link>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {menuCategory.map((item) => (
            <Link
              key={item.id}
              href={
                item.key === "business-events"
                  ? `/businesspanel/${params.slug}/BusinessEvent`
                  : item.path ?? "#"
              }
              className="
                text-[14px]
                font-medium
                text-gray-700
                hover:text-[#8b5e3c]
                transition-colors
              "
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex cursor-pointer items-center gap-1">
          <Button
            onClick={() => {
              window.location.href = "tel:+98 905 808 9095";
            }}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            <BiSupport />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="
                cursor-pointer
                  hidden sm:flex
                  items-center gap-2
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                <FaUserAstronaut />
                <span className="text-sm font-medium">
                  {fullname ? fullname : "نام ثبت نشده است"}
                </span>
                <IoMdArrowDropdown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="flex flex-col items-end cursor-pointer"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 w-full flex items-center justify-end cursor-pointer"
              >
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:bg-gray-100"
              >
                <FiMenu size={22} />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                bg-white
                border-l border-gray-200
                text-gray-800
                flex flex-col
              "
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center p-3 justify-end w-full">
                  <p className="text-base font-semibold">{cafeName}</p>
                </div>
              </div>

              {/* آیتم‌های منو */}
              <nav className="mt-6 flex flex-col gap-1">
                {menuCategory.map((item) => (
                  <Link
                    key={item.id}
                    href={
                      item.key === "business-events"
                        ? `/businesspanel/${params.slug}/BusinessEvent`
                        : item.path ?? "#"
                    }
                    className="
                      px-4 py-3
                      rounded-lg
                      text-[14.5px]
                      font-medium
                      hover:bg-gray-100
                      transition-colors
                    "
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* فوتر */}
              <div className="mt-auto pt-6 text-xs text-gray-400">
                پنل مدیریت دسته‌بندی‌های کافه
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
