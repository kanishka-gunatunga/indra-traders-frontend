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
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
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
        <span className="font-medium text-[14px]">{id}</span>
        <span
          className={`text-white text-sm w-[41.14px] h-[14.69px] rounded-[9.38px] 
              pt-[2.34px] pb-[2.34px] pl-[7.03px] pr-[7.03px] 
              flex items-center justify-center text-[10px] ${priorityColors[priority]}`}
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
        <span className="text-sm">{user}</span>
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
