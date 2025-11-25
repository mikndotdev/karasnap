import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Song } from "@/generated/prisma/client";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardContent className="p-4 w-full max-w-full">
        <div className="flex items-center gap-4 w-full max-w-full min-w-0">
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
            <h3 className="font-semibold text-lg truncate">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {song.artist}
            </p>
          </div>

          {song.spotifyId && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Link
                href={`https://open.spotify.com/track/${song.spotifyId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4 mr-2" />
                Spotify
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
