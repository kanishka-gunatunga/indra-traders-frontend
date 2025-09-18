import Image from "next/image";
import React from "react";

export default function SalesDashboard() {
  return (
    <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <h1 className="font-bold text-[25px] leading-[100%] tracking-normal text-[#1D1D1D] ml-8">
          Indra Traders Sales Dashboard
        </h1>

        {/* Welcome Card */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3 ">
              <div className="space-y-2">
                <p className="font-semibold text-[24px] leading-[100%] tracking-normal text-black">
                  Welcome Back, Sophie Eleanor
                </p>
                <p className="font-normal text-[20px] leading-[100%] tracking-normal text-[#575757] flex items-center space-x-1 ">
                  <span role="img" aria-label="location icon">
                    <Image
                      src="/images/sales/tdesign_location.svg"
                      alt=""
                      width={200}
                      height={200}
                      className="w-6 h-6"
                    />
                  </span>
                  <span>Bambalapitiya</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between gap-36">
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-5">
                <span className="font-normal text-[30px] leading-[100%] tracking-normal uppercase text-[#1D1D1D]">
                  WEDNESDAY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <span className="font-normal text-[15px] leading-[100%] tracking-[0.39em] uppercase text-black">
                  12 March, 2025
                </span>
              </div>
            </div>

            <div>
              <span className="font-medium text-[20px] leading-[100%] tracking-[0.34em] uppercase">
                01:06:03 PM
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
