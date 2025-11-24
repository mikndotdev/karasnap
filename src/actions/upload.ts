"use server";

import { createPresignedUploadURL } from "@/lib/s3";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";

export async function getImageUploadURL(): Promise<{
  uploadUrl: string;
  imageKey: string;
}> {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    throw new Error("Unauthorized");
  }

  const userId = claims?.sub;

  const key = `karasnap/${userId}/${Date.now()}.jpg`;
  const contentType = "image/jpeg";

  const uploadUrl = await createPresignedUploadURL(key, contentType, 600);

  return { uploadUrl, imageKey: key };
}
