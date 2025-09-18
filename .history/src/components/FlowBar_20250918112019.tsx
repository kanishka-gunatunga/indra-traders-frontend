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

  const [selectedWonLost, setSelectedWonLost] = useState<"Won" | "Lost">(
    currentStatus === "Won" || currentStatus === "Lost" ? currentStatus : "Won"
  );

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const handleDropdownChange = (value: "Won" | "Lost") => {
    if (currentStatus === "Ongoing") {
      setSelectedWonLost(value);
      setCurrentStatus(value);
      onStatusChange && onStatusChange(value);
    }
  };

  return (
    <div className="w-[686px] flex">
      {/* Step 1: New */}
      <div className="relative w-[262px] -mr-6 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar1.svg"
          alt="New"
          width={262}
          height={50}
          className={`object-contain ${
            currentStatus !== "New" ? "filter grayscale" : ""
          }`}
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
          className={`object-contain ${
            currentStatus === "Ongoing" ? "" : "filter grayscale"
          }`}
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
          className={`object-contain ${
            currentStatus === "Won" || currentStatus === "Lost"
              ? ""
              : "filter grayscale"
          }`}
        />

        {/* Dropdown */}
        <div className="absolute flex items-center">
          <select
            value={selectedWonLost}
            disabled={currentStatus !== "Ongoing"}
            onChange={(e) =>
              handleDropdownChange(e.target.value as "Won" | "Lost")
            }
            className={`appearance-none bg-white/20 text-white font-semibold text-[16px] pr-6 cursor-pointer rounded-md py-1 pl-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              currentStatus !== "Ongoing" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
          <ChevronDown className="absolute right-1 text-white w-4 h-4 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
