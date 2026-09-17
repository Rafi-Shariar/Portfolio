import apiClient from "@/lib/apiClient";
import { ICreateSkill } from "@/types/skill.type";

export const getSkills = () => {
  return apiClient("/api/v1/skill");
};

export const createSkill = (payload: ICreateSkill) => {
  return apiClient("/api/v1/skill", { method: "POST", body: payload });
};

export const updateSkill = ({
  id,
  payload,
}: {
  id: string;
  payload: ICreateSkill;
}) => {
  return apiClient(`/api/v1/skill/${id}`, { method: "PATCH", body: payload });
};


export const deleteSkill = (id : string) => {
  return apiClient(`/api/v1/skill/${id}`, { method: "DELETE" });
};
