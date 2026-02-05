"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface VehicleGalleryProps {
  mainImage?: string;
  images?: string[];
}

export default function VehicleGallery({
  mainImage,
  images = [],
}: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  return (
    <div className="relative w-full max-w-[1000px] mx-auto">
      {/* Main vehicle image */}
      <div
        className="relative w-full h-[341px] border border-gray-200 bg-white/80 backdrop-blur-[50px] rounded-[30px] shadow-md flex items-center justify-center overflow-hidden
                   max-[1350px]:h-[280px] max-[1350px]:w-full transition-all duration-300"
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt="Selected Vehicle"
            fill
            className="object-cover"
            quality={100}
            priority
          />
        ) : (
          <span className="text-gray-400">Main Vehicle Image</span>
        )}
      </div>

      {/* Small images row */}
      <div
        className="mt-4 grid gap-2 
                   grid-cols-4 max-[1350px]:grid-cols-2"
      >
        {images.map((img, i) => {
          // Figure out which corners should be rounded
          const roundedClass =
            i === 0
              ? "rounded-l-[30px]"
              : i === 3
                ? "rounded-r-[30px]"
                : "";

          // On smaller screens with 2 columns, adjust corners for new rows
          const responsiveRoundedClass =
            i === 0
              ? "max-[1350px]:rounded-tl-[30px]"
              : i === 1
                ? "max-[1350px]:rounded-tr-[30px]"
                : i === 2
                  ? "max-[1350px]:rounded-bl-[30px]"
                  : i === 3
                    ? "max-[1350px]:rounded-br-[30px]"
                    : "";

          return (
            <div
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`relative h-[94px] bg-white/80 border border-gray-200 backdrop-blur-[50px] shadow-md flex items-center justify-center overflow-hidden ${roundedClass} ${responsiveRoundedClass} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              {img ? (
                <Image
                  src={img}
                  alt={`Vehicle thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  quality={80}
                />
              ) : (
                <span className="text-gray-400">Image {i + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
