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

  const getColor = (target: "New" | "Ongoing" | "WonLost") => {
    if (target === "New")
      return currentStatus === "New" ? "#DB2727" : "#9ca3af";
    if (target === "Ongoing")
      return currentStatus === "Ongoing" ? "#DB2727" : "#9ca3af";
    if (target === "WonLost")
      return currentStatus === "Won" || currentStatus === "Lost"
        ? "#DB2727"
        : "#9ca3af";
    return "#9ca3af";
  };

  const MaskedSVG = ({ src, color }: { src: string; color: string }) => (
    <div
      className="w-full h-[50px]"
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        maskSize: "100% 100%",
      }}
    />
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto relative">
      <div className="flex justify-between -space-x-14">
        {/* Step 1: New */}
        <div className="relative w-[30%] min-w-[200px]">
          <MaskedSVG src="/images/sales/flow_bar1.svg" color={getColor("New")} />
          <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px]">
            New
          </span>
        </div>

        {/* Step 2: Ongoing */}
        <div className="relative w-[30%] min-w-[200px]">
          <MaskedSVG src="/images/sales/flow_bar2.svg" color={getColor("Ongoing")} />
          <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-[16px]">
            Ongoing
          </span>
        </div>

        {/* Step 3: Won/Lost */}
        <div className="relative w-[30%] min-w-[200px]">
          <MaskedSVG src="/images/sales/flow_bar3.svg" color={getColor("WonLost")} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <select
                value={selectedWonLost}
                disabled={currentStatus !== "Ongoing"}
                onChange={(e) => handleDropdownChange(e.target.value as "Won" | "Lost")}
                className={`
                  appearance-none bg-transparent text-white font-semibold text-[16px] pr-6
                  cursor-pointer rounded-md py-1 pl-2
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  ${currentStatus !== "Ongoing" ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <option className="bg-white text-black" value="Won">
                  Won
                </option>
                <option className="bg-white text-black" value="Lost">
                  Lost
                </option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
