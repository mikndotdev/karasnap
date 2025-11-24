import { tool } from "ai";
import { z } from "zod";
import { getSpotifyToken } from "@/lib/spotify-login";

export const spotifySearch = tool({
  description: "Search for songs on Spotify.",
  inputSchema: z.object({
    title: z.string().describe("The title of the song to search for."),
    artist: z
      .string()
      .optional()
      .describe("The artist of the song to search for."),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string().describe("The title of the song."),
      artist: z.string().describe("The artist of the song."),
      album: z.string().describe("The album of the song."),
      spotifyUrl: z.string().describe("The Spotify URL of the song."),
    }),
  ),
  execute: async ({ title, artist }) => {
    const token = await getSpotifyToken();
    const query = artist ? `track:${title} artist:${artist}` : `track:${title}`;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search Spotify");
    }

    const data = await response.json();
    return data.tracks.items.map((item: any) => ({
      title: item.name,
      artist: item.artists.map((artist: any) => artist.name).join(", "),
      album: item.album.name,
      spotifyId: item.id,
    }));
  },
});
