import { TicketCard, TicketCardProps } from "./TicketCard";
// import { Droppable } from "@hello-pangea/dnd";
import { useDroppable } from "@dnd-kit/core";


interface TicketColumnProps {
  title: string;
  tickets: TicketCardProps[];
  route?: string;
  draggable?: boolean;
}

export const TicketColumn = ({ title, tickets, route, draggable = true }: TicketColumnProps) => {

  const { setNodeRef, isOver } = useDroppable({
    id: title,
    disabled: !draggable, // Also disable droppable if not draggable (optional but consistent)
  });

  return (
    <div className="flex flex-col flex-1 min-w-[300px]">
      {/* Title + Count */}
      <div className="flex px-4 py-4 justify-between bg-[#FFFFFF99] rounded-[16px] border border-[#E5E7EB80] items-center mb-4 px-2">
        <h2 className="font-bold text-[18px] text-[#101828]">
          {title}
        </h2>
        <span className="bg-white text-gray-500 text-xs font-semibold px-2 py-1 rounded-full border border-gray-200">
          {tickets.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`
                flex flex-col gap-3 overflow-y-auto no-scrollbar h-[calc(100vh-280px)]
                transition-colors duration-200 p-1
                ${isOver ? "bg-gray-100/50 rounded-xl" : ""} 
            `}
      >
        {tickets.map((ticket, index) => (
          <TicketCard key={ticket.id} {...ticket} index={index} route={route ?? ticket.route} draggable={draggable} />
        ))}

        {tickets.length === 0 && (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm italic mt-4 select-none">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};
