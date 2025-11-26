import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SongCard from "@/components/SongCard";
import UserCard from "@/components/UserCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { RatingSystem } from "@/generated/prisma/client";
import { getRatingSystemText } from "@/lib/rating-system-text";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      song: true,
      user: true,
    },
  });

  // If attempt doesn't exist or is not shared, show not found
  if (!attempt || !attempt.isShared) {
    notFound();
  }

  // Check if this is the user's best score for this song
  const highestAttempt = await prisma.attempt.findFirst({
    where: {
      songId: attempt.songId,
      userId: attempt.userId,
    },
    orderBy: {
      score: "desc",
    },
  });

  const isBest = highestAttempt?.id === attempt.id;

  const formatScore = (score: any) => {
    return Number(score).toFixed(3);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid gap-4 md:gap-6">
        {/* User Card at the top */}
        <UserCard user={attempt.user} />

        {/* Song Card */}
        <SongCard song={attempt.song} />

        {/* Attempt Data (without photo and buttons) */}
        <Card>
          <CardHeader
            className={"text-center flex flex-col items-center justify-center"}
          >
            <span className="text-6xl font-bold">
              {formatScore(attempt.score)}点
            </span>
            {attempt.bonus && (
              <span className="text-xl">
                （内ボーナス{formatScore(attempt.bonus)}点）
              </span>
            )}
            {isBest && (
              <Badge className="mt-2 px-3 py-1 flex items-center gap-1">
                <Trophy className="size-4" />
                この曲の自己ベスト
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">機種</span>
                <div className={"flex flex-row"}>
                  <span className="text-lg font-medium">
                    {attempt.manufacturer}
                  </span>
                  {attempt.ratingSystem === RatingSystem.OTHER ? null : (
                    <Badge className="ml-2 px-2 py-1">
                      {getRatingSystemText(attempt.ratingSystem).name}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">記録日時</span>
                <span className="text-sm">
                  {new Date(attempt.createdAt).toLocaleString("ja-JP")}
                </span>
              </div>

              {attempt.imageUrl && (
                <div className="mt-6">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <img
                      src={attempt.imageUrl}
                      alt="採点画像"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
