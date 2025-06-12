"use client";

import Image, { StaticImageData } from "next/image";
import React, { useRef } from "react";
import podium from "../public/podium1.png";
import { motion, useInView } from "framer-motion";

interface PhoneDisplayProps {
  phoneImage: string | StaticImageData;
  overlayCards: {
    src: string | StaticImageData;
    alt: string;
    style?: React.CSSProperties;
    className?: string;
  }[];
  podiumStyle?: React.CSSProperties;
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phoneImage,
  overlayCards,
  podiumStyle,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="relative w-full flex justify-center items-center h-[500px] sm:h-[580px] md:h-[620px]"
    >
      {/* Podium */}
      <Image
        src={podium}
        alt="Podium"
        width={200}
        height={80}
        className="absolute bottom-0 z-[1] w-[250px] sm:w-[300px] md:w-[350px] mb-[18px]"
        style={podiumStyle}
      />

      <div className="relative w-full flex justify-center items-end h-full">
        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute z-[2] mb-[70px]"
        >
          <Image
            src={phoneImage}
            alt="Phone"
            className="w-[220px] sm:w-[240px] md:w-[260px]"
          />
        </motion.div>

        {/* Overlay Cards */}
        {overlayCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.2 + index * 0.2,
              ease: "easeOut",
            }}
            className="absolute z-[3]"
            style={card.style}
          >
            <Image src={card.src} alt={card.alt} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhoneDisplay;
