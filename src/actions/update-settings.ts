"use server";

import { prisma } from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileVisibility(isHidden: boolean) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: claims.sub },
    data: { profileHidden: isHidden },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/profile/${claims.sub}`);
}

export async function updateAutoShareAttempts(autoShare: boolean) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: claims.sub },
    data: { autoShareAttempts: autoShare },
  });

  revalidatePath("/dashboard/settings");
}
