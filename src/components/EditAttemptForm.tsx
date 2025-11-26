"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateAttempt } from "@/actions/update-attempt";
import { toast } from "sonner";
import type { Attempt } from "@/generated/prisma/client";
import { Manufacturer, RatingSystem } from "@/generated/prisma/enums";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { getRatingSystemText } from "@/lib/rating-system-text";

interface EditAttemptFormProps {
  attempt: Attempt;
}

export default function EditAttemptForm({ attempt }: EditAttemptFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date(attempt.createdAt));
  const [formData, setFormData] = useState({
    score: attempt.score.toString(),
    bonus: attempt.bonus?.toString() || "",
    manufacturer: attempt.manufacturer,
    ratingSystem: attempt.ratingSystem,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateAttempt({
        attemptId: attempt.id,
        score: formData.score,
        bonus: formData.bonus,
        manufacturer: formData.manufacturer,
        ratingSystem: formData.ratingSystem,
        createdAt: date.toISOString(),
      });

      if (result.success) {
        toast.success("記録を更新しました");
        router.push(`/dashboard/attempts/${attempt.id}`);
      } else {
        toast.error(result.error || "更新に失敗しました");
      }
    } catch (error) {
      toast.error("更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const manufacturerLabels: Record<Manufacturer, string> = {
    DAM: "DAM",
    JOYSOUND: "JOYSOUND",
    OTHER: "その他",
  };

  const getRatingSystemsByManufacturer = (
    manufacturer: Manufacturer,
  ): RatingSystem[] => {
    switch (manufacturer) {
      case Manufacturer.DAM:
        return [
          RatingSystem.DAM_AI_HEART,
          RatingSystem.DAM_AI,
          RatingSystem.DAM_DXG,
        ];
      case Manufacturer.JOYSOUND:
        return [RatingSystem.JOYSOUND_MASTER, RatingSystem.JOYSOUND_AI];
      case Manufacturer.OTHER:
      default:
        return [RatingSystem.OTHER];
    }
  };

  const availableRatingSystems = getRatingSystemsByManufacturer(
    formData.manufacturer,
  );

  const handleManufacturerChange = (value: Manufacturer) => {
    const newRatingSystems = getRatingSystemsByManufacturer(value);
    setFormData({
      ...formData,
      manufacturer: value,
      ratingSystem: newRatingSystems.includes(formData.ratingSystem)
        ? formData.ratingSystem
        : newRatingSystems[0],
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="score" className="text-sm font-medium">
              スコア
            </label>
            <Input
              id="score"
              type="number"
              step="0.001"
              value={formData.score}
              onChange={(e) =>
                setFormData({ ...formData, score: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bonus" className="text-sm font-medium">
              ボーナス（任意）
            </label>
            <Input
              id="bonus"
              type="number"
              step="0.001"
              value={formData.bonus}
              onChange={(e) =>
                setFormData({ ...formData, bonus: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="manufacturer" className="text-sm font-medium">
              機種
            </label>
            <Select
              value={formData.manufacturer}
              onValueChange={handleManufacturerChange}
            >
              <SelectTrigger id="manufacturer" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(manufacturerLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="ratingSystem" className="text-sm font-medium">
              採点システム
            </label>
            <Select
              value={formData.ratingSystem}
              onValueChange={(value: RatingSystem) =>
                setFormData({ ...formData, ratingSystem: value })
              }
            >
              <SelectTrigger id="ratingSystem" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRatingSystems.map((system) => (
                  <SelectItem key={system} value={system}>
                    {getRatingSystemText(system).name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              日付
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ja }) : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {attempt.imageUrl && (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <img
                  src={attempt.imageUrl}
                  alt="採点画像"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
