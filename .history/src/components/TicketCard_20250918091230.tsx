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
      {(provided)=>(
        <div
        ></div>
      )}
    </Draggable>
    
  );
};
