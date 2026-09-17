import {
  createProject,
  deleteProject,
  getAdminProjectById,
  getAllAdminProjects,
  getAllPublishedProjects,
  getFeaturedProjects,
  getProjectBySlug,
  toggleProjectFeatured,
  toggleProjectPublish,
  updateProject,
} from "@/api/project.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ================= PUBLIC HOOKS ================= //

export function useGetFeaturedProjects() {
  return useQuery({
    queryKey: ["projects", "featured"],
    queryFn: getFeaturedProjects,
    retry: false,
  });
}

export function useGetAllPublishedProjects() {
  return useQuery({
    queryKey: ["projects", "published"],
    queryFn: getAllPublishedProjects,
    retry: false,
  });
}

export function useGetProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
    retry: false,
  });
}

// ================= ADMIN HOOKS ================= //

export function useGetAllAdminProjects() {
  return useQuery({
    queryKey: ["projects", "admin"],
    queryFn: getAllAdminProjects,
    retry: false,
  });
}

export function useGetAdminProjectById(id: string) {
  return useQuery({
    queryKey: ["projects", "admin", id],
    queryFn: () => getAdminProjectById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useToggleProjectPublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleProjectPublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useToggleProjectFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleProjectFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}