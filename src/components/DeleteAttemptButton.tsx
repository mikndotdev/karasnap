"use client";

import { Button } from "@/components/animate-ui/components/buttons/button";
import { Trash2, X, Check } from "lucide-react";
import { deleteAttempt } from "@/actions/delete-attempt";
import { useState } from "react";

interface DeleteAttemptButtonProps {
  attemptId: string;
}

export default function DeleteAttemptButton({
  attemptId,
}: DeleteAttemptButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAttempt(attemptId);
    } catch (error) {
      console.error("Failed to delete attempt:", error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          本当に削除しますか？
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-2"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            <X className="size-4" />
            いいえ
          </Button>
          <Button
            variant="destructive"
            className="flex-1 flex items-center gap-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Check className="size-4" />
            {isDeleting ? "削除中..." : "はい"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="destructive"
      className="w-full flex items-center gap-2"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="size-4" />
      削除
    </Button>
  );
}
