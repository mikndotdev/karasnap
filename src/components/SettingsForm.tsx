"use client";

import { Switch } from "@/components/animate-ui/components/radix/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  updateProfileVisibility,
  updateAutoShareAttempts,
} from "@/actions/update-settings";
import { useState } from "react";
import { EyeOff, Share2 } from "lucide-react";
import type { User } from "@/generated/prisma/client";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [profileHidden, setProfileHidden] = useState(user.profileHidden);
  const [autoShareAttempts, setAutoShareAttempts] = useState(
    user.autoShareAttempts,
  );
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingAutoShare, setIsUpdatingAutoShare] = useState(false);

  const handleProfileVisibilityToggle = async (checked: boolean) => {
    setIsUpdatingProfile(true);
    try {
      await updateProfileVisibility(checked);
      setProfileHidden(checked);
    } catch (error) {
      console.error("Failed to update profile visibility:", error);
      setProfileHidden(!checked);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAutoShareToggle = async (checked: boolean) => {
    setIsUpdatingAutoShare(true);
    try {
      await updateAutoShareAttempts(checked);
      setAutoShareAttempts(checked);
    } catch (error) {
      console.error("Failed to update auto share setting:", error);
      setAutoShareAttempts(!checked);
    } finally {
      setIsUpdatingAutoShare(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>プライバシー設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <EyeOff className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  プロフィールを非公開にする
                </span>
                <span className="text-xs text-muted-foreground">
                  他のユーザーからプロフィールを見えなくします
                </span>
              </div>
            </div>
            <Switch
              checked={profileHidden}
              onCheckedChange={handleProfileVisibilityToggle}
              disabled={isUpdatingProfile}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Share2 className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  自動的に記録を共有する
                </span>
                <span className="text-xs text-muted-foreground">
                  新しい記録を自動的に公開します
                </span>
              </div>
            </div>
            <Switch
              checked={autoShareAttempts}
              onCheckedChange={handleAutoShareToggle}
              disabled={isUpdatingAutoShare}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
