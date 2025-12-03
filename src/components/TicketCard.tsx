"use client";

// import {Draggable} from "@hello-pangea/dnd";
import Image from "next/image";
import {useRouter} from "next/navigation";
// import {useRef} from "react";
import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";

export interface TicketCardProps {
    id: string;
    priority: number;
    user: string;
    phone: string;
    date: string;
    status: "New" | "Ongoing" | "Won" | "Lost";
    index?: number;
    route?: string;
    isOverlay?: boolean;
}

// const priorityColors = [
//     "bg-[#FFA7A7]",
//     "bg-[#FFCBA4]",
//     "bg-[#D6B3FF]",
//     "bg-green-300",
//     // "bg-blue-300",
//     "bg-[#D6B3FF]",
// ];

const priorityColors = [
    "bg-[#E0E0E0]",
    "bg-[#FCA5A5]",
    "bg-[#FDE047]",
    "bg-[#86EFAC]",
];

// const priorityBorders = [
//     "border-[#FFA7A7]",
//     "border-[#FFCBA4]",
//     "border-[#D6B3FF]",
//     "border-green-300",
//     // "border-blue-300",
//     "border-[#D6B3FF]",
// ];

const priorityBorders = [
    "border-[#E0E0E0]",
    "border-[#FCA5A5]",
    "border-[#FDE047]",
    "border-[#86EFAC]",
];

export const TicketCard = ({
                               id,
                               priority,
                               user,
                               phone,
                               date,
                               index = 0,
                               route,
                               isOverlay = false
                           }: TicketCardProps) => {
    const router = useRouter();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    // const style = {
    //     transform: CSS.Translate.toString(transform),
    //     opacity: isDragging ? 1 : 1, // Fade out original position while dragging
    //     touchAction: 'none', // Required for PointerSensor
    //     zIndex: isDragging ? 99999 : 'auto',
    // };

    // const dragStart = useRef<{ x: number; y: number } | null>(null);

    // const handleMouseDown = (e: React.MouseEvent) => {
    //     dragStart.current = {x: e.clientX, y: e.clientY};
    // };

    // const handleMouseUp = (e: React.MouseEvent) => {
    //     if (!dragStart.current) return;
    //
    //     const dx = Math.abs(e.clientX - dragStart.current.x);
    //     const dy = Math.abs(e.clientY - dragStart.current.y);
    //
    //     // If mouse didn’t move much → it's a click
    //     if (dx < 5 && dy < 5) {
    //         router.push(route ? `${route}/${id}` : `/sales-agent/sales/${id}`);
    //     }
    //
    //     dragStart.current = null;
    // };

    const handleClick = () => {
        if (!isDragging) {
            router.push(route ? `${route}/${id}` : `/sales-agent/sales/${id}`);
        }
    };

    let containerStyle = "";

    if (isOverlay) {
        containerStyle = "rotate-3 scale-105 shadow-2xl cursor-grabbing z-50";
    } else if (isDragging) {
        containerStyle = "opacity-30 grayscale border-dashed border-gray-400";
    } else {
        containerStyle = "opacity-100 hover:shadow-md cursor-grab active:cursor-grabbing";
    }

    return (
        // <Draggable draggableId={id} index={index}>
        //     {(provided, snapshot) => (
                <div
                    ref={!isOverlay ? setNodeRef : null}
                    {...(!isOverlay ? listeners : {})}
                    {...(!isOverlay ? attributes : {})}
                    onClick={handleClick}
                    // className={`bg-white rounded-2xl border ${priorityBorders[priority]} p-4 shadow mb-4 cursor-pointer`}
                    // className={`bg-white rounded-2xl border ${priorityBorders[priority] || "border-gray-200"} p-4 shadow mb-4 cursor-grab active:cursor-grabbing relative`}
                    className={`
                bg-white rounded-2xl border p-4 mb-4 relative transition-all duration-200
                ${priorityBorders[priority] || "border-gray-200"}
                ${containerStyle}
            `}
                >
                    {/* Top Row */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">{id}</span>
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
                        <span className="font-light text-sm text-[#1D1D1D]">{user}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center mb-1 space-x-2">
                        <Image
                            src="/images/sales/phone-icon.svg"
                            className="w-5 h-5"
                            alt="Phone"
                            width={14}
                            height={14}
                        />
                        <span className="font-light text-sm text-[#1D1D1D]">{phone}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/images/sales/calendar-icon.svg"
                            className="w-5 h-5"
                            alt="Calendar"
                            width={14}
                            height={14}
                        />
                        <span className="font-light text-sm text-[#1D1D1D]">{date}</span>
                    </div>
                </div>
        //     )}
        // </Draggable>
    );
};
