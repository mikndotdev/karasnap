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
import { prisma } from "@/lib/db";
import { Plan } from "@/generated/prisma/enums";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { claims } = await getLogtoContext(logtoConfig);

  let userPlan = undefined;
  let userCredits = undefined;

  if (claims?.sub) {
    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { plan: true, credits: true },
    });
    userPlan = user?.plan || Plan.FREE;
    userCredits = user?.credits;
  }

  const isFreeUser = userPlan === Plan.FREE;

  return (
    <>
      <SidebarProvider>
        <div className={"hidden md:block"}>
          <AppSidebar
            user={claims}
            plan={userPlan}
            onSignOut={async () => {
              "use server";
              await signOut(logtoConfig);
            }}
          />
        </div>
        <SidebarInset className={"hidden md:block"}>
          {isFreeUser && (
            <div className="p-4 border-b">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground flex-1 font-bold">
                    無料プランをご利用中です。プレミアムにアップグレードしてより多くの機能をご利用ください！今月はあと
                    {userCredits}回記録できます。
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/settings">
                      <Settings className="size-4 mr-2" />
                      設定からアップグレード
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          {children}
        </SidebarInset>
        <div className={"md:hidden overflow-x-hidden w-full"}>{children}</div>
        <div className={"md:hidden"}>
          <AppDock />
        </div>
      </SidebarProvider>
    </>
  );
}
