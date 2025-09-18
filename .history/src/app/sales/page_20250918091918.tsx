

import SalesHeader from "@/components/SalesHeader";
import { TicketCardProps } from "@/components/TicketCard";
import { TicketColumn } from "@/components/TicketColumn";
import Image from "next/image";
import React, { useState } from "react";

const dummyTickets: TicketCardProps[] = [
  {
    id: "ITPL122455874561",
    priority: 0,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "New",
  },
  {
    id: "ITPL122455874562",
    priority: 1,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
    status: "Ongoing",
  },
  {
    id: "ITPL122455874563",
    priority: 2,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "New",
  },
  {
    id: "ITPL122455874564",
    priority: 3,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
    status: "Lost",
  },
  {
    id: "ITPL122455874565",
    priority: 4,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "Won",
  },
];

export default function SalesDashboard() {

  const [tickets, setTickets] = useState<TicketCardProps[]>(dummyTickets)


  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SalesHeader />

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
          <div className="w-full mt-6 flex gap-6 overflow-x-auto lg:overflow-x-hidden">
            <TicketColumn title="New" tickets={dummyTickets} />
            <TicketColumn title="Ongoing" tickets={dummyTickets} />
            <TicketColumn title="Won" tickets={dummyTickets} />
            <TicketColumn title="Lost" tickets={dummyTickets} />
          </div>
        </section>
      </main>
    </div>
  );
}
