"use client";

import { Switch } from "@/components/animate-ui/components/radix/switch";
import { toggleAttemptShare } from "@/actions/toggle-share";
import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";

interface ShareAttemptToggleProps {
  attemptId: string;
  initialShared: boolean;
}

export default function ShareAttemptToggle({
  attemptId,
  initialShared,
}: ShareAttemptToggleProps) {
  const [isShared, setIsShared] = useState(initialShared);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await toggleAttemptShare(attemptId, checked);
      setIsShared(checked);
    } catch (error) {
      console.error("Failed to toggle share:", error);
      setIsShared(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyUrl = async () => {
    const shareUrl = `${window.location.origin}/share/${attemptId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Share2 className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            共有（写真も公開されます）
          </span>
        </div>
        <Switch
          checked={isShared}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
        />
      </div>

      {isShared && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleCopyUrl}
        >
          {copied ? (
            <>
              <Check className="size-4" />
              コピーしました
            </>
          ) : (
            <>
              <Copy className="size-4" />
              共有リンクをコピー
            </>
          )}
        </Button>
      )}
    </div>
  );
}
