"use server";

import { prisma } from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { Manufacturer, RatingSystem } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function updateAttempt(formData: {
  attemptId: string;
  score: string;
  bonus: string;
  manufacturer: Manufacturer;
  ratingSystem: RatingSystem;
  createdAt: string;
}): Promise<{ success: boolean; error?: string }> {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: formData.attemptId },
    });

    if (!attempt) {
      return { success: false, error: "記録が見つかりませんでした" };
    }

    if (attempt.userId !== claims.sub) {
      return { success: false, error: "この記録を編集する権限がありません" };
    }

    await prisma.attempt.update({
      where: { id: formData.attemptId },
      data: {
        score: formData.score,
        bonus: formData.bonus || null,
        manufacturer: formData.manufacturer,
        ratingSystem: formData.ratingSystem,
        createdAt: new Date(formData.createdAt),
      },
    });

    revalidatePath(`/dashboard/attempts/${formData.attemptId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error updating attempt:", error);
    return { success: false, error: "更新に失敗しました" };
  }
}
