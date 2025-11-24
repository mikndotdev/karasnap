import { getSpotifyToken } from "@/lib/spotify-login";

export async function getCoverArt(spotifyId: string): Promise<string | null> {
  try {
    const token = await getSpotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${spotifyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.album?.images && data.album.images.length > 0) {
      return data.album.images[0].url;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch cover art:", error);
    return null;
  }
}
