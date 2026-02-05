/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Header from "@/components/Header";
import Image from "next/image";
import React, { useState } from "react";
import { useCurrentUser } from "@/utils/auth";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ActivityLogFilters } from "@/services/logService";
import dayjs from "dayjs";
import Modal from "@/components/Modal";

const activityLogData = [
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
    {
        date: "12 Dec 2024",
        time: "08:10 PM",
        userRole: "Admin",
        userName: "Albert Flores",
        activityType: "User Level Edit",
        chanages: "764573 Change User Level",
    },
];

export default function ActivityLog() {

    const user = useCurrentUser();

    const [filters, setFilters] = useState<ActivityLogFilters>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<ActivityLogFilters>({});

    const { data: logs, isLoading, isError } = useActivityLogs(filters);

    const openFilterModal = () => {
        setTempFilters({ ...filters });
        setIsFilterOpen(true);
    };

    // Close Modal
    const closeFilterModal = () => {
        setIsFilterOpen(false);
    };

    // Handle Input Changes in Modal
    const handleTempChange = (field: keyof ActivityLogFilters, value: any) => {
        setTempFilters((prev) => ({ ...prev, [field]: value }));
    };

    // Apply: Commit temp filters to main state
    const handleApplyFilters = () => {
        setFilters(tempFilters);
        closeFilterModal();
    };

    // Clear: Reset everything
    const handleClearFilters = () => {
        setTempFilters({});
        setFilters({});
        closeFilterModal(); // Optional: Close modal on clear, or keep open
    };
    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                {/*<Header*/}
                {/*    name={user?.full_name || "Sophie Eleanor"}*/}
                {/*    location={user?.branch || "Bambalapitiya"}*/}
                {/*    title="Activity Log"*/}
                {/*/>*/}

                {/* Activity Log Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Activity Log</span>

                        <button onClick={openFilterModal}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                            <Image
                                src={"/images/admin/flowbite_filter-outline.svg"}
                                width={24}
                                height={24}
                                alt="Filter icon"
                            />
                        </button>
                    </div>
                    <div className="w-full mt-5 ">
                        <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                            <div className="min-w-[1000px] ">
                                {/* Table header */}
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/7 px-3 py-2">Date</div>
                                    <div className="w-1/7 px-3 py-2">Time</div>
                                    <div className="w-1/7 px-3 py-2">User Role</div>
                                    <div className="w-1/7 px-3 py-2">User Name</div>
                                    <div className="w-1/7 px-3 py-2">Activity Type</div>
                                    <div className="w-2/7 px-3 py-2">Changes</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">

                                    {isLoading && (
                                        <div className="flex justify-center items-center h-full text-gray-500">
                                            Loading activities...
                                        </div>
                                    )}

                                    {isError && (
                                        <div className="flex justify-center items-center h-full text-red-500">
                                            Failed to load activity logs.
                                        </div>
                                    )}

                                    {!isLoading && !isError && logs?.length === 0 && (
                                        <div className="flex justify-center items-center h-full text-gray-500">
                                            No records found.
                                        </div>
                                    )}


                                    {logs?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                                        >
                                            <div
                                                className="w-1/7 px-3 py-2">{dayjs(item.created_at).format("DD MMM YYYY")}</div>
                                            <div
                                                className="w-1/7 px-3 py-2">{dayjs(item.created_at).format("hh:mm A")}</div>
                                            <div className="w-1/7 px-3 py-2"><span
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {item.user_role}
                                            </span></div>
                                            <div className="w-1/7 px-3 py-2 relative">
                                                {item.user?.full_name || "Unknown"}
                                            </div>
                                            <div className="w-1/7 px-3 py-2">{item.module} - {item.action_type}</div>
                                            <div className="w-2/7 px-3 py-2 truncate"
                                                title={item.description}>{item.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


            {/*{isFilterOpen && (*/}
            {/*    <Modal*/}
            {/*        title="Filter Activity Logs"*/}
            {/*        onClose={closeFilterModal}*/}
            {/*        actionButton={{*/}
            {/*            label: "Apply",*/}
            {/*            onClick: handleApplyFilters,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div className="flex flex-col gap-6 w-[800px]">*/}
            {/*            /!* Date Range *!/*/}
            {/*            <div className="flex flex-col gap-2">*/}
            {/*                <label className="text-gray-700 font-semibold text-sm">*/}
            {/*                    Date Range*/}
            {/*                </label>*/}
            {/*                <div className="flex items-center gap-4">*/}
            {/*                    <div className="flex-1 flex flex-col gap-1">*/}
            {/*                        <span className="text-xs text-gray-500">From</span>*/}
            {/*                        <input*/}
            {/*                            type="date"*/}
            {/*                            className="w-full h-12 rounded-[15px] border border-gray-300 px-3 text-gray-700 focus:outline-none focus:border-red-500 bg-transparent"*/}
            {/*                            value={tempFilters.startDate || ""}*/}
            {/*                            onChange={(e) =>*/}
            {/*                                handleTempChange("startDate", e.target.value)*/}
            {/*                            }*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="flex-1 flex flex-col gap-1">*/}
            {/*                        <span className="text-xs text-gray-500">To</span>*/}
            {/*                        <input*/}
            {/*                            type="date"*/}
            {/*                            className="w-full h-12 rounded-[15px] border border-gray-300 px-3 text-gray-700 focus:outline-none focus:border-red-500 bg-transparent"*/}
            {/*                            value={tempFilters.endDate || ""}*/}
            {/*                            onChange={(e) =>*/}
            {/*                                handleTempChange("endDate", e.target.value)*/}
            {/*                            }*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* User Role *!/*/}
            {/*            <div className="flex flex-col gap-2">*/}
            {/*                <label className="text-gray-700 font-semibold text-sm">*/}
            {/*                    User Role*/}
            {/*                </label>*/}
            {/*                <div className="relative">*/}
            {/*                    <select*/}
            {/*                        className="w-full h-12 rounded-[15px] border border-gray-300 px-3 text-gray-700 bg-transparent focus:outline-none focus:border-red-500 appearance-none"*/}
            {/*                        value={tempFilters.userRole || ""}*/}
            {/*                        onChange={(e) =>*/}
            {/*                            handleTempChange("userRole", e.target.value)*/}
            {/*                        }*/}
            {/*                    >*/}
            {/*                        <option value="">All Roles</option>*/}
            {/*                        <option value="ADMIN">Admin</option>*/}
            {/*                        <option value="SALES01">Sales Agent 01</option>*/}
            {/*                        <option value="SALES02">Sales Agent 02</option>*/}
            {/*                        <option value="SALES03">Sales Agent 03</option>*/}
            {/*                        <option value="CALLAGENT">Call Agent</option>*/}
            {/*                        <option value="TELEMARKETER">Telemarketer</option>*/}
            {/*                    </select>*/}
            {/*                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">*/}
            {/*                        /!* Small Dropdown Arrow SVG *!/*/}
            {/*                        <svg*/}
            {/*                            className="fill-current h-4 w-4"*/}
            {/*                            xmlns="http://www.w3.org/2000/svg"*/}
            {/*                            viewBox="0 0 20 20"*/}
            {/*                        >*/}
            {/*                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />*/}
            {/*                        </svg>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Module Buttons *!/*/}
            {/*            <div className="flex flex-col gap-2">*/}
            {/*                <label className="text-gray-700 font-semibold text-sm">*/}
            {/*                    Module*/}
            {/*                </label>*/}
            {/*                <div className="grid grid-cols-2 gap-3">*/}
            {/*                    {[*/}
            {/*                        "VEHICLE",*/}
            {/*                        "SPARE_PARTS",*/}
            {/*                        "FAST_TRACK",*/}
            {/*                        "SERVICE_PARK",*/}
            {/*                        "USER_MGMT",*/}
            {/*                    ].map((mod) => (*/}
            {/*                        <button*/}
            {/*                            key={mod}*/}
            {/*                            type="button"*/}
            {/*                            onClick={() =>*/}
            {/*                                handleTempChange(*/}
            {/*                                    "module",*/}
            {/*                                    tempFilters.module === mod ? "" : mod*/}
            {/*                                )*/}
            {/*                            }*/}
            {/*                            className={`h-10 rounded-[15px] text-xs font-medium transition-all border ${*/}
            {/*                                tempFilters.module === mod*/}
            {/*                                    ? "bg-[#DB2727] text-white border-[#DB2727]"*/}
            {/*                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"*/}
            {/*                            }`}*/}
            {/*                        >*/}
            {/*                            {mod.replace("_", " ")}*/}
            {/*                        </button>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </div>*/}

            {/*            /!* Clear Button *!/*/}
            {/*            <div className="flex justify-end pt-2 border-t border-gray-200/50">*/}
            {/*                <button*/}
            {/*                    onClick={handleClearFilters}*/}
            {/*                    className="text-[#DB2727] hover:text-red-800 text-sm font-semibold underline decoration-1 underline-offset-2 transition"*/}
            {/*                >*/}
            {/*                    Clear All Filters*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal>*/}
            {/*)}*/}

            {isFilterOpen && (
                <Modal
                    title="Filter Activity Logs"
                    onClose={closeFilterModal}
                    actionButton={{
                        label: "Apply",
                        onClick: handleApplyFilters,
                    }}
                >
                    <div className="w-[800px] flex flex-col gap-8">

                        {/* Grid Container for Inputs */}
                        <div className="grid grid-cols-2 gap-8">

                            {/* --- Left Column: Date & Role --- */}
                            <div className="flex flex-col gap-6">
                                {/* Date Range */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-800 font-semibold text-sm ml-1">
                                        Date Range
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 mb-1 block ml-1">From</span>
                                            <input
                                                type="date"
                                                // UX Change: Added bg-gray-50, darker border, and hover effect
                                                className="w-full h-12 rounded-[15px] border border-gray-400 bg-gray-50 px-4 text-gray-800
                                             focus:outline-none focus:border-[#DB2727] focus:ring-2 focus:ring-[#DB2727]/10
                                             hover:border-gray-500 transition-all cursor-pointer"
                                                value={tempFilters.startDate || ""}
                                                onChange={(e) =>
                                                    handleTempChange("startDate", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500 mb-1 block ml-1">To</span>
                                            <input
                                                type="date"
                                                className="w-full h-12 rounded-[15px] border border-gray-400 bg-gray-50 px-4 text-gray-800
                                             focus:outline-none focus:border-[#DB2727] focus:ring-2 focus:ring-[#DB2727]/10
                                             hover:border-gray-500 transition-all cursor-pointer"
                                                value={tempFilters.endDate || ""}
                                                onChange={(e) =>
                                                    handleTempChange("endDate", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* User Role */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-800 font-semibold text-sm ml-1">
                                        User Role
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full h-12 rounded-[15px] border border-gray-400 bg-gray-50 px-4 text-gray-800
                                         focus:outline-none focus:border-[#DB2727] focus:ring-2 focus:ring-[#DB2727]/10
                                         hover:border-gray-500 appearance-none transition-all cursor-pointer"
                                            value={tempFilters.userRole || ""}
                                            onChange={(e) =>
                                                handleTempChange("userRole", e.target.value)
                                            }
                                        >
                                            <option value="">All Roles</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="SALES01">Sales Agent 01</option>
                                            <option value="SALES02">Sales Agent 02</option>
                                            <option value="SALES03">Sales Agent 03</option>
                                            <option value="CALLAGENT">Call Agent</option>
                                            <option value="TELEMARKETER">Telemarketer</option>
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 top-4 flex items-center px-4 text-gray-600 group-hover:text-gray-900 transition-colors">
                                            <svg
                                                className="fill-current h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-800 font-semibold text-sm ml-1">
                                    Module
                                </label>
                                <div className="grid grid-cols-2 gap-3 h-full content-start">
                                    {[
                                        "VEHICLE",
                                        "SPARE_PARTS",
                                        "FAST_TRACK",
                                        "SERVICE_PARK",
                                        "USER_MGMT",
                                    ].map((mod) => (
                                        <button
                                            key={mod}
                                            type="button"
                                            onClick={() =>
                                                handleTempChange(
                                                    "module",
                                                    tempFilters.module === mod ? "" : mod
                                                )
                                            }
                                            className={`h-12 rounded-[15px] text-xs font-bold uppercase tracking-wide transition-all border shadow-sm
                                ${tempFilters.module === mod
                                                    ? "bg-[#DB2727] text-white border-[#DB2727] shadow-red-200 ring-2 ring-offset-1 ring-[#DB2727]/30"
                                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800"
                                                }`}
                                        >
                                            {mod.replace("_", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Clear Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={handleClearFilters}
                                className="text-[#DB2727] hover:text-[#b91c1c] text-sm font-semibold hover:underline decoration-2 underline-offset-4 transition-colors flex items-center gap-2"
                            >
                                {/* Optional: Add a trash icon for visual cue */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                                    stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
