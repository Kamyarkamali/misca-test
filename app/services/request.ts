import api from "../configs/api";

interface LoginResponse {
  token: string;
  refreshToken: string;
}

export const loginRequest = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/signin-password", { username, password });
  const { token, refreshToken } = res.data.data.accessToken;

  // ذخیره توکن در localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("sessionId", `Bearer ${token}`);
    localStorage.setItem("refreshToken", refreshToken);
  }

  return { token, refreshToken };
};
