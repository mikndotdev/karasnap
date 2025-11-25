"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SimpleImageUpload from "@/components/file-upload/simple-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUploadURL } from "@/actions/upload";
import { analyzeSongImage } from "@/actions/analyze";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import piexif from "piexifjs";
import Compressor from "compressorjs";

interface DashboardClientProps {
  s3BaseUrl: string;
}

export default function Add({ s3BaseUrl }: DashboardClientProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
  };

  const extractExifDate = (file: File): Promise<Date | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const exifObj = piexif.load(e.target?.result as string);
          const dateStr = exifObj?.Exif?.[piexif.ExifIFD.DateTimeOriginal];
          if (dateStr) {
            const [datePart, timePart] = dateStr.split(" ");
            const [year, month, day] = datePart.split(":");
            const [hour, minute, second] = timePart.split(":");
            const date = new Date(
              Number.parseInt(year),
              Number.parseInt(month) - 1,
              Number.parseInt(day),
              Number.parseInt(hour),
              Number.parseInt(minute),
              Number.parseInt(second),
            );
            resolve(date);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const processImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 2048,
        maxHeight: 2048,
        mimeType: "image/jpeg",
        success(result) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const dataUrl = e.target?.result as string;
              const strippedDataUrl = piexif.remove(dataUrl);
              fetch(strippedDataUrl)
                .then((res) => res.blob())
                .then((blob) => {
                  const processedFile = new File([blob], file.name, {
                    type: "image/jpeg",
                  });
                  resolve(processedFile);
                })
                .catch(reject);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(result as File);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);

      const captureDate = await extractExifDate(selectedFile);
      const processedFile = await processImage(selectedFile);

      const { uploadUrl, imageKey } = await getImageUploadURL();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: processedFile,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      setIsUploading(false);
      setIsAnalyzing(true);

      const imageUrl = `${s3BaseUrl}/${imageKey}`;
      const result = await analyzeSongImage(
        imageUrl,
        captureDate?.toISOString() ?? null,
      );

      if (result.attemptId) {
        router.push(`/dashboard/attempts/${result.attemptId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">曲を追加</h1>

      <div className="grid gap-6">
        <Card>
          <CardContent>
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Spinner className="size-8" />
                  <span className="text-sm text-foreground font-semibold">
                    解析中...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <SimpleImageUpload onImageSelected={handleImageSelected} />

                {selectedFile && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isUploading || isAnalyzing || !selectedFile}
                    className="mt-4 w-full"
                  >
                    {isUploading && (
                      <div className={"flex flex-row items-center space-x-2"}>
                        <Spinner className="size-4" />
                        <span>アップロード中...</span>
                      </div>
                    )}
                    {!isUploading && !isAnalyzing && "アップロードして解析する"}
                  </Button>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                    {error}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
