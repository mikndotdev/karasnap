"use server";

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { extractSongData } from "@/ai/analyze";
import { prisma } from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { getCoverArt } from "@/lib/get-cover-art";

export async function analyzeSongImage(imageUrl: string) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    throw new Error("Unauthorized");
  }

  const songData = await extractSongData(imageUrl);

  const user = await ensureUser(claims.sub);

  const spotifyId = songData.spotifyId ? new URL(songData.spotifyId).pathname.split('/').pop() : null;
  const cleanSpotifyId = spotifyId?.replace(/^track:/, '') ?? null;

  let song = cleanSpotifyId
    ? await prisma.song.findFirst({
        where: { spotifyId: cleanSpotifyId },
      })
    : null;

  if (!song) {
    const coverArt = cleanSpotifyId ? await getCoverArt(cleanSpotifyId) : null;
    
    song = await prisma.song.create({
      data: {
        title: songData.title,
        artist: songData.artist,
        spotifyId: cleanSpotifyId,
        coverArt: coverArt,
      },
    });
  }

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      songId: song.id,
      imageUrl: imageUrl,
      score: songData.score,
      bonus: songData.bonusPoints ?? null,
      manufacturer: songData.manufacturer,
    },
  });

  return {
    ...songData,
    attemptId: attempt.id,
  };
}
