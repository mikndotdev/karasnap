import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import SongCard from "@/components/SongCard";
import SongBestScore from "@/components/SongBestScore";
import SongScoreChart from "@/components/SongScoreChart";
import SongAttemptsTable from "@/components/SongAttemptsTable";

interface SongPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SongPage({ params }: SongPageProps) {
  const { slug } = await params;
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const song = await prisma.song.findUnique({
    where: { id: slug },
  });

  if (!song) {
    notFound();
  }

  const attempts = await prisma.attempt.findMany({
    where: {
      songId: slug,
      userId: claims.sub,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (attempts.length === 0) {
    notFound();
  }

  const bestAttempt = [...attempts].sort(
    (a, b) => Number(b.score) - Number(a.score)
  )[0];

  const chartData = attempts.map((attempt) => ({
    date: new Date(attempt.createdAt).toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    }),
    score: Number(attempt.score),
    manufacturer: attempt.manufacturer,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <div className="grid gap-4 md:gap-6">
        <SongCard song={song} />
        <SongBestScore
          score={Number(bestAttempt.score)}
          bonus={bestAttempt.bonus ? Number(bestAttempt.bonus) : undefined}
          manufacturer={bestAttempt.manufacturer}
        />
        <SongScoreChart data={chartData} />
        <SongAttemptsTable
          attempts={attempts.map((attempt) => ({
            id: attempt.id,
            score: Number(attempt.score),
            bonus: attempt.bonus ? Number(attempt.bonus) : null,
            manufacturer: attempt.manufacturer,
            createdAt: attempt.createdAt,
          }))}
        />
      </div>
    </div>
  );
}
