import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/animate-ui/components/radix/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/Sidebar";
import { AppDock } from "@/components/AppDock";
import { getLogtoContext, signOut } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { claims } = await getLogtoContext(logtoConfig);
  return (
    <>
      <SidebarProvider>
        <div className={"hidden md:block"}>
          <AppSidebar
            user={claims}
            onSignOut={async () => {
              "use server";
              await signOut(logtoConfig);
            }}
          />
        </div>
        <SidebarInset className={"hidden md:block"}>{children}</SidebarInset>
        <div className={"md:hidden overflow-x-hidden w-full"}>{children}</div>
        <div className={"md:hidden"}>
          <AppDock />
        </div>
      </SidebarProvider>
    </>
  );
}
