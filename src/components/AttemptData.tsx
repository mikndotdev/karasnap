import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Pencil } from "lucide-react";
import type { Attempt } from "@/generated/prisma/client";
import Link from "next/link";
import { Button } from "@/components/animate-ui/components/buttons/button";

interface AttemptDataProps {
  attempt: Attempt;
  isBest?: boolean;
  attemptId: string;
}

export default function AttemptData({
  attempt,
  isBest,
  attemptId,
}: AttemptDataProps) {
  const formatScore = (score: any) => {
    return Number(score).toFixed(3);
  };

  return (
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
            <span className="text-lg font-medium">{attempt.manufacturer}</span>
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

          <Link
            href={`/dashboard/attempts/${attemptId}/edit`}
            className="block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Pencil className="size-4" />
              編集
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
