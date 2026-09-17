
import { submitContact } from "@/api/contact.api";
import { useMutation } from "@tanstack/react-query";

export function useContact() {
  return useMutation({
    mutationFn: submitContact,
  });
}
