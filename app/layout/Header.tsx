import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <div className="max-w-375 mx-auto px-4 md:px-6">
      <section className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2 md:gap-3">
          <Link href={"/"}>
            <Image src="/images/logo.png" alt="logo" width={35} height={35} />
          </Link>

          <Link
            href="/"
            className="text-base md:text-lg font-bold text-brand"
          >
            میسکا
          </Link>

          <Link href="/" className=" text-sm text-[#000000A6] mb-[.60rem]">
            حریم خصوصی
          </Link>
        </div>

        <button className="text-sm md:text-base cursor-pointer text-[#0D6EFD] px-3 p-[10.5px] rounded-md border border-[#0D6EFD] hover:bg-blue-500 hover:text-white">
          ورود یا عضویت
        </button>
      </section>

      <div className="border-b border-[#dae0e7]" />
    </div>
  );
}

export default Header;
