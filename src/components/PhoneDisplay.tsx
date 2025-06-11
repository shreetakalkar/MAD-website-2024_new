"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import podium from "../public/podium.png";

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
    <div
      className="relative w-full flex justify-center items-end"
      style={{ height: "380px" }}
    >
      {/* Podium */}
      <Image
        src={podium}
        alt="Podium"
        width={400}
        height={80}
        className="absolute bottom-0 z-[1] w-[120px] sm:w-[150px] md:w-[180px]"
      />

      {/* Phone */}
      <Image
        src={phoneImage}
        alt="Phone"
        width={250}
        height={500}
        className="absolute z-[2] bottom-8 w-[140px] sm:w-[180px] md:w-[200px]"
      />

      {/* Overlay Cards */}
      {overlayCards.map((card, index) => (
        <Image
          key={index}
          src={card.src}
          alt={card.alt}
          width={100}
          height={100}
          className={`absolute z-[3] ${card.className ?? ""}`}
          style={card.style}
        />
      ))}
    </div>
  );
};

export default PhoneDisplay;
