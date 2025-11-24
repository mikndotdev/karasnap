"use server";

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { extractSongData } from "@/ai/analyze";

export async function analyzeSongImage(imageUrl: string) {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    throw new Error("Unauthorized");
  }

  const songData = await extractSongData(imageUrl);

  return songData;
}
