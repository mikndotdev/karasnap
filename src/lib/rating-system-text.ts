import { RatingSystem } from "@/generated/prisma/enums";

export function getRatingSystemText(ratingSystem: RatingSystem): {
  name: string;
} {
  switch (ratingSystem) {
    case RatingSystem.DAM_AI_HEART:
      return { name: "精密採点AIHeart" };
    case RatingSystem.DAM_AI:
      return { name: "精密採点AI" };
    case RatingSystem.DAM_DXG:
      return { name: "精密採点DX-G" };
    case RatingSystem.JOYSOUND_MASTER:
      return { name: "分析採点マスター" };
    case RatingSystem.JOYSOUND_AI:
      return { name: "分析採点AI" };
    default:
      return { name: "未設定" };
  }
}
