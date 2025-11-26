"use client";
import React from "react";
import { motion, useInView, type Variants } from "motion/react";
import Icon from "@/assets/img/icon.png";
import Image from "next/image";

import {
  Mic2,
  Clock,
  User,
  Share2,
  Smile,
  Camera,
  NotepadText,
  View,
} from "lucide-react";

const icons = [Mic2, Camera, Clock, User, Share2, Smile, NotepadText, View];

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function ImageRotatingIcons() {
  const shuffledIcons = React.useMemo(() => shuffleArray([...icons]), []);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerSize = 300;
  const orbitRadius = 140;
  const iconSize = 50;
  const centerImageSize = 200;
  const duration = 20;

  const containerVariants: Variants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <motion.div
        ref={ref}
        className="absolute"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <motion.div
          className="rotating-container"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: duration,
            ease: "linear",
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          {shuffledIcons.map((LucideIcon, index) => {
            const angle = index * (360 / shuffledIcons.length);
            const delay = index * 0.1;

            return (
              <div
                key={index}
                className="absolute"
                style={{
                  position: "absolute",
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  top: `calc(50% - ${iconSize / 2}px)`,
                  left: `calc(50% - ${iconSize / 2}px)`,
                  transformOrigin: "50% 50%",
                  transform: `rotate(${angle}deg) translate(${orbitRadius}px) rotate(-${angle}deg)`,
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={{
                    delay,
                    duration: 0.5,
                    ease: "backOut",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{
                      scale: 0.8,
                      borderRadius: "100%",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        repeat: Infinity,
                        duration: duration,
                        ease: "linear",
                      }}
                      className="bg-white rounded-full p-3 shadow-lg flex items-center justify-center"
                      style={{
                        width: `${iconSize}px`,
                        height: `${iconSize}px`,
                      }}
                    >
                      <LucideIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Center Image */}
      <div className="relative z-10">
        <Image
          src={Icon}
          alt="Center icon"
          width={centerImageSize}
          height={centerImageSize}
          className="rounded-full border-white shadow-lg"
        />
      </div>
    </div>
  );
}
