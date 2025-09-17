import Image from "next/image";

export interface TicketCardProps {
  id: string;
  priority: number;
  user: string;
  phone: string;
  date: string;
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
}: TicketCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-[#DB272780]/50 p-4 shadow mb-4">
      {/* Top Row: Ticket ID & Priority */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-[12px] leading-[100%] tracking-normal">
          {id}
        </span>

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
        <span className="font-medium text-[10px] leading-[100%] tracking-normal">
          {user}
        </span>
      </div>

      {/* Phone info */}
      <div className="flex items-center mb-1 space-x-2">
        <Image
          src="/images/sales/phone-icon.svg"
          className="w-5 h-5"
          alt="Phone"
          width={14}
          height={14}
        />
        <span className="text-sm">{phone}</span>
      </div>

      {/* Date info */}
      <div className="flex items-center space-x-2">
        <Image
          src="/images/sales/calendar-icon.svg"
          className="w-5 h-5"
          alt="Calendar"
          width={14}
          height={14}
        />
        <span className="text-sm">{date}</span>
      </div>
    </div>
  );
};
