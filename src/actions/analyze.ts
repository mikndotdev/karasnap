"use server";

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { extractSongData } from "@/ai/analyze";
import { extractSongDataAndSystem } from "@/ai/analyze-with-system";
import { prisma } from "@/lib/db";
import { ensureUser } from "@/lib/user";
import { getCoverArt } from "@/lib/get-cover-art";
import { Plan, RatingSystem } from "@/generated/prisma/enums";

export async function analyzeSongImage(
  imageUrl: string,
  captureDate: string | null = null,
) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    throw new Error("Unauthorized");
  }

  const user = await ensureUser(claims.sub, claims.name, claims.picture);

  const isPremium = user.plan === Plan.PREMIUM;

  let songData;
  let ratingSystem: RatingSystem;

  if (isPremium) {
    const premiumData = await extractSongDataAndSystem(imageUrl);
    songData = premiumData;
    ratingSystem = premiumData.ratingSystem;
  } else {
    songData = await extractSongData(imageUrl);
    ratingSystem = RatingSystem.OTHER;
  }

  const spotifyId = songData.spotifyId ? songData.spotifyId : null;
  const cleanSpotifyId = spotifyId?.replace(/^track:/, "") ?? null;

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

  const attemptDate = captureDate ? new Date(captureDate) : new Date();

  if (!isPremium) {
    if (user.credits <= 0) {
      throw new Error("No credits remaining");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } },
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
      ratingSystem: ratingSystem,
      createdAt: attemptDate,
      isShared: user.autoShareAttempts,
    },
  });

  if (!isPremium) {
    const attemptCount = await prisma.attempt.count({
      where: { userId: user.id },
    });

    if (attemptCount > 50) {
      const oldestAttempt = await prisma.attempt.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });

      if (oldestAttempt) {
        await prisma.attempt.delete({
          where: { id: oldestAttempt.id },
        });
      }
    }
  }

  return {
    ...songData,
    attemptId: attempt.id,
  };
}
