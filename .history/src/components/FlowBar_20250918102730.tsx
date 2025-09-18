"use client"

import Image from "next/image";
import { useState } from "react";

export default function FlowBar() {
  const [selectedStatus, setSelectedStatus] = useState("Won");

  return (
    <div className="w-full max-w-[786px] flex items-center justify-between">
      {/* Step 1: New */}
      <div className="relative flex-1 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar1.svg"
          alt="New"
          width={262} // adjust proportionally so 3 fit in 786px
          height={50}
          className="object-contain"
        />
        <span className="absolute text-white font-semibold text-[16px]">
          New
        </span>
      </div>

      {/* Step 2: Ongoing */}
      <div className="relative flex-1 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar2.svg"
          alt="Ongoing"
          width={262}
          height={50}
          className="object-contain"
        />
        <span className="absolute text-white font-semibold text-[16px]">
          Ongoing
        </span>
      </div>

      {/* Step 3: Won/Lost */}
      <div className="relative flex-1 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar3.svg"
          alt="Won/Lost"
          width={262}
          height={50}
          className="object-contain"
        />
        {/* Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="absolute bg-transparent text-white font-semibold text-[16px] text-center appearance-none cursor-pointer"
        >
          <option className="bg-black text-white" value="Won">
            Won
          </option>
          <option className="bg-black text-white" value="Lost">
            Lost
          </option>
        </select>
      </div>
    </div>
  );
}
