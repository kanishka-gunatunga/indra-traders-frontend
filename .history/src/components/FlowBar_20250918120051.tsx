"use client";
import React from "react";

// A reusable component that applies the SVG mask
const MaskedSVG = ({
  src,
  color,
  text,
}: {
  src: string;
  color: string;
  text: string;
}) => (
  <div
    className="relative w-[262px] h-[50px]"
    style={{
      backgroundColor: color,
      WebkitMaskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%", // make SVG stretch fully
      maskImage: `url(${src})`,
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
    }}
  >
    {/* Centered text */}
    <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px]">
      {text}
    </span>
  </div>
);

const FlowBar = () => {
  return (
    <div className="flex gap-2">
      <MaskedSVG src="/flowBar1.svg" color="#F18805" text="New" />
      <MaskedSVG src="/flowBar2.svg" color="#C4C4C4" text="Ongoing" />
      <MaskedSVG src="/flowBar3.svg" color="#5C8001" text="Won/Lost" />
    </div>
  );
};

export default FlowBar;
