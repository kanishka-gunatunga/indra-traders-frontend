import { TicketCard, TicketCardProps } from "./TicketCard";

interface TicketColumnProps {
  title: string;
  tickets: TicketCardProps[];
}

export const TicketColumn = ({ title, tickets }: TicketColumnProps) => {
  return (
    <div className="flex flex-col bg-white rounded-3xl p-5 flex-1 min-w-[250px">
      {/* Title + underline */}
      <h2 className="font-semibold text-[17px] leading-[100%] tracking-normal mb-2 text-[#575757] montserrat">
        {title}
      </h2>

      <hr className="border-gray-300 mb-4 mt-3" />

      {/* Scrollable list of tickets */}
      <div className="flex flex-col overflow-y-auto overflow-x-hidden max-h-[400px]">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} {...ticket} />
        ))}
      </div>
    </div>
  );
};
