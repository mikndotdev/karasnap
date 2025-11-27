import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Plan } from "@/generated/prisma/enums";
import UserCard from "@/components/UserCard";
import SettingsForm from "@/components/SettingsForm";
import PricingTable from "@/components/PricingTable";
import PricingCard from "@/components/PricingCard";
import { SparklesText } from "@/components/ui/sparkles-text";

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
      {user.plan === Plan.FREE && (
        <>
          <div className="mt-8 flex flex-col md:flex-row justify-center items-center">
            <SparklesText
              className={"text-2xl md:text-4xl"}
              colors={{ first: "#FF7700", second: "#FF9900" }}
              sparklesCount={8}
            >
              プレミアムプラン
            </SparklesText>
            <p className={"font-bold text-2xl md:text-4xl"}>
              で更に快適なカラオケライフを！
            </p>
          </div>
          <div className={"flex flex-col md:flex-row gap-4 w-full"}>
            <PricingCard
              title={"無料プラン"}
              price={"永年無料"}
              buttonText={"現在利用中"}
              buttonDisabled
            />
            <PricingCard
              title={"プレミアムプラン"}
              price={"月額350円"}
              buttonText={"Coming soon..."}
              buttonDisabled
            />
            <PricingCard
              title={"プレミアムプラン（年額）"}
              price={"年額3500円"}
              buttonText={"Coming soon..."}
              buttonDisabled
            />
          </div>
          <PricingTable />
        </>
      )}
    </div>
  );
}
