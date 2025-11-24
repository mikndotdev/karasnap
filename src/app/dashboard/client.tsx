"use client";

import { useState } from "react";
import SimpleImageUpload from "@/components/file-upload/simple-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUploadURL } from "@/actions/upload";
import { analyzeSongImage } from "@/actions/analyze";
interface DashboardClientProps {
  s3BaseUrl: string;
}

export default function DashboardClient({ s3BaseUrl }: DashboardClientProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);

      const { uploadUrl, imageKey } = await getImageUploadURL();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      setIsUploading(false);
      setIsAnalyzing(true);

      const imageUrl = `${s3BaseUrl}/${imageKey}`;
      const result = await analyzeSongImage(imageUrl);

      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Karaoke Score Analyzer</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Karaoke Screenshot</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleImageUpload onImageSelected={handleImageSelected} />

            {selectedFile && (
              <Button
                onClick={handleAnalyze}
                disabled={isUploading || isAnalyzing}
                className="mt-4 w-full"
              >
                {isUploading && "Uploading..."}
                {isAnalyzing && "Analyzing..."}
                {!isUploading && !isAnalyzing && "Analyze Image"}
              </Button>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(analysisResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
