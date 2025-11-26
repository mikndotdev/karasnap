"use client";
import { ReactNode } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import { env } from "@/lib/env";

export default function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const paddle = initializePaddle({
    token: env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
  });

  return <>{children}</>;
}
