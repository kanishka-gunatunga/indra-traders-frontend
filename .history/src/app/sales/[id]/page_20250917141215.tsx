import SalesHeader from "@/components/SalesHeader";
import React from "react";

export default function SalesDetailsPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SalesHeader />

        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="flex w-full">
            <div className="flex w-full gap-3 justify-cente items-center">
              <span>ITPL122455874565</span>
              <span>ITPL</span>
              <span
                className={`text-black text-[10px] w-[41.14px] h-[18px] rounded-[9.38px] 
              flex items-center justify-center px-[7.03px] bg-[#FFA7A7]`}
              >
                P0
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
