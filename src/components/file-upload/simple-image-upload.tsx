"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, XIcon, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleImageUploadProps {
  onImageSelected: (file: File | null) => void;
  className?: string;
}

export default function SimpleImageUpload({
  onImageSelected,
  className,
}: SimpleImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageSelected(file);
    },
    [onImageSelected],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFile(target.files[0]);
      }
    };
    input.click();
  }, [handleFile]);

  const removeImage = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageSelected(null);
  }, [preview, onImageSelected]);

  return (
    <div className={cn("w-full", className)}>
      {preview ? (
        <Card className="relative group">
          <CardContent className="p-4">
            <img
              src={preview}
              className="w-full h-auto max-h-96 object-contain rounded-md"
              alt="Preview"
            />
            <Button
              onClick={removeImage}
              variant="outline"
              size="icon"
              className="absolute top-6 right-6 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XIcon className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-dashed shadow-none rounded-md transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="text-center py-12">
            <div className="flex items-center justify-center size-12 rounded-full border border-border mx-auto mb-4">
              <Camera className="size-6" />
            </div>
            <h3 className="text-sm text-foreground font-semibold mb-1">
              採点画面の画像をアップロードして解析を開始！
            </h3>
            <span className="text-xs text-secondary-foreground font-normal block mb-4">
              画像をここにドラッグ＆ドロップ、または
            </span>
            <Button size="sm" variant="outline" type="button">
              ファイルを選択・撮影
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
