"use client"

import { Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef } from "react";

export interface TicketCardProps {
  id: string;
  priority: number;
  user: string;
  phone: string;
  date: string;
  status: "New" | "Ongoing" | "Won" | "Lost";
  index?: number;
}

const priorityColors = [
  "bg-[#FFA7A7]",
  "bg-[#FFCBA4]",
  "bg-[#D6B3FF]",
  "bg-green-300",
  "bg-blue-300",
  "bg-purple-300",
];

export const TicketCard = ({
  id,
  priority,
  user,
  phone,
  date,
  index = 0,
}: TicketCardProps) => {

  const router = useRouter();
  const dragStart = useRef<{x: number; y:number} | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStart.current = {x: e.clientX}
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-2xl border border-[#DB272780]/50 p-4 shadow mb-4"
        >
          {/* Top Row */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">{id}</span>
            <span
              className={`text-black text-[10px] w-[41.14px] h-[18px] rounded-[9.38px] 
              flex items-center justify-center px-[7.03px] ${priorityColors[priority]}`}
            >
              P{priority}
            </span>
          </div>

          {/* User info */}
          <div className="flex items-center mb-1 space-x-2">
            <Image
              src="/images/sales/user-icon.svg"
              className="w-5 h-5"
              alt="User"
              width={14}
              height={14}
            />
            <span className="font-light text-sm text-[#1D1D1D]">{user}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center mb-1 space-x-2">
            <Image
              src="/images/sales/phone-icon.svg"
              className="w-5 h-5"
              alt="Phone"
              width={14}
              height={14}
            />
            <span className="font-light text-sm text-[#1D1D1D]">{phone}</span>
          </div>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <Image
              src="/images/sales/calendar-icon.svg"
              className="w-5 h-5"
              alt="Calendar"
              width={14}
              height={14}
            />
            <span className="font-light text-sm text-[#1D1D1D]">{date}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
