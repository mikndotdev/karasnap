"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Song } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";

type Manufacturer = "DAM" | "JOYSOUND" | "OTHER";

interface SongCardProps {
  song: Song;
  score?: number;
  date?: Date;
  manufacturer?: Manufacturer;
  isTopScore?: boolean;
  href?: string;
}

export default function SongWithScore({
  song,
  score,
  date,
  manufacturer,
  isTopScore,
  href,
}: SongCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <Card
      className={`w-full max-w-full overflow-hidden ${href ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}`}
      onClick={handleClick}
    >
      <CardContent className="w-full max-w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full max-w-full min-w-0">
          <div className="flex items-center gap-4 w-full md:flex-1 min-w-0 max-w-full overflow-hidden">
            <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden bg-muted">
              {song.coverArt ? (
                <img
                  src={song.coverArt}
                  alt={`${song.title} のカバーアート`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 max-w-full overflow-hidden">
              <span className="text-sm text-muted-foreground mb-1 block truncate">
                {date ? new Date(date).toLocaleString() : ""}
              </span>
              <h3 className="font-semibold text-lg truncate">{song.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {song.artist}
              </p>
            </div>
          </div>

          {score !== undefined && (
            <div
              className={
                "flex flex-col text-left md:text-right w-full md:w-auto flex-shrink-0"
              }
            >
              {isTopScore && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  自己ベスト
                </span>
              )}
              <div className="text-4xl font-bold whitespace-nowrap">
                {score.toFixed(3)}点
              </div>
              {manufacturer && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {manufacturer === "OTHER" ? "その他" : manufacturer}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
