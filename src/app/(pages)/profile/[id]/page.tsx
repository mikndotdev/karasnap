import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AnimatedStatCard from "@/components/AnimatedStatCard";
import SongWithScore from "@/components/SongWithScore";
import UserCard from "@/components/UserCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return {};
  }

  const title = `${user.name}のプロフィール　- KaraSnap`;

  return {
    title,
    openGraph: {
      title,
      images: user.avatarUrl
        ? [
            {
              url: user.avatarUrl,
              width: 200,
              height: 200,
              alt: `${user.name}のプロフィール画像`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary",
      title,
      images: user.avatarUrl ? [user.avatarUrl] : [],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  const currentUserId = claims?.sub;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = isAuthenticated && currentUserId === id;

  if (user.profileHidden && !isOwnProfile) {
    notFound();
  }

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
      <UserCard user={user} />

      {isOwnProfile && user.profileHidden && (
        <Card className="">
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div
              className={
                "flex flex-col md:flex-row justify-center items-center gap-2"
              }
            >
              <Badge variant="outline">プライベート</Badge>
              <p className="text-sm text-muted-foreground">
                このプロフィールは公開されていません
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/settings">
                設定から公開に変更
                <Settings className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
