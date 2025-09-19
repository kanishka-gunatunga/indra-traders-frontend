"use client";

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

  // helper
  const getColor = (target: "New" | "Ongoing" | "WonLost") => {
    if (target === "New")
      return currentStatus === "New" ? "#DB2727" : "#9ca3af"; // gray-400
    if (target === "Ongoing")
      return currentStatus === "Ongoing" ? "#DB2727" : "#9ca3af";
    if (target === "WonLost")
      return currentStatus === "Won" || currentStatus === "Lost"
        ? "#DB2727"
        : "#9ca3af";
    return "#9ca3af";
  };

  // reusable div with mask
  const MaskedSVG = ({ src, color }: { src: string; color: string }) => (
    <div
      className="w-[262px] h-[50px] bg-contain bg-no-repeat"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        maskSize: "contain",
      }}
    />
  );

  return (
    <div className="w-[686px] flex">
      {/* Step 1: New */}
      <div className="relative w-[262px] -mr-12 flex justify-center items-center">
        <MaskedSVG src="/images/sales/flow_bar1.svg" color={getColor("New")} />
        <span className="absolute text-white font-semibold text-[16px]">
          New
        </span>
      </div>

      {/* Step 2: Ongoing */}
      <div className="relative w-[262px] -mr-12 flex justify-center items-center">
        <MaskedSVG
          src="/images/sales/flow_bar2.svg"
          color={getColor("Ongoing")}
        />
        <span className="absolute text-white font-semibold text-[16px]">
          Ongoing
        </span>
      </div>

      {/* Step 3: Won/Lost */}
      <div className="relative w-[262px] flex justify-center items-center">
        <MaskedSVG
          src="/images/sales/flow_bar3.svg"
          color={getColor("WonLost")}
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
