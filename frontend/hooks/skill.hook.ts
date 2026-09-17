import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "@/api/skill.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    retry: false,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}