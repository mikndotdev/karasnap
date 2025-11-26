import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AnimatedStatCard from "@/components/AnimatedStatCard";
import SongWithScore from "@/components/SongWithScore";
import UserCard from "@/components/UserCard";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  const currentUserId = claims?.sub;

  // Fetch the user profile
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  // Check if this is the user viewing their own profile
  const isOwnProfile = isAuthenticated && currentUserId === id;

  // If profile is hidden and not own profile, return not found
  if (user.profileHidden && !isOwnProfile) {
    notFound();
  }

  // Fetch user stats
  const totalAttempts = await prisma.attempt.count({
    where: { userId: id },
  });

  const uniqueSongs = await prisma.attempt.groupBy({
    by: ["songId"],
    where: { userId: id },
  });

  const bestAttempt = await prisma.attempt.findFirst({
    where: { userId: id },
    orderBy: { score: "desc" },
    include: { song: true },
  });

  const recentAttempts = await prisma.attempt.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { song: true },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* User Card at the top */}
      <UserCard user={user} />

      {/* Show private profile alert if viewing own private profile */}
      {isOwnProfile && user.profileHidden && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
            プライベート
          </Badge>
          <p className="ml-2 text-sm text-muted-foreground inline">
            このプロフィールは公開されていません
          </p>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatedStatCard title="歌った回数" value={totalAttempts} />
        <AnimatedStatCard title="歌った曲数" value={uniqueSongs.length} />
      </div>

      {/* Best Score */}
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

      {/* Recent Attempts */}
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
