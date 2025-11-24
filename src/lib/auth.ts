import { env } from "@/lib/env";

export const logtoConfig = {
  endpoint: env.LOGTO_ENDPOINT,
  appId: env.LOGTO_APP_ID,
  appSecret: env.LOGTO_APP_SECRET,
  baseUrl: env.BASE_URL,
  cookieSecret: env.COOKIE_SECRET,
  cookieSecure: process.env.NODE_ENV === "production",
};
