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
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold">採点記録を編集</h1>
      <EditAttemptForm attempt={attempt} />
    </div>
  );
}
