"use client";

import { useState, useEffect } from "react";
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

  // Helper to get SVG fill color
  const getFill = (step: "New" | "Ongoing" | "Won/Lost") => {
    if (step === "New") return currentStatus === "New" ? "#DB2727" : "#C0C0C0";
    if (step === "Ongoing")
      return currentStatus === "Ongoing" ? "#DB2727" : "#C0C0C0";
    if (step === "Won/Lost")
      return currentStatus === "Won" || currentStatus === "Lost"
        ? "#DB2727"
        : "#C0C0C0";
    return "#C0C0C0";
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap w-full max-w-[800px] gap-2">
  {/* New */}
  <div className="relative flex-1 flex justify-center items-center -mr-6">
    <svg
      width="271"
      height="58"
      viewBox="0 0 271 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33 10V48C33 51.3137 35.6863 54 39 54H235.281C236.738 54 238.146 53.4695 239.241 52.5077L260.869 33.5077C263.589 31.1181 263.589 26.8819 260.869 24.4923L239.241 5.49234C238.146 4.53046 236.738 4 235.281 4H39C35.6863 4 33 6.68629 33 10Z"
        fill={getFill("New")}
      />
    </svg>
    <span className="absolute inset-0 flex justify-center items-center text-white font-semibold text-[16px]">
      New
    </span>
  </div>

  {/* Ongoing */}
  <div className="relative flex-1 flex justify-center items-center -mr-6">
    <svg
      width="271"
      height="58"
      viewBox="0 0 271 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M201.641 4C203.098 4.0001 204.506 4.53041 205.601 5.49219L227.229 24.4922C229.948 26.8818 229.949 31.1183 227.229 33.5078L205.601 52.5078C204.506 53.4696 203.098 53.9999 201.641 54H5.35938C4.89163 54 4.43695 53.944 4 53.8428C4.95693 53.6201 5.85206 53.1654 6.60059 52.5078L28.2285 33.5078C30.9485 31.1183 30.9485 26.8818 28.2285 24.4922L6.60059 5.49219C5.852 4.83457 4.95702 4.37887 4 4.15625C4.43689 4.05503 4.89171 4 5.35938 4H201.641Z"
        fill={getFill("Ongoing")}
      />
    </svg>
    <span className="absolute inset-0 flex justify-center items-center text-white font-semibold text-[16px]">
      Ongoing
    </span>
  </div>

  {/* Won/Lost */}
  <div className="relative flex-1 flex justify-center items-center">
    <svg
      width="271"
      height="58"
      viewBox="0 0 271 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M241 4C254.807 4 266 15.1929 266 29C266 42.8071 254.807 54 241 54H4V53.7461C4.82107 53.5005 5.58732 53.0823 6.24121 52.5078L27.8691 33.5078C30.5891 31.1183 30.5891 26.8818 27.8691 24.4922L6.24121 5.49219C5.58724 4.91769 4.82117 4.49848 4 4.25293V4H241Z"
        fill={getFill("Won/Lost")}
      />
    </svg>

    {/* Dropdown */}
    <div className="absolute flex items-center inset-0 justify-center">
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
