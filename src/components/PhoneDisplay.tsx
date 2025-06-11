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
    className?: string; // allow Tailwind classes too
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
        className="absolute bottom-0 z-[1] w-[250px] sm:w-[370px] md:w-[300px]"
      />

      <div className="relative w-full flex justify-center items-end h-full">
        {/* Phone */}
        <Image
          src={phoneImage}
          alt="Phone"
          width={300}
          height={600}
          className="absolute  z-[2] w-[240px] sm:w-[260px] md:w-[280px]"
        />

        {/* Overlay Cards */}
        {overlayCards.map((card, index) => (
          <Image
            key={index}
            src={card.src}
            alt={card.alt}
            // width={100}
            // height={100}
            className={`absolute z-[2] ${card.className ?? ""}`}
            style={card.style}
          />
        ))}
      </div>
    </div>
  );
};

export default PhoneDisplay;