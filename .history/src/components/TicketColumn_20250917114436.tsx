import { TicketCard } from "./TicketCard";

interface TicketColumnProps {
  title: string;
  tickets: TicketCardProp[];
}

export const TicketColumn = ({ title, tickets }: TicketColumnProps) => {
  return (
    <div className="flex flex-col bg-gray-100 rounded-2xl p-4 w-80">
      {/* Title + underline */}
      <h2 className="font-semibold text-[22px] mb-2">{title}</h2>
      <hr className="border-gray-300 mb-4" />

      {/* Scrollable list of tickets */}
      <div className="flex flex-col overflow-y-auto max-h-[400px] pr-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} {...ticket} />
        ))}
      </div>
    </div>
  );
};
