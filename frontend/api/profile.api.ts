import apiClient from "@/lib/apiClient";
import { IUpdateProfile } from "@/types/profile.type";


export const getProfile = () => {
  return apiClient("/api/v1/profile");
};

export const profileUpdate = (payload: IUpdateProfile) => {
  return apiClient("/api/v1/profile", { method: "PATCH", body: payload });
};
