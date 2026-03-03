import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      company,
      message,
    }: {
      name: string;
      email: string;
      company: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContactForm(name, email, company, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactForms"] });
    },
  });
}
