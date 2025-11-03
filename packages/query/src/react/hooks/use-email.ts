import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailApi, type SendInviteData } from "../../core";

export function useSendInvitationEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendInviteData) => await EmailApi.sendInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    },
  });
}
