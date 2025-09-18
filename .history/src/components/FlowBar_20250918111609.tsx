"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FlowBarProps {
  status: "New" | "Ongoing" | "Won" | "Lost";
  onStatusChange?: (status: "New" | "Ongoing" | "Won" | "Lost") => void;
}

export default function FlowBar({ status, onStatusChange }: FlowBarProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  const [selectedStatus, setSelectedStatus] = useState<"Won" | "Lost">(
    currentStatus === "Won" || currentStatus === "Lost" ? currentStatus : "Won"
  );

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleDropdownChange = (valu)

  return (
    <div className="w-[686px] flex">
      {/* Step 1: New */}
      <div className="relative w-[262px] -mr-6 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar1.svg"
          alt="New"
          width={262}
          height={50}
          className="object-contain"
        />
        <span className="absolute text-white font-semibold text-[16px]">
          New
        </span>
      </div>

      {/* Step 2: Ongoing */}
      <div className="relative w-[262px] -mr-6 flex justify-center items-center">
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
      <div className="relative w-[262px] flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar3.svg"
          alt="Won/Lost"
          width={262}
          height={50}
          className="object-contain"
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
