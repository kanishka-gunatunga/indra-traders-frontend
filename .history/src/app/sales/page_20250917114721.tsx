import { TicketColumn } from "@/components/TicketColumn";
import Image from "next/image";
import React from "react";

const dummyTickets: TicketCardProps[] = [
  {
    id: "ITPL122455874565",
    priority: 2,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
  },
  {
    id: "ITPL122455874566",
    priority: 0,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
  },
];

export default function SalesDashboard() {
  return (
    <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
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
                  alt=""
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

        {/* Leads Section */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px] leading-[100%] tracking-normal">
              Leads
            </span>
            <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
              <Image
                src={"/images/sales/plus.svg"}
                width={24}
                height={24}
                alt="Plus icon"
              />
            </button>
          </div>
          <div className="w-full flex  mt-6">
            <div className="flex gap-6">
              <TicketColumn title="New" tickets={dummyTickets} />
              <TicketColumn title="Ongoing" tickets={dummyTickets} />
              <TicketColumn title="Won" tickets={dummyTickets} />
              <TicketColumn title="Lost" tickets={dummyTickets} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
