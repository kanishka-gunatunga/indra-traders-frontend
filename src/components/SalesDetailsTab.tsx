/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {Role} from "@/types/role";
import Image from "next/image";
import {useState} from "react";
import {FiPlus} from "react-icons/fi";
import {useEventsByCustomer} from "@/hooks/useEvent";

interface Followup {
    id: number;
    activity: string;
    activity_date: string;
    spare_part_sale_id: number;
    createdAt: string;
    updatedAt: string;
}

interface Reminder {
    id: number;
    task_title: string;
    task_date: string;
    note: string | null;
    spare_part_sale_id: number;
    createdAt: string;
    updatedAt: string;
}

interface SalesDetailsTabProps {
    customerId: string;
    status: string;
    onOpenActivity: () => void;
    onOpenReminder: () => void;
    followups: Followup[];
    reminders: Reminder[];
}

export default function SalesDetailsTab({
                                            customerId,
                                            followups,
                                            reminders,
                                            status,
                                            onOpenActivity,
                                            onOpenReminder,
                                        }: SalesDetailsTabProps) {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const tabs = ["Follow up", "Reminders", "Events"];
    const [activeTab, setActiveTab] = useState(0);

    const {data: eventData = [], isLoading: loadingEvents} = useEventsByCustomer(customerId);

    // const isAddDisabled =
    //     status === "New" && role !== "admin" && role !== "tele-marketer";
    const isAddDisabled =
        status === "New" && role !== "admin" && role !== "tele-marketer";

    const formatDate = (isoDate: string) => {
        if (!isoDate) return "N/A";
        return new Date(isoDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="w-full relative">
            {/* Tabs */}
            <div className="flex border-b border-gray-300">
                {tabs.map((tab, index) => (
                    <div
                        key={tab}
                        className={`flex-1 py-4 cursor-pointer text-lg px-3 relative ${
                            activeTab === index
                                ? "font-medium text-[#575757]"
                                : "text-gray-600"
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab}
                        {activeTab === index && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#DB2727] rounded-t"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Tab content */}
            <div className="mt-4">
                {activeTab === 0 && (
                    <>
                        <div className="mt-8 bg-white rounded-4xl py-8 px-8 relative h-[220px]">
                            {/* Scrollable container */}
                            <div className="h-full pr-2">
                                {/* Table header */}
                                <div className="flex font-medium text-[#575757] min-w-[400px]">
                                    <div className="w-1/2 px-2">Activity</div>
                                    <div className="w-1/2 px-2">Date</div>
                                </div>
                                <hr className="border-gray-300 my-4"/>

                                <div className="h-[100] overflow-y-auto no-scrollbar">
                                    {/* Table rows */}
                                    {followups.length === 0 ? (
                                        <div>No followups available.</div>
                                    ) : (
                                        followups.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex ${
                                                    idx > 0 ? "mt-3" : ""
                                                } font-medium text-black min-w-[400px]`}
                                            >
                                                <div className="w-1/2 px-2">{item.activity}</div>
                                                <div className="w-1/2 px-2">{formatDate(item?.activity_date)}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Floating Add button */}
                            <button
                                disabled={isAddDisabled}
                                onClick={onOpenActivity}
                                className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                                    isAddDisabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#DB2727] hover:bg-red-700"
                                }`}
                            >
                                <FiPlus size={24}/>
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 1 && (
                    <div className="mt-8 bg-white rounded-4xl py-8 px-8 relative h-[220px]">
                        {/* Scrollable container */}
                        <div className="h-full overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Task Title</div>
                                <div className="w-1/3 px-2">Task Date</div>
                                <div className="w-1/3 px-2">Note</div>
                            </div>
                            <hr className="border-gray-300 my-4"/>

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {reminders.length === 0 ? (
                                    <div>No reminders available.</div>
                                ) : (
                                    reminders.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${
                                                idx > 0 ? "mt-3" : ""
                                            } font-medium text-black min-w-[400px]`}
                                        >
                                            <div className="w-1/3 px-2">{item.task_title}</div>
                                            <div className="w-1/3 px-2">{formatDate(item.task_date)}</div>
                                            <div className="w-1/3 px-2">{item.note}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Floating Add button */}
                        <button
                            disabled={isAddDisabled}
                            onClick={onOpenReminder}
                            className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                                isAddDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#DB2727] hover:bg-red-700"
                            }`}
                        >
                            <FiPlus size={24}/>
                        </button>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="mt-8 flex flex-col gap-4 h-[220px] overflow-y-auto no-scrollbar">
                        {eventData.map((item, idx) => (
                            <div key={idx} className="relative flex items-start gap-4">
                                {/* Circle */}
                                <div className="w-5 h-5 rounded-full border-2 border-[#DB2727]"/>

                                {/* Text block */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[18px] font-montserrat">
                      {item.title}
                    </span>
                                        <Image
                                            src="/images/sales/cake.svg"
                                            alt="Cake image"
                                            width={15}
                                            height={15}
                                        />
                                    </div>
                                    <span className="font-medium text-[15px] font-montserrat text-[#575757]">
                    {item.date}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
