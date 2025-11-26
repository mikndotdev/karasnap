"use server";

import { prisma } from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";

export async function toggleAttemptShare(attemptId: string, isShared: boolean) {
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

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { isShared },
  });

  return { success: true };
}
