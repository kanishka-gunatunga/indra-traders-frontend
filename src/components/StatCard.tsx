/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";

interface StatCardProps {
    title: string;
    count: number;
    percentage: string;
    icon: string;
    color?: string;
}

const StatCard = ({title, count, percentage, icon}: StatCardProps) => {
    const IconMap: any = {
        users: <div className="p-3 rounded-lg text-blue-600"><Image src="/total-leads.svg" alt="total leads"
                                                                                width={32} height={32} className="h-12 w-12"/></div>,
        "trending-up": <div className="p-3 rounded-lg text-orange-600"><Image src="/new-leads.svg"
                                                                                            alt="new leads" width={32}
                                                                                            height={32} className="h-12 w-12"/></div>,
        "check-circle": <div className="p-3 rounded-lg text-green-600"><Image src="/won-deals.svg"
                                                                                           alt="won leads" width={32}
                                                                                           height={32} className="h-12 w-12"/></div>,
        "x-circle": <div className="p-3 rounded-lg text-red-600"><Image src="/lost-deals.svg"
                                                                                   alt="loss leads" width={32}
                                                                                   height={32} className="h-12 w-12"/></div>
    }

    const isPositive = percentage.includes("+") || percentage.includes("conversion");
    const percentColor = isPositive ? "text-[#00A63E]" : "text-red-500";

    return (
        <div className="bg-[#FFFFFF99] p-6 rounded-[16px] border border-[#E5E7EB80] shadow-sm flex items-start justify-between">
            <div>
                <p className="text-[#4A5565] font-medium text-sm">{title}</p>
                <h3 className="text-[#101828] text-[30px] font-bold mt-2 mb-2">{count}</h3>
                <span className={`text-[14px] ${percentColor}`}>{percentage}</span>
            </div>
            {IconMap[icon]}
        </div>
    );
};

export default StatCard;