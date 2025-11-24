import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export default async function DashboardPage() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    redirect("/login");
  }

  return null;
}
