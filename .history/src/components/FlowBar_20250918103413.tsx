"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FlowBar() {
  const [selectedStatus, setSelectedStatus] = useState("Won");

  return (
    <div className="w-[786px] flex">
      {/* Step 1: New */}
      <div className="relative flex-1 h-[50px] flex items-center justify-center">
        <Image
          src="/images/sales/flow_bar1.svg"
          alt="New"
          fill
          className="object-fill"
        />
        <span className="absolute text-white font-semibold text-[16px]">
          New
        </span>
      </div>

      {/* Step 2: Ongoing */}
      <div className="relative flex-1 h-[50px] flex items-center justify-center">
        <Image
          src="/images/sales/flow_bar2.svg"
          alt="Ongoing"
          fill
          className="object-fill"
        />
        <span className="absolute text-white font-semibold text-[16px]">
          Ongoing
        </span>
      </div>

      {/* Step 3: Won/Lost */}
      <div className="relative flex-1 h-[50px] flex items-center justify-center">
        <Image
          src="/images/sales/flow_bar3.svg"
          alt="Won/Lost"
          fill
          className="object-fill"
        />
        {/* Custom styled dropdown */}
        <div className="absolute flex items-center">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-transparent text-white font-semibold text-[16px] pr-6 cursor-pointer focus:outline-none"
          >
            <option className="bg-black text-white" value="Won">
              Won
            </option>
            <option className="bg-black text-white" value="Lost">
              Lost
            </option>
          </select>
          <ChevronDown className="absolute right-[-20px] text-white w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
