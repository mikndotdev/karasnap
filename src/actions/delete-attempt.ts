"use server";

import { prisma } from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export async function deleteAttempt(attemptId: string) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    throw new Error("Unauthorized");
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  if (attempt.userId !== claims.sub) {
    throw new Error("Unauthorized");
  }

  // Extract S3 key from the imageUrl
  // Assuming imageUrl format is something like: https://bucket.s3.region.amazonaws.com/key
  // or https://endpoint/bucket/key
  try {
    const url = new URL(attempt.imageUrl);
    // Get the path and remove leading slash, also handle bucket name in path if needed
    const pathParts = url.pathname.split("/").filter(Boolean);
    // If the URL includes bucket name in path, remove it; otherwise use full path
    const key = pathParts.join("/");

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);
  } catch (error) {
    console.error("Failed to delete image from S3:", error);
    // Continue with database deletion even if S3 deletion fails
  }

  await prisma.attempt.delete({
    where: { id: attemptId },
  });

  redirect("/dashboard");
}
