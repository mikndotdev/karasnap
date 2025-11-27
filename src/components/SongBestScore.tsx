import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Manufacturer } from "@/generated/prisma/client";

interface SongBestScoreProps {
  score: number;
  bonus?: number;
  manufacturer: Manufacturer;
}

export default function SongBestScore({
  score,
  bonus,
  manufacturer,
}: SongBestScoreProps) {
  const formatScore = (value: number) => {
    return value.toFixed(3);
  };

  const manufacturerLabels: Record<Manufacturer, string> = {
    DAM: "DAM",
    JOYSOUND: "JOYSOUND",
    OTHER: "その他",
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader
        className={"text-center flex flex-col items-center justify-center"}
      >
        <Badge className="mb-2 px-3 py-1 flex items-center gap-1">
          <Trophy className="size-4" />
          自己ベスト
        </Badge>
        <span className="text-6xl font-bold">{formatScore(score)}点</span>
        {bonus && (
          <span className="text-xl">（内ボーナス{formatScore(bonus)}点）</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium mr-4">機種</span>
          <span className="text-lg font-medium">
            {manufacturerLabels[manufacturer]}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
