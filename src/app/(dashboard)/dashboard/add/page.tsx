import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import Add from "@/components/add";
import { env } from "@/lib/env";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: { plan: true, credits: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <Add
      s3BaseUrl={env.S3_BASE_URL}
      userPlan={user.plan}
      userCredits={user.credits}
    />
  );
}
