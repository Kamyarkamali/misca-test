// lib/auth-token.ts
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get("sessionId")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token && refreshToken) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        token = data.sessionId;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  return token || null;
}
