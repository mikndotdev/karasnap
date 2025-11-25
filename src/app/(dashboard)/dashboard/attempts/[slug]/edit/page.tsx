import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import EditAttemptForm from "@/components/EditAttemptForm";

interface EditAttemptPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditAttemptPage({
  params,
}: EditAttemptPageProps) {
  const { slug } = await params;
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: slug },
    include: {
      song: true,
      user: true,
    },
  });

  if (!attempt) {
    notFound();
  }

  if (attempt.userId !== claims.sub) {
    notFound();
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        採点記録を編集
      </h1>
      <EditAttemptForm attempt={attempt} />
    </div>
  );
}
