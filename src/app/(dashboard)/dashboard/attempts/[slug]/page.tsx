import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SongCard from "@/components/SongCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const formatScore = (score: any) => {
    return Number(score).toFixed(3);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">採点記録</h1>

      <div className="grid gap-6">
        <SongCard song={attempt.song} />

        <Card>
          <CardHeader>
            <CardTitle>採点結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">スコア</span>
                <span className="text-2xl font-bold">
                  {formatScore(attempt.score)}点
                </span>
              </div>

              {attempt.bonus && (
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="text-sm font-medium">ボーナス</span>
                  <span className="text-xl font-semibold">
                    {formatScore(attempt.bonus)}点
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">機種</span>
                <span className="text-lg font-medium">
                  {attempt.manufacturer}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium">記録日時</span>
                <span className="text-sm">
                  {new Date(attempt.createdAt).toLocaleString("ja-JP")}
                </span>
              </div>

              {attempt.imageUrl && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">採点画像</h3>
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
