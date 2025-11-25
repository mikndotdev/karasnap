import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SongWithScore from "@/components/SongWithScore";

export default async function SongsPage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const songs = await prisma.song.findMany({
    where: {
      attempts: {
        some: {
          userId: claims.sub,
        },
      },
    },
    include: {
      attempts: {
        where: {
          userId: claims.sub,
        },
        orderBy: {
          score: "desc",
        },
        take: 1,
      },
    },
  });

  const songsWithBestScore = songs.map((song) => ({
    song,
    bestScore: song.attempts[0]?.score ? Number(song.attempts[0].score) : 0,
  }));

  songsWithBestScore.sort((a, b) => b.bestScore - a.bestScore);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">歌った曲</h1>
      <div className="grid gap-4">
        {songsWithBestScore.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            まだ曲がありません
          </p>
        ) : (
          songsWithBestScore.map(({ song, bestScore }) => (
            <SongWithScore
              key={song.id}
              song={song}
              score={bestScore}
              isTopScore={true}
              href={`/dashboard/songs/${song.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
