import { gateway } from "@ai-sdk/gateway";
import { Output, ToolLoopAgent } from "ai";
import { spotifySearch } from "@/ai/search";
import { Manufacturer, RatingSystem } from "@/generated/prisma/enums";
import { env } from "@/lib/env";
import { z } from "zod";

import DamAIHeart from "@/assets/img/rating-systems/dam/ai-heart.png";
import DamAI from "@/assets/img/rating-systems/dam/ai.png";
import DamDXG from "@/assets/img/rating-systems/dam/dx-g.png";
import JoysoundMaster1 from "@/assets/img/rating-systems/joysound/master-1.png";
import JoysoundMaster2 from "@/assets/img/rating-systems/joysound/master-2.png";
import JoysoundAI from "@/assets/img/rating-systems/joysound/ai.png";

const agent = new ToolLoopAgent({
  tools: {
    spotifySearch,
  },
  model: gateway("google/gemini-2.5-flash"),
  output: Output.object({
    schema: z.object({
      title: z
        .string()
        .describe("The title of the song depicted in the image."),
      artist: z
        .string()
        .describe("The artist of the song depicted in the image."),
      score: z
        .number()
        .min(0)
        .max(100)
        .describe(
          "The score the user got singing the song. Do not truncate any decimals.",
        ),
      spotifyId: z.string().describe("The Spotify ID of the song."),
      bonusPoints: z
        .number()
        .min(0)
        .max(100)
        .describe(
          "The bonus points awarded based on performance. Will be a decimal between 0 and 100. Do not truncate any decimals.",
        )
        .optional(),
      manufacturer: z
        .enum(Manufacturer)
        .describe("The manufacturer of the karaoke machine used."),
      ratingSystem: z
        .enum(RatingSystem)
        .describe(
          "The rating system used by the karaoke machine to evaluate the singing performance.",
        ),
    }),
  }),
});

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function extractSongDataAndSystem(imageUrl: string) {
  const base64Image = await fetchImageAsBase64(imageUrl);

  const result = await agent.generate({
    messages: [
      {
        role: "system",
        content:
          "You are an AI that analyzes karaoke performance images to identify the song being sung and evaluate the user's singing score. Respond with the song title, artist, a singing score between 0 and 100, and a Spotify URL for the song. As for the song info such as the artist, if the text in the image is in Japanese, return the song info in Japanese as well. Keep in mind that the song name may be truncated in the image, so use your best judgment and searching Spotify if necessary to find the full song title and artist. Also, identify the manufacturer of the karaoke machine used from the following options: 'JOYSOUND', 'DAM', and also the specific rating system the karaoke machine used based on some sample images of each system. Additionally, provide bonus points awarded based on performance as a decimal between 0 and 100. Do not truncate any decimals in your response.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Here are example images of different rating systems:",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(`${env.BASE_URL}${DamAIHeart.src}`),
          },
          {
            type: "text",
            text: "This is an example image of the DAM AI Heart rating system.",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(`${env.BASE_URL}${DamAI.src}`),
          },
          {
            type: "text",
            text: "This is an example image of the DAM AI rating system.",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(`${env.BASE_URL}${DamDXG.src}`),
          },
          {
            type: "text",
            text: "This is an example image of the DAM DX-G rating system.",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(
              `${env.BASE_URL}${JoysoundMaster1.src}`,
            ),
          },
          {
            type: "text",
            text: "This is an example image of the first theme of the JOYSOUND Master rating system.",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(
              `${env.BASE_URL}${JoysoundMaster2.src}`,
            ),
          },
          {
            type: "text",
            text: "This is an example image of the second theme of the JOYSOUND Master rating system.",
          },
          {
            type: "image",
            image: await fetchImageAsBase64(`${env.BASE_URL}${JoysoundAI.src}`),
          },
          {
            type: "text",
            text: "This is an example image of the JOYSOUND AI rating system.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text" as const,
            text: "Now analyze this karaoke performance image:",
          },
          {
            type: "image" as const,
            image: base64Image,
          },
        ],
      },
    ],
  });

  return result.output;
}
