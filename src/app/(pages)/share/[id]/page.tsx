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

export async function generateMetadata({ params }: SharePageProps) {
  const { id } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      song: true,
      user: true,
    },
  });

  if (!attempt || !attempt.isShared) {
    return {};
  }

  const formatScore = (score: any) => {
    return Number(score).toFixed(3);
  };

  const title = `${attempt.user.name}が${formatScore(attempt.score)}点を獲得 - ${attempt.song.title}`;
  const description = "KaraSnapで見てみよう！";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: attempt.imageUrl
        ? [
            {
              url: attempt.imageUrl,
              width: 1200,
              height: 630,
              alt: `${attempt.user.name}の採点結果`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: attempt.imageUrl ? [attempt.imageUrl] : [],
    },
  };
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

  if (!attempt || !attempt.isShared) {
    notFound();
  }

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
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid gap-4 md:gap-6">
        <UserCard user={attempt.user} />

        <SongCard song={attempt.song} />

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
