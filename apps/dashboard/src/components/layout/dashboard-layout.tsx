import { SidebarInset, SidebarProvider } from "@binspire/ui/components/sidebar";
import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SearchProvider } from "@/context/search-provider";
import DashboardHeader from "@/features/dashboard/components/header";
import DeleteDialogRegistry from "@/registry/delete-dialog-registry";
import UpdateDialogRegistry from "@/registry/update-dialog-registry";
import { useLayout } from "@/store/layout-store";
import AppSidebar from "../sidebar/app-sidebar";
import ViewsContainer from "../views/views-container";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { layout } = useLayout();

  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div
            className={`px-5 pb-4 mt-4 ${layout === "full" ? "" : "mx-auto"}`}
          >
            {children ?? <Outlet />}
          </div>
          <ViewsContainer />
          <DeleteDialogRegistry />
          <UpdateDialogRegistry />
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
}
