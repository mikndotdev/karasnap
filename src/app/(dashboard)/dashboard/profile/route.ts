import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated || !claims?.sub) {
    redirect("/login");
  }

  // Redirect to the user's public profile page
  redirect(`/profile/${claims.sub}`);
}
