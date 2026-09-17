import apiClient from "@/lib/apiClient";
import { ILoginUserPayload } from "@/types/auth.type";

// export const userRegistration = (payload: IRegisterUser) => {
//   return apiClient("/api/v1/auth/register", { method: "POST", body: payload });
// };

export const userLogin = (payload: ILoginUserPayload) => {
  return apiClient("/api/v1/auth/login", { method: "POST", body: payload });
};

export const getMe = () => {
  return apiClient("/api/v1/auth/me");
};
