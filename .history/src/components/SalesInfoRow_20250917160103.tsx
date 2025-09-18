import React from 'react'

export default function SalesInfoRow() {
  return (
    InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="mt-3 flex w-full gap-3">
    <span className="w-1/3 font-medium text-[#1D1D1D] text-[18px] leading-[100%] tracking-[0%]">
      {label}
    </span>
    <span className="w-2/3 font-medium text-[#575757] text-[18px] leading-[100%] tracking-[0%]">
      {value}
    </span>
  </div>
);
  )
}
