interface TicketCardProps {
  id: string;
  priority: number;
  user: string;
  phone: string;
  date: string;
}

const priorityColors = [
  "bg-red-500",
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
    <div className="bg-white rounded-xl p-4 shadow mb-4 w-72">
      {/* Top Row: Ticket ID & Priority */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-[14px]">{id}</span>
      </div>
      <select
        className={`text-white text-sm px-2 py-1 rounded ${priorityColors[priority]}`}
        value={priority}
      >
        <option value={0}>P0</option>
        <option value={1}>P1</option>
        <option value={2}>P2</option>
        <option value={3}>P3</option>
        <option value={4}>P4</option>
        <option value={5}>P5</option>
      </select>

      {/* User info */}
      <div className="flex items-center mb-1 space-x-2">
        <img src="/images/user-icon.svg" className="w-5 h-5" alt="User" />
        <span className="text-sm">{user}</span>
      </div>

      {/* Phone info */}
      <div className="flex items-center mb-1 space-x-2">
        <img src="/images/phone-icon.svg" className="w-5 h-5" alt="Phone" />
        <span className="text-sm">{phone}</span>
      </div>

      {/* Date info */}
      <div className="flex items-center space-x-2">
        <img
          src="/images/calendar-icon.svg"
          className="w-5 h-5"
          alt="Calendar"
        />
        <span className="text-sm">{date}</span>
      </div>
    </div>
  );
};
