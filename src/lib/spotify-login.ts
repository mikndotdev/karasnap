import { env } from "@/lib/env";

export const getSpotifyToken = async (): Promise<string> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.SPOTIFY_CLIENT_ID,
      client_secret: env.SPOTIFY_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  const data = await response.json();
  return data.access_token;
};
