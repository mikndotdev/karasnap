"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { useMemo } from "react";

import img_0 from "@/assets/img/saiten-images/img_0.png";
import img_1 from "@/assets/img/saiten-images/img_1.png";
import img_2 from "@/assets/img/saiten-images/img_2.png";
import img_3 from "@/assets/img/saiten-images/img_3.png";
import img_4 from "@/assets/img/saiten-images/img_4.png";
import img_5 from "@/assets/img/saiten-images/img_5.png";
import img_6 from "@/assets/img/saiten-images/img_6.png";
import img_7 from "@/assets/img/saiten-images/img_7.png";
import img_8 from "@/assets/img/saiten-images/img_8.png";
import img_9 from "@/assets/img/saiten-images/img_9.png";
import img_10 from "@/assets/img/saiten-images/img_10.png";
import img_11 from "@/assets/img/saiten-images/img_11.png";
import img_12 from "@/assets/img/saiten-images/img_12.png";
import img_13 from "@/assets/img/saiten-images/img_13.png";
import img_14 from "@/assets/img/saiten-images/img_14.png";
import img_15 from "@/assets/img/saiten-images/img_15.png";
import img_16 from "@/assets/img/saiten-images/img_16.png";
import img_17 from "@/assets/img/saiten-images/img_17.png";
import img_18 from "@/assets/img/saiten-images/img_18.png";
import img_19 from "@/assets/img/saiten-images/img_19.png";
import img_20 from "@/assets/img/saiten-images/img_20.png";
import img_21 from "@/assets/img/saiten-images/img_21.png";
import img_22 from "@/assets/img/saiten-images/img_22.png";
import img_23 from "@/assets/img/saiten-images/img_23.png";
import img_24 from "@/assets/img/saiten-images/img_24.png";
import img_25 from "@/assets/img/saiten-images/img_25.png";
import img_26 from "@/assets/img/saiten-images/img_26.png";
import img_27 from "@/assets/img/saiten-images/img_27.png";
import img_28 from "@/assets/img/saiten-images/img_28.png";
import img_29 from "@/assets/img/saiten-images/img_29.png";
import img_30 from "@/assets/img/saiten-images/img_30.png";
import img_31 from "@/assets/img/saiten-images/img_31.png";
import img_32 from "@/assets/img/saiten-images/img_32.png";
import img_33 from "@/assets/img/saiten-images/img_33.png";
import img_34 from "@/assets/img/saiten-images/img_34.png";
import img_35 from "@/assets/img/saiten-images/img_35.png";
import img_36 from "@/assets/img/saiten-images/img_36.png";
import img_37 from "@/assets/img/saiten-images/img_37.png";
import img_38 from "@/assets/img/saiten-images/img_38.png";
import img_39 from "@/assets/img/saiten-images/img_39.png";

const saitenImages = [
  img_0.src,
  img_1.src,
  img_2.src,
  img_3.src,
  img_4.src,
  img_5.src,
  img_6.src,
  img_7.src,
  img_8.src,
  img_9.src,
  img_10.src,
  img_11.src,
  img_12.src,
  img_13.src,
  img_14.src,
  img_15.src,
  img_16.src,
  img_17.src,
  img_18.src,
  img_19.src,
  img_20.src,
  img_21.src,
  img_22.src,
  img_23.src,
  img_24.src,
  img_25.src,
  img_26.src,
  img_27.src,
  img_28.src,
  img_29.src,
  img_30.src,
  img_31.src,
  img_32.src,
  img_33.src,
  img_34.src,
  img_35.src,
  img_36.src,
  img_37.src,
  img_38.src,
  img_39.src,
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function HeroMarquee() {
  const randomizedImages = useMemo(() => shuffleArray(saitenImages), []);

  return (
    <>
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 w-full min-h-full"
        images={randomizedImages}
      />
    </>
  );
}
