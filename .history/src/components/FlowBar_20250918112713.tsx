"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FlowBarProps {
  status: "New" | "Ongoing" | "Won" | "Lost";
  onStatusChange?: (status: "New" | "Ongoing" | "Won" | "Lost") => void;
}

export default function FlowBar({ status, onStatusChange }: FlowBarProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [selectedWonLost, setSelectedWonLost] = useState<"Won" | "Lost">(
    status === "Won" || status === "Lost" ? status : "Won"
  );

  const handleDropdownChange = (value: "Won" | "Lost") => {
    if (currentStatus === "Ongoing") {
      setSelectedWonLost(value);
      setCurrentStatus(value);
      onStatusChange && onStatusChange(value);
    }
  };

  // Determine colors
  const getSvgColor = (step: "New" | "Ongoing" | "Won/Lost") => {
    if (step === "New") return currentStatus === "New" ? "#DB2727" : "#C0C0C0";
    if (step === "Ongoing") return currentStatus === "Ongoing" ? "#DB2727" : "#C0C0C0";
    if (step === "Won/Lost") return currentStatus === "Won" || currentStatus === "Lost" ? "#DB2727" : "#C0C0C0";
    return "#C0C0C0";
  };

  return (
    <div className="w-full max-w-[686px] flex">
      {/* New */}
      <div className="relative flex-1 -mr-6 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar1.svg"
          alt="New"
          width={262}
          height={50}
          style={{ filter: `drop-shadow(0 0 0 ${getSvgColor("New")})` }}
          className="object-contain"
        />
        <span className="absolute text-white font-semibold text-[16px]">New</span>
      </div>

      {/* Ongoing */}
      <div className="relative flex-1 -mr-6 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar2.svg"
          alt="Ongoing"
          width={262}
          height={50}
          style={{ filter: `drop-shadow(0 0 0 ${getSvgColor("Ongoing")})` }}
          className="object-contain"
        />
        <span className="absolute text-white font-semibold text-[16px]">Ongoing</span>
      </div>

      {/* Won/Lost */}
      <div className="relative flex-1 flex justify-center items-center">
        <Image
          src="/images/sales/flow_bar3.svg"
          alt="Won/Lost"
          width={262}
          height={50}
          style={{ filter: `drop-shadow(0 0 0 ${getSvgColor("Won/Lost")})` }}
          className="object-contain"
        />

        {/* Dropdown */}
        <div className="absolute flex items-center">
          <select
            value={selectedWonLost}
            disabled={currentStatus !== "Ongoing"}
            onChange={(e) => handleDropdownChange(e.target.value as "Won" | "Lost")}
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
