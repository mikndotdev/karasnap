import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SongCard from "@/components/SongCard";
import AttemptData from "@/components/AttemptData";
import { redirect } from "next/navigation";

interface AttemptPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AttemptPage({ params }: AttemptPageProps) {
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

  const highestAttempt = await prisma.attempt.findFirst({
    where: {
      songId: attempt.songId,
      userId: claims.sub,
    },
    orderBy: {
      score: "desc",
    },
  });

  const isBest = highestAttempt?.id === attempt.id;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="grid gap-4 md:gap-6">
        <SongCard song={attempt.song} />
        <AttemptData attempt={attempt} isBest={isBest} attemptId={slug} />
      </div>
    </div>
  );
}
