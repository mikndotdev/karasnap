import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./client";
import { env } from "@/lib/env";

export default async function DashboardPage() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <DashboardClient s3BaseUrl={env.S3_BASE_URL} />;
}
