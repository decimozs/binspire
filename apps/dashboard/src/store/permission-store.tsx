import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import type { UserPermissionOpts, UserRole } from "@binspire/shared";
import { UserStatusApi } from "@binspire/query";

interface PermissionStore {
  permission: UserPermissionOpts;
  isSuperuser: boolean;
  role: UserRole;
  setPermission: (permission: UserPermissionOpts) => void;
  setIsSuperuser: (isSuperuser: boolean) => void;
  setRole: (role: UserRole) => void;
  refreshPermission: () => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  permission: {},
  isSuperuser: false,
  role: "not-set",
  setPermission: (permission) => set({ permission }),
  setIsSuperuser: (isSuperuser) => set({ isSuperuser }),
  setRole: (role) => set({ role }),
  refreshPermission: async () => {
    const { data } = authClient.useSession();
    const currentSession = data?.user;
    const userStatus = await UserStatusApi.getByUserId(currentSession!.id);

    set({ permission: userStatus.permission });
  },
}));
