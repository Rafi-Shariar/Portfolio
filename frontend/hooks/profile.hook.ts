import { getProfile, profileUpdate } from "@/api/profile.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });
}

export function useProfileUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
