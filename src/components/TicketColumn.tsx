import { TicketCard, TicketCardProps } from "./TicketCard";
// import { Droppable } from "@hello-pangea/dnd";
import { useDroppable } from "@dnd-kit/core";


interface TicketColumnProps {
  title: string;
  tickets: TicketCardProps[];
  route?: string;
}

export const TicketColumn = ({ title, tickets, route }: TicketColumnProps) => {

    const { setNodeRef, isOver } = useDroppable({
        id: title,
    });


    return (
    <div className="flex flex-col bg-white rounded-3xl p-5 flex-1 min-w-[250px]">
      {/* Title + underline */}
      <h2 className="font-semibold text-[17px] leading-[100%] tracking-normal mb-2 text-[#575757] montserrat">
        {title}
      </h2>

      <hr className="border-gray-300 mb-4 mt-3" />

      {/*<Droppable droppableId={title}>*/}
      {/*  {(provided) => (*/}
          <div
            // ref={provided.innerRef}
            // {...provided.droppableProps}
            ref={setNodeRef}
            // className="flex flex-col overflow-y-auto overflow-x-hidden max-h-[400px] min-h-[100px] no-scrollbar"
            className={`
                    flex flex-col overflow-y-auto overflow-x-hidden max-h-[400px] min-h-[150px] no-scrollbar 
                    rounded-xl transition-colors duration-200
                    ${isOver ? "bg-gray-100 ring-2 ring-blue-100" : ""} 
                `}
          >
            {tickets.map((ticket, index) => (
              <TicketCard key={ticket.id} {...ticket} index={index} route={route} />
            ))}

              {/*{tickets.length === 0 && (*/}
              {/*    <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm italic mt-4">*/}
              {/*        No tickets*/}
              {/*    </div>*/}
              {/*)}*/}

              {tickets.length === 0 && (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm italic mt-4 select-none">
                      Drop here
                  </div>
              )}
            {/*{provided.placeholder}*/}
          </div>
        {/*)}*/}
      {/*</Droppable>*/}
    </div>
  );
};
