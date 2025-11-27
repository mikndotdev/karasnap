import { env } from "@/lib/env";

export default function ImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality: number;
}) {
  if (process.env.NODE_ENV === "development") {
    return src;
  }
  const params = [`size=${width}`];
  params.push(`quality=${quality || 75}`);
  return `${env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL}/${encodeURIComponent(`${env.NEXT_PUBLIC_BASE_URL}${src}`)}?${params.join("&")}`;
}
