import Image from "next/image";
import React from "react";

export default function SalesHeader() {
  return (
    <div className="w-full flex ">
      <h1 className="font-bold text-[25px] leading-[100%] tracking-normal text-[#1D1D1D] ml-8">
        Indra Traders Sales Dashboard
      </h1>

      {/* Welcome Card */}
      <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
        {/* Left Side - Welcome */}
        <div className="flex items-center">
          <div className="space-y-1">
            <p className="font-semibold text-[24px] leading-[100%] tracking-normal text-black">
              Welcome Back, Sophie Eleanor
            </p>
            <p className="font-normal text-[20px] leading-[100%] tracking-normal text-[#575757] flex items-center space-x-2">
              <Image
                src="/images/sales/tdesign_location.svg"
                alt="location icon"
                width={200}
                height={200}
                className="w-5 h-5"
              />
              <span>Bambalapitiya</span>
            </p>
          </div>
        </div>

        {/* Right Side - Date & Time */}
        <div className="flex items-center space-x-20">
          <div className="flex flex-col space-y-1">
            <span className="font-normal text-[30px] leading-[100%] uppercase text-[#1D1D1D]">
              WEDNESDAY
            </span>
            <span className="font-normal text-[15px] leading-[100%] tracking-[0.39em] uppercase text-black">
              12 March, 2025
            </span>
          </div>
          <span className="font-medium text-[20px] leading-[100%] tracking-[0.34em] uppercase">
            01:06:03 PM
          </span>
        </div>
      </section>
    </div>
  );
}
