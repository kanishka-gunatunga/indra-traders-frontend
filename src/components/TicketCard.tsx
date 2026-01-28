"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";

export interface TicketCardProps {
    id: string;
    priority: number;
    user: string;
    phone: string;
    date: string;
    status: "New" | "Ongoing" | "Won" | "Lost";
    index?: number;
    route?: string;
    email?: string; // Added email prop
    isOverlay?: boolean;
    dbId?: string | number;
    ticketNumber?: string;
    categoryTag?: string;
    draggable?: boolean;
}

const priorityBackgrounds = [
    "bg-[#FFF4F0]", // P0 -> Light Red/Orange
    "bg-[#FFF9F0]", // P1 -> Light Orange/Yellow
    "bg-[#F5F0FF]", // P2 -> Light Purple
    "bg-[#F0F9FF]", // P3 -> Light Blue
];

const priorityBadges = [
    "bg-[#FFDDD1] text-[#B54708]", // P0 
    "bg-[#FFEFD1] text-[#B54708]", // P1
    "bg-[#E9D7FE] text-[#6941C6]", // P2
    "bg-[#D1E9FF] text-[#026AA2]", // P3
];

const priorityBorders = [
    "border-[#FCA5A5]", // P0 
    "border-[#FEC84B]", // P1
    "border-[#D6BBFB]", // P2
    "border-[#B2DDFF]", // P3
];

import { PhoneIcon, MailIcon, EyeIcon, UserIcon, CalendarIcon, MessageSquareIcon } from "./KanbanIcons";

// ... existing code ...

export const TicketCard = ({
    id,
    priority,
    user,
    ticketNumber,
    phone,
    date,
    index = 0,
    route,
    email,
    isOverlay = false,
    dbId,
    categoryTag,
    draggable = true
}: TicketCardProps) => {
    const router = useRouter();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: !draggable,
    });

    const handleClick = () => {
        if (!isDragging) {
            router.push(route ? `${route}/${id}` : `/sales-agent/sales/${id}`);
        }
    };

    const handleEmailClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (email) {
            window.location.href = `mailto:${email}`;
        } else {
            alert("No email address available for this customer.");
        }
    };

    let containerStyle = "";

    if (isOverlay) {
        containerStyle = "rotate-3 scale-105 shadow-2xl cursor-grabbing z-50 ring-2 ring-blue-400";
    } else if (isDragging) {
        containerStyle = "opacity-30 grayscale border-dashed border-gray-400";
    } else {
        containerStyle = "opacity-100 hover:shadow-lg cursor-grab active:cursor-grabbing";
    }

    // Default to P3 if priority is out of bounds
    const bgColor = priorityBackgrounds[priority] || priorityBackgrounds[3];
    const badgeStyle = priorityBadges[priority] || priorityBadges[3];
    const borderColor = priorityBorders[priority] || priorityBorders[3];

    return (
        <div
            ref={!isOverlay ? setNodeRef : null}
            {...(!isOverlay ? listeners : {})}
            {...(!isOverlay ? attributes : {})}
            // onClick={handleClick} // Removed container click to allow button clicks, handled via Eye icon or name
            className={`
                rounded-[16px] border p-5 mb-4 relative transition-all duration-200
                ${bgColor}
                ${borderColor}
                ${containerStyle}
            `}
        >
            {/* Header Row: Title & Badge */}
            <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#101828]">{ticketNumber}</span>
                    {categoryTag && <span className="text-[#575757] font-[500] text-[10px]">{categoryTag}</span>}
                </div>
                <div className="flex justify-between items-center">
                    {/*<span className="font-medium text-xs text-[#667085]">{id}</span>*/}
                    <span
                        className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}
                    >
                        P{priority}
                    </span>
                </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-2 mb-4">
                {/* User/Role - Mapping "user" prop to Name above, so here we might show Role or just use user again if it's the rep? 
                           The design shows: Icon Name
                                           Icon Phone
                                           Icon Date
                           Warning: "user" prop in MappedTicket is Customer Name. 
                           I used "user" as the Card Title above. 
                           Let's put the Sales Rep or Contact Person here if available, or just the icon with "Courtney Henry" etc as in design.
                           Since I don't have separate rep data, I'll use the user prop again or a placeholder.
                        */}
                <div className="flex items-center gap-2 text-[#475467]">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{user}</span>
                </div>
                <div className="flex items-center gap-2 text-[#475467]">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#475467]">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{date}</span>
                </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-3 mt-4 border-t-1 pt-3 border-[#E5E7EB80]">
                {/*<button className="flex-1 bg-white hover:bg-gray-50 text-[#344054] text-xs font-semibold py-2 px-3 rounded-[8px] border border-[#D0D5DD] shadow-sm flex items-center justify-center gap-2 transition-colors">*/}
                {/*    <PhoneIcon size={14} />*/}
                {/*    Call*/}
                {/*</button>*/}
                <button
                    onClick={handleEmailClick}
                    className="flex-1 bg-white hover:bg-gray-50 text-[#344054] text-xs font-semibold py-2 px-3 rounded-[8px] cursor-pointer border border-[#D0D5DD] shadow-sm flex items-center justify-center gap-2 transition-colors">
                    <MailIcon size={14} />
                    Email
                </button>
                <button
                    onClick={handleClick}
                    className="flex-1 bg-white hover:bg-gray-50 text-[#344054] text-xs font-semibold py-2 px-3 rounded-[8px] cursor-pointer border border-[#D0D5DD] shadow-sm flex items-center justify-center gap-2 transition-colors">
                    <EyeIcon size={14} />
                    View
                </button>
            </div>
        </div>
    );
};
