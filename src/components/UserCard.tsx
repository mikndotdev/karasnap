import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/generated/prisma/client";
import { Plan } from "@/generated/prisma/enums";

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardContent className="p-4 w-full max-w-full">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-full min-w-0 text-center md:text-left">
          <div className="flex-shrink-0 w-20 h-20 relative rounded-full overflow-hidden bg-muted">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name || "User"} のプロフィール画像`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
            <h3 className="font-bold text-lg truncate">
              {user.name || "Unknown User"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              UID {user.id}
            </p>
          </div>

          <Badge className="flex-shrink-0">
            {user.plan === Plan.FREE ? "無料プラン" : "プレミアムプラン"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
