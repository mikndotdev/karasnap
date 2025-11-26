import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import UserCard from "@/components/UserCard";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <UserCard user={user} />
      <SettingsForm user={user} />
    </div>
  );
}
