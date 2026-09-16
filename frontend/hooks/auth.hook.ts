

// export function useRegistration() {
//   return useMutation({
//     mutationFn: userRegistration,
//   });
// }

import { getMe } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";



export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

