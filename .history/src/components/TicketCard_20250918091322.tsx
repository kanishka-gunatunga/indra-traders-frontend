import { Draggable } from "@hello-pangea/dnd";
import Image from "next/image";

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
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-2xl border border-[#DB272780]/50 p-4 shadow mb-4 mr-2"
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
        </div>
      )}
    </Draggable>
  );
};
