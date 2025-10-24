"use client";

import FlowBar, {SalesStatus} from "@/components/FlowBar";
import SalesDetailsTab from "@/components/SalesDetailsTab";
import Header from "@/components/Header";
import InfoRow from "@/components/SalesInfoRow";
import Modal from "@/components/Modal";
import React, {useState} from "react";
import {Role} from "@/types/role";

export default function SalesDetailsPage() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const [status, setStatus] = useState<SalesStatus>("New");

    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);

    const [activityText, setActivityText] = useState("");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");

    const handleAssignClick = () => {
        if (status === "New") setStatus("Ongoing");
    };

    const buttonText =
        status === "New" ? "Assign to me" : "Sales person: Robert Fox";

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title={
                        role === "admin"
                            ? "All Leads"
                            : role === "tele-marketer"
                                ? "Indra Fast Track Sales Dashboard"
                                : "Indra Traders Sales Dashboard"
                    }
                />

                <section
                    className="relative bg-[#FFFFFF4D] mb-5 bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-9 py-10 flex flex-col justify-center items-center">
                    {/* Header */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-wrap w-full gap-4 max-[1140px]:gap-2 items-center">
              <span className="font-semibold text-[22px] max-[1140px]:text-[18px]">
                ITPL122455874565
              </span>
                            <span
                                className="w-[67px] h-[26px] rounded-[22.98px] px-[17.23px] py-[5.74px] max-[1140px]:text-[12px] bg-[#DBDBDB] text-sm flex items-center justify-center">
                ITPL
              </span>
                            <div
                                className="w-[61px] h-[26px] rounded-[22.98px] bg-[#FFA7A7] flex items-center justify-center px-[10px] py-[5.74px]">
                                <select
                                    className="w-full h-full bg-transparent border-none text-sm max-[1140px]:text-[12px] cursor-pointer focus:outline-none"
                                    style={{textAlignLast: "center"}}
                                >
                                    <option value="P0">P0</option>
                                    <option value="P1">P1</option>
                                    <option value="P2">P2</option>
                                    <option value="P3">P3</option>
                                    <option value="P5">P5</option>
                                </select>
                            </div>
                        </div>
                        <FlowBar<SalesStatus>
                            variant="sales"
                            status={status}
                            onStatusChange={setStatus}
                        />
                    </div>

                    {/* Assign + Sales Level */}
                    {role === "user" ? (
                        <div className="w-full flex items-center gap-3 max-[1386px]:mt-5 mt-2 mb-8">
                            <button
                                onClick={handleAssignClick}
                                className={`h-[40px] rounded-[22.98px] px-5 font-light flex items-center justify-center text-sm ${
                                    status === "New"
                                        ? "bg-[#DB2727] text-white"
                                        : "bg-[#EBD4FF] text-[#1D1D1D]"
                                }`}
                                disabled={status !== "New"}
                            >
                                {buttonText}
                            </button>
                            {status !== "New" && (
                                <div
                                    className="h-[40px] rounded-[22.98px] bg-[#FFEDD8] flex items-center justify-center px-4">
                                    <select
                                        className="w-full h-full bg-transparent border-none text-sm cursor-pointer focus:outline-none"
                                        style={{textAlignLast: "center"}}
                                    >
                                        <option value="S0">Sales Level 1</option>
                                        <option value="S1">Sales Level 2</option>
                                        <option value="S2">Sales Level 3</option>
                                        <option value="S3">Sales Level 4</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full flex items-center gap-3 max-[1386px]:mt-5 mt-2 mb-8">
                            <span>Assign to:</span>
                            <div
                                className="h-[40px] rounded-[22.98px] bg-[#FFEDD8] flex items-center justify-center px-4">
                                <select
                                    className="w-full h-full bg-transparent border-none text-sm cursor-pointer focus:outline-none"
                                    style={{textAlignLast: "center"}}
                                >
                                    <option value="S0">Sales Level 1</option>
                                    <option value="S1">Sales Level 2</option>
                                    <option value="S2">Sales Level 3</option>
                                    <option value="S3">Sales Level 4</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="w-full flex">
                        <div className="w-2/5">
                            <div className="mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Customer Details
                            </div>
                            <InfoRow label="Customer Name:" value="Emily Charlotte"/>
                            <InfoRow label="Contact No:" value="077 5898712"/>
                            <InfoRow label="Email:" value="Info@indra.com"/>

                            <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                {role === "admin" ? "Spare Part Details" : "Vehicle Details"}
                            </div>
                            <InfoRow label="Vehicle Made:" value="Honda"/>
                            <InfoRow label="Vehicle Model:" value="Civic"/>
                            {role === "admin" ? (
                                <>
                                    <InfoRow label="Part No:" value="BF-DOT4"/>
                                    <InfoRow label="YOM:" value="2024"/>
                                    <InfoRow
                                        label="Additional Note:"
                                        value="hydraulic brake systems"
                                    />
                                </>
                            ) : role === "tele-marketer" ? (
                                <>
                                    <InfoRow label="Manufacture Year:" value="2019"/>
                                    <InfoRow label="Capacity:" value="2800cc"/>
                                    <InfoRow label="Transmission:" value="Auto"/>
                                    <InfoRow label="Fuel Type:" value="Petrol"/>
                                    <InfoRow label="Price Range:" value="6,000,000 - 8,000,000"/>
                                    <InfoRow label="Additional Note:" value="White color"/>
                                </>
                            ) : (
                                <>
                                    <InfoRow label="Manufacture Year:" value="2019"/>
                                    <InfoRow label="Transmission:" value="Auto"/>
                                    <InfoRow label="Fuel Type:" value="Petrol"/>
                                    <InfoRow label="Down Payment:" value="500,000LKR"/>
                                    <InfoRow label="Price Range:" value="6,000,000 - 8,000,000"/>
                                    <InfoRow label="Additional Note:" value="White color"/>
                                </>
                            )}
                        </div>

                        <div className="w-3/5 flex flex-col min-h-[400px]">
                            <SalesDetailsTab
                                status={status}
                                onOpenActivity={() => setActivityModalOpen(true)}
                                onOpenReminder={() => setReminderModalOpen(true)}
                            />
                            {role === "admin" ? null : (
                                <div className="mt-6 flex w-full justify-end">
                                    <button
                                        className="w-[121px] h-[41px] bg-[#DB2727] text-white rounded-[30px] flex justify-center items-center">
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Activity Modal */}
            {isActivityModalOpen && (
                <Modal
                    title="Add New Activity"
                    onClose={() => setActivityModalOpen(false)}
                    actionButton={{
                        label: "Save",
                        onClick: () => {
                            console.log("Activity saved:", activityText);
                            setActivityText("");
                            setActivityModalOpen(false);
                        },
                    }}
                >
                    <div className="w-full">
                        <label className="block mb-2 font-semibold">Activity</label>
                        <input
                            type="text"
                            value={activityText}
                            onChange={(e) => setActivityText(e.target.value)}
                            className="w-[600px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 mt-2"
                        />
                    </div>
                </Modal>
            )}

            {/* Reminder Modal */}
            {isReminderModalOpen && (
                <Modal
                    title="Add New Reminder"
                    onClose={() => setReminderModalOpen(false)}
                    actionButton={{
                        label: "Save",
                        onClick: () => {
                            console.log("Reminder saved:", {
                                reminderTitle,
                                reminderDate,
                                reminderNote,
                            });
                            setReminderTitle("");
                            setReminderDate("");
                            setReminderNote("");
                            setReminderModalOpen(false);
                        },
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Task Title</label>
                            <input
                                type="text"
                                value={reminderTitle}
                                onChange={(e) => setReminderTitle(e.target.value)}
                                className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Task Date</label>
                            <input
                                type="date"
                                value={reminderDate}
                                onChange={(e) => setReminderDate(e.target.value)}
                                className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Note</label>
                            <input
                                type="text"
                                value={reminderNote}
                                onChange={(e) => setReminderNote(e.target.value)}
                                className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}