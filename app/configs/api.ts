import axios from "axios";
import { refreshSession } from "./refreshToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (req) => {
    let accessToken = localStorage.getItem("sessionId");

    if (!accessToken) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        accessToken = await refreshSession(refreshToken);
      }
      // if (!accessToken) {
      //   window.location.href = "/auth/login";
      //   return Promise.reject("No session token");
      // }
    }

    if (accessToken && req.headers) {
      req.headers["Authorization"] = accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
