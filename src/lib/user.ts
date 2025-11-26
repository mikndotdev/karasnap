"use server";

import { prisma } from "@/lib/db";
import { Plan } from "@/generated/prisma/enums";

export async function ensureUser(
  logtoUserId: string,
  name?: string | null,
  avatarUrl?: string | null,
) {
  const existingUser = await prisma.user.findUnique({
    where: { id: logtoUserId },
  });

  if (existingUser) {
    // Update name and avatar if they've changed
    const needsUpdate =
      (name && existingUser.name !== name) ||
      (avatarUrl && existingUser.avatarUrl !== avatarUrl);

    if (needsUpdate) {
      return await prisma.user.update({
        where: { id: logtoUserId },
        data: {
          ...(name && { name }),
          ...(avatarUrl && { avatarUrl }),
        },
      });
    }

    return existingUser;
  }

  return await prisma.user.create({
    data: {
      id: logtoUserId,
      plan: Plan.FREE,
      name: name ?? null,
      avatarUrl: avatarUrl ?? null,
    },
  });
}
