import Image from "next/image";
import React from "react";

interface HeaderProps{
  name: string;
  location: string;
  title: string;
}

export default function Header({name, location, title}: HeaderProps) {
  return (
    <>
      <h1 className="font-bold text-[25px] leading-[100%] tracking-normal text-[#1D1D1D] ml-8 max-[1140px]:text-[23px]">
        {title}
      </h1>

      {/* Welcome Card */}
      <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-14 py-10 flex justify-between items-center">
        {/* Left Side - Welcome */}
        <div className="flex items-center">
          <div className="space-y-1">
            <p className="font-semibold text-[24px] max-[1140px]:text-[20px] leading-[100%] tracking-normal text-black">
              Welcome Back, {name}
            </p>
            <p className="font-normal text-[20px] mt-1 max-[1140px]:text-[18px] max-[1140px]:mt-2 leading-[100%] tracking-normal text-[#575757] flex items-center space-x-2">
              <Image
                src="/images/sales/tdesign_location.svg"
                alt="location icon"
                width={200}
                height={200}
                className="w-5 h-5"
              />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Right Side - Date & Time */}
        <div className="flex items-center space-x-20">
          <div className="flex flex-col space-y-1">
            <span className="font-normal text-[30px] max-[1140px]:text-[25px] max-[1140px]:text-center leading-[100%] uppercase text-[#1D1D1D]">
              WEDNESDAY
            </span>
            <span className="font-normal text-[15px] max-[1140px]:text-[10px] max-[1140px]:text-center leading-[100%] tracking-[0.39em] uppercase text-black">
              12 March, 2025
            </span>
          </div>
          <span className="font-medium text-[20px] max-[1140px]:text-[13px] leading-[100%] tracking-[0.34em] uppercase">
            01:06:03 PM
          </span>
        </div>
      </section>
    </>
  );
}
