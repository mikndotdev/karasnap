import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SongWithScore from "@/components/SongWithScore";

export default async function HistoryPage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  const attempts = await prisma.attempt.findMany({
    where: {
      userId: claims.sub,
    },
    include: {
      song: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">歌唱履歴</h1>
      <div className="grid gap-4">
        {attempts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            まだ記録がありません
          </p>
        ) : (
          attempts.map((attempt) => (
            <SongWithScore
              key={attempt.id}
              song={attempt.song}
              date={attempt.createdAt}
              score={Number(attempt.score)}
              manufacturer={attempt.manufacturer}
              href={`/dashboard/attempts/${attempt.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
