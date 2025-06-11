"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import podium from "../public/podium1.png";

interface PhoneDisplayProps {
  phoneImage: string | StaticImageData;
  overlayCards: {
    src: string | StaticImageData;
    alt: string;
    style?: React.CSSProperties;
    className?: string; // Tailwind-based positioning preferred
  }[];
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phoneImage,
  overlayCards,
}) => {
  return (
    <div className="relative w-full flex justify-center items-center h-[500px] sm:h-[580px] md:h-[620px]">
      {/* Podium */}
      <Image
        src={podium}
        alt="Podium"
        width={200}
        height={80}
        className="absolute bottom-0 z-[1] w-[250px] sm:w-[300px] md:w-[350px] mb-[18px]"
      />

      <div className="relative w-full flex justify-center items-end h-full">
        {/* Phone */}
        <Image
          src={phoneImage}
          alt="Phone"
          className="absolute z-[2] w-[220px] sm:w-[240px] md:w-[260px] mb-[70px]"
        />

        {/* Overlay Cards */}
        {overlayCards.map((card, index) => (
          <Image
            key={index}
            src={card.src}
            alt={card.alt}
            className={`absolute z-[3] ${card.className ?? ""}`}
            style={card.style}
          />
        ))}
      </div>
    </div>
  );
};

export default PhoneDisplay;
