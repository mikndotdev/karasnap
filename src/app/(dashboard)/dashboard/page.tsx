import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ensureUser } from "@/lib/user";
import AnimatedStatCard from "@/components/AnimatedStatCard";
import SongWithScore from "@/components/SongWithScore";
import UserCard from "@/components/UserCard";

export default async function DashboardPage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    redirect("/login");
  }

  const userId = claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  await ensureUser(userId, claims?.name, claims?.picture);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect("/login");
  }

  const totalAttempts = await prisma.attempt.count({
    where: { userId },
  });

  const uniqueSongs = await prisma.attempt.groupBy({
    by: ["songId"],
    where: { userId },
  });

  const bestAttempt = await prisma.attempt.findFirst({
    where: { userId },
    orderBy: { score: "desc" },
    include: { song: true },
  });

  const recentAttempts = await prisma.attempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { song: true },
  });

  return (
    <div className="w-full container mx-auto p-4 md:p-6 pb-24 md:pb-6 space-y-8">
      <UserCard user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedStatCard title="歌った回数" value={totalAttempts} />
        <AnimatedStatCard title="歌った曲数" value={uniqueSongs.length} />
      </div>

      {bestAttempt && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">ベストスコア</h2>
          <SongWithScore
            song={bestAttempt.song}
            score={Number(bestAttempt.score)}
            date={bestAttempt.createdAt}
            manufacturer={bestAttempt.manufacturer}
            isTopScore={true}
            href={`/dashboard/attempts/${bestAttempt.id}`}
          />
        </div>
      )}

      {recentAttempts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">最近歌った曲</h2>
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <SongWithScore
                key={attempt.id}
                song={attempt.song}
                score={Number(attempt.score)}
                date={attempt.createdAt}
                manufacturer={attempt.manufacturer}
                href={`/dashboard/attempts/${attempt.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
