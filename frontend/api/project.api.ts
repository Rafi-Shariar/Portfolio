import apiClient from "@/lib/apiClient";
import { ICreateProject, IUpdateProject } from "@/types/project.type";


// ================= PUBLIC APIS ================= //

export const getFeaturedProjects = () => {
  return apiClient("/api/v1/project/featured");
};

export const getAllPublishedProjects = () => {
  return apiClient("/api/v1/project");
};

export const getProjectBySlug = (slug: string) => {
  return apiClient(`/api/v1/project/${slug}`);
};

// ================= ADMIN APIS ================= //

export const getAllAdminProjects = () => {
  return apiClient("/api/v1/project/admin/all");
};

export const getAdminProjectById = (id: string) => {
  return apiClient(`/api/v1/project/admin/${id}`);
};

export const createProject = (payload: ICreateProject) => {
  return apiClient("/api/v1/project", {
    method: "POST",
    body: payload,
  });
};

export const updateProject = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<IUpdateProject>;
}) => {
  return apiClient(`/api/v1/project/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const deleteProject = (id: string) => {
  return apiClient(`/api/v1/project/${id}`, {
    method: "DELETE",
  });
};

export const toggleProjectPublish = (id: string) => {
  return apiClient(`/api/v1/project/${id}/toggle-publish`, {
    method: "PATCH",
  });
};

export const toggleProjectFeatured = (id: string) => {
  return apiClient(`/api/v1/project/${id}/toggle-featured`, {
    method: "PATCH",
  });
};