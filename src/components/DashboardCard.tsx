import Image from "next/image";
import Link from "next/link";

interface DashboardCardProps {
    title: string;
    icon: string;
    backgroundColor: string;
    data: CardItemProps[];
    viewAllLink: string;
    onItemClick?: (item: CardItemProps) => void;
}


export interface CardItemProps {
    primaryText: string;
    secondaryText: string;
    date: string;
    status?: "ongoing" | "won";
    onViewClick?: (item: CardItemProps) => void;
}

const CardItem = ({
                      primaryText,
                      secondaryText,
                      date,
                      status,
                      onViewClick,
                  }: CardItemProps) => {
    const getStatusBadge = () => {
        if (status === "ongoing") {
            return (
                <span className="rounded-[23px] bg-[#8D27DB] px-4 py-1 text-sm font-medium text-white">
          {secondaryText}
        </span>
            );
        }
        if (status === "won") {
            return (
                <span className="rounded-[23px] bg-[#039855] px-4 py-1 text-sm font-medium text-white">
          {secondaryText}
        </span>
            );
        }
        return (
            <span className="text-base font-normal text-[#575757]">
        {secondaryText}
      </span>
        );
    };

    return (
        <div className="flex w-full flex-col gap-1 rounded-lg bg-[#F5F5F5] p-3">
            {/* Top Row */}
            <div className="flex justify-between">
        <span className="text-lg font-semibold text-[#1D1D1D]">
          {primaryText}
        </span>
                <span className="text-base font-semibold text-[#1D1D1D]">{date}</span>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
                {getStatusBadge()}
                <button
                    onClick={() => onViewClick ? onViewClick({primaryText, secondaryText, date, status, onViewClick}) : null}
                    className="text-base font-normal text-[#195FFC] hover:underline"
                >
                    View
                </button>
            </div>
        </div>
    );
}

export default function DashboardCard({
                                          title,
                                          icon,
                                          backgroundColor,
                                          data,
                                          viewAllLink,
                                          onItemClick
                                      }: DashboardCardProps) {
    return (
        <div
            className="relative h-[437px] w-[417px] rounded-[20px] shadow-[#D8D8D8] shadow-md border-1 border-[#D8D8D8] backdrop-blur-[25px]">
            {/* Card Header */}
            <div
                className={`flex h-[69px] items-center px-8 rounded-t-[20px] py-3`}
                style={{backgroundColor: backgroundColor}}
            >
                <div className="flex items-center gap-4">
                    <Image src={icon} alt={`${title} Icon`} width={24} height={24}/>
                    <h2 className="text-xl font-semibold text-white montserrat">{title}</h2>
                </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-col gap-2 p-4">
                {data.map((item, index) => (
                    <CardItem key={index} {...item} onViewClick={onItemClick}/>
                ))}
            </div>

            {/* View All Link */}
            <div className="absolute bottom-5 left-0 right-0 text-center px-2 pt-4 border-t-1 border-[#D8D8D8]">
                <Link
                    href={viewAllLink}
                    className="font-montserrat text-lg font-medium text-[#195FFC] hover:underline"
                >
                    View All {title.replace("Recent", "").trim()}
                </Link>
            </div>
        </div>
    );
}



