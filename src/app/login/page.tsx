import { getLogtoContext, signIn } from "@logto/next/server-actions";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { logtoConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

import MikanLogo from "@/assets/img/mikan-vt.png";

export default async function LoginPage() {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className={"container mx-auto max-w-11/12 md:max-w-md"}>
        <CardHeader className="flex flex-col md:flex-row items-center justify-center space-y-4 space-x-2 ">
          <Image src={MikanLogo} alt="Mikan Logo" width={128} height={128} />
        </CardHeader>
        <CardContent className={"text-center text-muted-foreground"}>
          <Button
            onClick={async () => {
              "use server";
              await signIn(logtoConfig);
            }}
            className={"m-4 w-11/12"}
          >
            ログインする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
