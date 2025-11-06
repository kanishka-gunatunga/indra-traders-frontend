/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import FlowBar, {SalesStatus} from "@/components/FlowBar";
import SalesDetailsTab from "@/components/SalesDetailsTab";
import Header from "@/components/Header";
import InfoRow from "@/components/SalesInfoRow";
import Modal from "@/components/Modal";
import React, {useEffect, useState} from "react";
import {Role} from "@/types/role";
import {useParams} from "next/navigation";
import {
    useAssignToMe,
    useCreateFollowup,
    useSpareSaleByTicket,
    useCreateReminder,
    useUpdateSaleStatus, useUpdatePriority
} from "@/hooks/useSparePartSales";
import {message} from "antd";


const mapApiStatusToSalesStatus = (apiStatus: string): SalesStatus => {
    switch (apiStatus) {
        case "NEW":
            return "New";
        case "ONGOING":
            return "Ongoing";
        case "WON":
            return "Won";
        case "LOST":
            return "Lost";
        default:
            return "New";
    }
};


export default function SalesDetailsPage() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const params = useParams();
    const ticketNumber = params?.id as string;
    const userId = 1;

    const {data: sale, isLoading, error} = useSpareSaleByTicket(ticketNumber);
    const assignToMeMutation = useAssignToMe();
    const createFollowupMutation = useCreateFollowup();
    const createReminderMutation = useCreateReminder();
    const updateSaleStatusMutation = useUpdateSaleStatus();
    const updatePriorityMutation = useUpdatePriority();


    const [status, setStatus] = useState<SalesStatus>("New");

    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);

    const [activityText, setActivityText] = useState("");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");

    // const handleAssignClick = () => {
    //     if (status === "New") setStatus("Ongoing");
    // };

    useEffect(() => {
        if (sale) {
            setStatus(mapApiStatusToSalesStatus(sale.status));
        }
    }, [sale]);

    const handleAssignClick = () => {
        if (sale && sale.id && status === "New") {
            assignToMeMutation.mutate(
                {
                    id: sale.id, userId
                },
                {
                    onSuccess: () => {
                        setStatus("Ongoing");
                        message.success("Sale assigned to you");
                    },
                    onError: (err) => {
                        console.error("Assign spare sale error: ", err);
                        message.error("Failed to assign sale.");
                    }
                }
            )
        }
    }

    const handleSaveActivity = () => {
        if (sale && sale.id && activityText) {
            createFollowupMutation.mutate(
                {
                    activity: activityText,
                    activity_date: new Date().toISOString(),
                    spare_part_sale_id: sale.id,
                },
                {
                    onSuccess: () => {
                        message.success("Activity Saved!");
                        setActivityText("");
                        setActivityModalOpen(false);
                    },
                    onError: (err) => {
                        console.error("Failed to save spare sale followup error: ", err);
                        message.error("Failed to save follow up.")
                    }
                }
            )
        } else {
            message.error("Please fill all required fields.");
        }
    };

    const handleSaveReminder = () => {
        if (sale && sale.id && reminderTitle && reminderDate) {
            console.log(reminderTitle, "", reminderDate, "", sale.id, "", reminderNote);
            createReminderMutation.mutate(
                {
                    task_title: reminderTitle,
                    task_date: new Date(reminderDate).toISOString(),
                    note: reminderNote || null,
                    spare_part_sale_id: sale.id,
                },
                {
                    onSuccess: () => {
                        message.success("Reminder Saved!");
                        setReminderTitle("");
                        setReminderNote("");
                        setReminderDate("");
                        setReminderModalOpen(false);
                    },
                    onError: (err) => {
                        console.error("Reminder error: ", err);
                        message.error("Failed to save reminder.");
                    },
                }
            );
        } else {
            message.error("Please fill all required fields.");
        }
    }

    const handlePriorityChange = (newPriority: number) => {
        if (!sale?.id) return;

        updatePriorityMutation.mutate(
            { id: sale.id, priority: newPriority },
            {
                onSuccess: () => {
                    message.success("Priority updated");
                },
                onError: () => {
                    message.error("Failed to update priority");
                }
            }
        );
    };

    const buttonText =
        status === "New" ? "Assign to me" : `Sales person: ${sale.salesUser?.full_name || "Unknown"}`;

    if (isLoading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error || !sale) {
        return (
            <div className="text-center mt-10 text-red-600">
                Error: {error?.message || "Sale not found!"}
            </div>
        )
    }

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title="Indra Motor Spare Sales Dashboard"
                />

                <section
                    className="relative bg-[#FFFFFF4D] mb-5 bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-9 py-10 flex flex-col justify-center items-center">
                    {/* Header */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-wrap w-full gap-4 max-[1140px]:gap-2 items-center">
              <span className="font-semibold text-[22px] max-[1140px]:text-[18px]">
                {sale.ticket_number}
              </span>
                            <span
                                className="w-[67px] h-[26px] rounded-[22.98px] px-[17.23px] py-[5.74px] max-[1140px]:text-[12px] bg-[#DBDBDB] text-sm flex items-center justify-center">
                IMS
              </span>
                            <div
                                className="w-[61px] h-[26px] rounded-[22.98px] bg-[#FFA7A7] flex items-center justify-center px-[10px] py-[5.74px]">
                                <select
                                    value={sale.priority}
                                    onChange={(e) => handlePriorityChange(Number(e.target.value))}
                                    className="w-full h-full bg-transparent border-none text-sm max-[1140px]:text-[12px] cursor-pointer focus:outline-none"
                                    style={{textAlignLast: "center"}}
                                >
                                    <option value={0}>P0</option>
                                    <option value={1}>P1</option>
                                    <option value={2}>P2</option>
                                    <option value={3}>P3</option>
                                    <option value={4}>P4</option>
                                </select>
                            </div>
                        </div>
                        <FlowBar<SalesStatus>
                            variant="sales"
                            status={status}
                            onStatusChange={(newStatus) => {
                                setStatus(newStatus);

                                if (sale?.id && (newStatus.toUpperCase() === "WON" || newStatus.toUpperCase() === "LOST")) {

                                    updateSaleStatusMutation.mutate(
                                        {id: sale.id, status: newStatus.toUpperCase() as "WON" | "LOST"},
                                        {
                                            onSuccess: () => {
                                                message.success(`Status updated to ${newStatus}`);
                                            },
                                            onError: (err) => {
                                                console.error("Failed to update status:", err);
                                                message.error("Failed to update status.");
                                            },
                                        }
                                    );
                                }
                            }}
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
                                disabled={status !== "New" || assignToMeMutation.isPending}
                            >
                                {assignToMeMutation.isPending ? "Assigning..." : buttonText}
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
                                    onChange={(e) => {
                                        console.log("Assign to sales user:", e.target.value);
                                    }}
                                >
                                    <option value="S0">Sales Level 1</option>
                                    <option value="S1">Sales Level 2</option>
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
                            <InfoRow label="Customer Name:" value={sale.customer?.customer_name || "N/A"}/>
                            <InfoRow label="Contact No:"
                                     value={sale.customer?.phone_number || sale.customer?.whatsapp_number || "N/A"}/>
                            <InfoRow label="Email:" value={sale.customer?.email || "N/A"}/>

                            <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Spare Part Details
                            </div>
                            <InfoRow label="Vehicle Make:" value={sale.vehicle_make || "N/A"}/>
                            <InfoRow label="Vehicle Model:" value={sale.vehicle_model || "N/A"}/>
                            <InfoRow label="Part No:" value={sale.part_no || "N/A"}/>
                            <InfoRow
                                label="YOM:"
                                value={sale.year_of_manufacture?.toString() || "N/A"}
                            />
                            <InfoRow
                                label="Additional Note:"
                                value={sale.additional_note || "N/A"}
                            />
                        </div>

                        <div className="w-3/5 flex flex-col min-h-[400px]">
                            <SalesDetailsTab
                                customerId={sale.customer_id}
                                status={status}
                                onOpenActivity={() => setActivityModalOpen(true)}
                                onOpenReminder={() => setReminderModalOpen(true)}
                                followups={sale.followups || []}
                                reminders={sale.reminders || []}
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
                    onClose={() => {
                        setActivityText("");
                        // setActivityDate("");
                        setActivityModalOpen(false);
                    }}
                    actionButton={{
                        label: "Save",
                        onClick: handleSaveActivity,
                        // disabled: createFollowupMutation.isPending,
                    }}
                >
                    <div className="w-full">
                        <label className="block mb-2 font-semibold">Activity</label>
                        <input
                            type="text"
                            value={activityText}
                            onChange={(e) => setActivityText(e.target.value)}
                            placeholder="Enter activity description"
                            className="w-[600px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 mt-2"
                        />
                    </div>
                </Modal>
            )}

            {/* Reminder Modal */}
            {isReminderModalOpen && (
                <Modal
                    title="Add New Reminder"
                    onClose={() => {
                        setReminderTitle("");
                        setReminderDate("");
                        setReminderNote("");
                        setReminderModalOpen(false);
                    }}
                    actionButton={{
                        label: "Save",
                        onClick: handleSaveReminder,
                        // disabled: createReminderMutation.isPending,
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Task Title</label>
                            <input
                                type="text"
                                placeholder="Enter task title"
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
                                placeholder="Enter note (optional)"
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