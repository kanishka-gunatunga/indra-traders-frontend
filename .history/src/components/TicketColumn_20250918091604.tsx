import { TicketCard, TicketCardProps } from "./TicketCard";
import { Droppable } from "@hello-pangea/dnd";
interface TicketColumnProps {
  title: string;
  tickets: TicketCardProps[];
}

export const TicketColumn = ({ title, tickets }: TicketColumnProps) => {
  return (
    <div className="flex flex-col bg-white rounded-3xl p-5 flex-1 min-w-[250px]">
      {/* Title + underline */}
      <h2 className="font-semibold text-[17px] leading-[100%] tracking-normal mb-2 text-[#575757] montserrat">
        {title}
      </h2>

      <hr className="border-gray-300 mb-4 mt-3" />

      <Droppable droppableId={title}>
        {(provided)=>(
          <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col overflow-y-auto overflow-x-hidden max-h-[400px] no-scrollbar"
          >
            
          </div>
        )}
      </Droppable>
    </div>
  );
};
