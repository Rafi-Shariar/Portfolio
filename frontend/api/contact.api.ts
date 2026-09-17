import apiClient from "@/lib/apiClient";
import { IContactPayload } from "@/types/contact.type";

// export const userRegistration = (payload: IRegisterUser) => {
//   return apiClient("/api/v1/auth/register", { method: "POST", body: payload });
// };

export const submitContact = (payload: IContactPayload) => {
  return apiClient("/api/v1/contact", { method: "POST", body: payload });
};