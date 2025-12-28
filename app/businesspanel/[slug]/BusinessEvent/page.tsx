import HeaderCategory from "@/app/components/HeaderCategory";
import BusinessPanelEvents from "@/app/pages/BusinessPanelEvents";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sessionId")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/auth/login");
  }

  return (
    <div>
      <HeaderCategory />
      <BusinessPanelEvents />
    </div>
  );
}
