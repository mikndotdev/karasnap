import { getLogtoContext, signIn } from "@logto/next/server-actions";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Button
        onClick={async () => {
          "use server";
          await signIn(logtoConfig);
        }}
      >
        Sign In
      </Button>
    </div>
  );
}
