import SalesHeader from "@/components/SalesHeader";
import React from "react";

export default function SalesDetailsPage() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SalesHeader />

        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="flex w-full">
            <span>ITPL122455874565</span>
            <span>ITPL</span>
          </div>
        </section>
      </main>
    </div>
  );
}
