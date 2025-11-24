import { gateway } from "@ai-sdk/gateway";
import { Output, ToolLoopAgent } from "ai";
import { spotifySearch } from "@/ai/search";
import { Manufacturer } from "@/generated/prisma/enums";
import { z } from "zod";

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
      spotifyId: z.url().describe("The Spotify ID of the song."),
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
    }),
  }),
});

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function extractSongData(imageUrl: string) {
  const base64Image = await fetchImageAsBase64(imageUrl);

  const result = await agent.generate({
    messages: [
      {
        role: "system",
        content:
          "You are an AI that analyzes karaoke performance images to identify the song being sung and evaluate the user's singing score. Respond with the song title, artist, a singing score between 0 and 100, and a Spotify URL for the song. As for the song info such as the artist, if the text in the image is in Japanese, return the song info in Japanese as well. Keep in mind that the song name may be truncated in the image, so use your best judgment and searching Spotify if necessary to find the full song title and artist. Also, identify the manufacturer of the karaoke machine used from the following options: 'JOYSOUND', 'DAM'. Additionally, provide bonus points awarded based on performance as a decimal between 0 and 100. Do not truncate any decimals in your response.",
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: base64Image,
          },
        ],
      },
    ],
  });

  return result.output;
}
