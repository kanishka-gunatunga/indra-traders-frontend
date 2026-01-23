/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useComplaints } from "@/hooks/useComplaint";
import { Complaint } from "@/types/complaint.types";
import { useRouter } from "next/navigation";
import { useNearestReminders } from "@/hooks/useReminder";
import {useCurrentUser} from "@/utils/auth";

const category = ["ITPL", "ISP", "IMS", "IFT", "BYD"];
const status = ["New", "In Review", "Processing", "Approval", "Completed"];

export default function Complains() {

    const router = useRouter();

    const user = useCurrentUser();

    const { data: complaints, isLoading, isError } = useComplaints();
    const { data: reminderData } = useNearestReminders();

    // Demo data for Upcoming Events
    const upcomingEventsData = [
        { customerName: "John Doe", date: "2024-10-25", eventType: "Customer Birthday" },
        { customerName: "Alice Smith", date: "2024-10-28", eventType: "Service Due" },
        { customerName: "Robert Brown", date: "2024-11-01", eventType: "Warranty Expiry" },
        { customerName: "Emily White", date: "2024-11-05", eventType: "Customer Birthday" },
        { customerName: "Michael Green", date: "2024-11-10", eventType: "Insurance Renewal" },
    ];

    const [isFilterComplainsModalOpen, setIsFilterComplainsModalOpen] =
        useState(false);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);


    const filteredComplaints = useMemo(() => {
        if (!complaints) return [];

        return complaints.filter((c: any) => {
            const categoryMatch =
                selectedCategories.length === 0 || selectedCategories.includes(c.category);
            const statusMatch =
                selectedStatuses.length === 0 || selectedStatuses.includes(c.status);
            return categoryMatch && statusMatch;
        });
    }, [complaints, selectedCategories, selectedStatuses]);

    const handleRowClick = (id: number) => {
        router.push(`/admin/complains/${id}`);
    };

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name={user?.full_name || "Sophie Eleanor"}
                    // location={user?.branch || "Bambalapitiya"}
                    title="All Complains"
                />

                {/* All Complains Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">All Complains</span>

                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                            onClick={() => setIsFilterComplainsModalOpen(true)}
                        >
                            <Image
                                src={"/images/admin/flowbite_filter-outline.svg"}
                                width={24}
                                height={24}
                                alt="Filter icon"
                            />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="w-full text-center py-10 text-gray-600">Loading complaints...</div>
                    ) : isError ? (
                        <div className="w-full text-center py-10 text-red-500">
                            Failed to load complaints.
                        </div>
                    ) : (

                        <div className="w-full mt-5 ">
                            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                                <div className="min-w-[1000px] ">
                                    {/* Table header */}
                                    <div
                                        className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                        <div className="w-1/7 px-3 py-2">Category</div>
                                        <div className="w-1/7 px-3 py-2">Ticket No.</div>
                                        <div className="w-1/7 px-3 py-2">Contact No.</div>
                                        <div className="w-1/7 px-3 py-2">Vehicle No.</div>
                                        <div className="w-1/7 px-3 py-2">Title</div>
                                        <div className="w-1/7 px-3 py-2">Status</div>
                                        <div className="w-1/7 px-3 py-2">Progress</div>
                                    </div>

                                    {/* Table body (scrollable vertically) */}
                                    <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                        {filteredComplaints.length > 0 ? (
                                            filteredComplaints.map((item: Complaint) => (
                                                <div
                                                    key={item.id}
                                                    className="flex text-lg mt-1 text-black hover:bg-gray-50 transition cursor-pointer"
                                                    onClick={() => handleRowClick(item.id)}
                                                >
                                                    <div className="w-1/7 px-3 py-2">{item.category}</div>
                                                    <div className="w-1/7 px-3 py-2">{item.ticket_no}</div>
                                                    <div className="w-1/7 px-3 py-2">{item.contact_no}</div>
                                                    <div className="w-1/7 px-3 py-2 relative">
                                                        {item.vehicle_no}
                                                    </div>

                                                    <div className="w-1/7 px-3 py-2">{item.title}</div>
                                                    <div className="w-1/7 px-3 py-2">{item.status}</div>
                                                    <div className="w-1/7 px-3 py-2">{item.progress}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-600 py-5">
                                                No complaints found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    )}
                </section>

                <section className="relative flex flex-wrap w-full mb-5 gap-3 justify-center items-center">
                    <div className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Next Action</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Ticket No.</div>
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Contact No.</div>
                                {/*<div className="w-1/4 px-2">Date</div>*/}
                            </div>
                            <hr className="border-gray-300 my-4" />

                            <div className="h-[100] max-h-[300px] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {reminderData && reminderData.length > 0 ? (
                                    reminderData.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`flex ${idx > 0 ? "mt-3" : ""
                                                } font-medium text-black min-w-[400px] hover:bg-white/50 p-2 rounded-lg transition-colors cursor-pointer`}
                                            onClick={() => router.push(`/admin/complains/${item.complaintId}`)}
                                        >
                                            <div className="w-1/3 px-2 truncate">{item.complaint?.ticket_no || "N/A"}</div>
                                            <div className="w-1/3 px-2 truncate">{item.complaint?.customer?.customer_name || "N/A"}</div>
                                            <div className="w-1/3 px-2 truncate">{item.complaint?.contact_no || item.complaint?.customer?.phone_number || "N/A"}</div>
                                            {/*<div className="w-1/4 px-2 text-sm text-gray-600">{new Date(item.task_date).toLocaleDateString()}</div>*/}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">No upcoming actions</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Upcoming Events</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Date</div>
                                <div className="w-1/3 px-2">Event Type</div>
                            </div>
                            <hr className="border-gray-300 my-4" />

                            <div className="h-[100] max-h-[300px] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {upcomingEventsData && upcomingEventsData.length > 0 ? (
                                    upcomingEventsData.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${idx > 0 ? "mt-3" : ""
                                                } font-medium text-black min-w-[400px] hover:bg-white/50 p-2 rounded-lg transition-colors`}
                                        >
                                            <div className="w-1/3 px-2">{item.customerName}</div>
                                            <div className="w-1/3 px-2">{item.date}</div>
                                            <div className="w-1/3 px-2">{item.eventType}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">No upcoming events</div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Complain Filter Modal */}
            {isFilterComplainsModalOpen && (
                <Modal
                    title="Filter"
                    onClose={() => setIsFilterComplainsModalOpen(false)}
                    actionButton={{
                        label: "Apply",
                        onClick: () => {
                            // console.log("Selected Categories:", selectedCategories);
                            // console.log("Selected Statuses:", selectedStatuses);
                            setIsFilterComplainsModalOpen(false);
                        },
                    }}
                >
                    {/* --- Category --- */}
                    <div className="w-full">
                        <span className="font-montserrat font-semibold text-lg leading-[100%]">
                            Category
                        </span>
                        <div className="w-full mt-5 flex gap-3 flex-wrap">
                            {category.map((type) => {
                                const isSelected = selectedCategories.includes(type);
                                return (
                                    <div
                                        key={type}
                                        className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                            ${isSelected
                                                ? "bg-blue-500 text-white border-none"
                                                : ""
                                            }`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedCategories(
                                                    selectedCategories.filter((r) => r !== type)
                                                );
                                            } else {
                                                setSelectedCategories([...selectedCategories, type]);
                                            }
                                        }}
                                    >
                                        {type}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- Status --- */}
                    <div className="w-full mt-5">
                        <span className="font-montserrat font-semibold text-lg leading-[100%]">
                            Status
                        </span>
                        <div className="w-full mt-5 flex gap-3 flex-wrap">
                            {status.map((source) => {
                                const isSelected = selectedStatuses.includes(source);
                                return (
                                    <div
                                        key={source}
                                        className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                            ${isSelected
                                                ? "bg-blue-500 text-white border-none"
                                                : ""
                                            }`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedStatuses(
                                                    selectedStatuses.filter((d) => d !== source)
                                                );
                                            } else {
                                                setSelectedStatuses([...selectedStatuses, source]);
                                            }
                                        }}
                                    >
                                        {source}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
