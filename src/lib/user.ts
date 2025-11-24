"use server";

import { prisma } from "@/lib/db";
import { Plan } from "@/generated/prisma/enums";

export async function ensureUser(logtoUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: logtoUserId },
  });

  if (existingUser) {
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      id: logtoUserId,
      plan: Plan.FREE,
    },
  });
}
