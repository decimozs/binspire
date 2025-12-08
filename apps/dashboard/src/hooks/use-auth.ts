import { useMutation } from "@binspire/query";
import { rpc } from "@binspire/query/api-client";
import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";

export function useVerifyPassword() {
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: { newPassword: string; currentPassword: string };
    }) => await authClient.changePassword(data),
    onError: (error) => {
      ShowToast(
        "error",
        error.message || "Failed to verify password. Something went wrong.",
      );
    },
  });
}

export function useLogout() {
  const { data } = authClient.useSession();
  const orgId = data?.user.orgId;
  const username = data?.user.name;
  const userId = data?.user.id;

  return useMutation({
    mutationFn: async () => await authClient.signOut(),
    onError: (error) => {
      ShowToast(
        "error",
        error.message || "Failed to logout. Something went wrong.",
      );
    },
    onMutate: async () => {
      const response = await rpc.api.history.create.$post({
        json: {
          title: `User ${username} signed out`,
          entity: "authentication",
          orgId: orgId!,
          userId: userId!,
        },
      });

      if (!response.ok) throw new Error("Failed to signed out");

      window.location.href = "https://www.binspire.space/login";
    },
  });
}
