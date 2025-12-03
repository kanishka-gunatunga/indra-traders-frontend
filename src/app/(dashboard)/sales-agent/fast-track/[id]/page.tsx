/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import FlowBar, {SalesStatus} from "@/components/FlowBar";
import SalesDetailsTab from "@/components/SalesDetailsTab";
import Header from "@/components/Header";
import InfoRow from "@/components/SalesInfoRow";
import Modal from "@/components/Modal";
import React, {useEffect, useState} from "react";
import {Role} from "@/types/role";
import {message} from "antd";
import {
    useClaimSaleLead,
    useCreateSaleFollowup,
    useCreateSaleReminder,
    useSaleByTicket, useUpdateSalePriority,
    useUpdateSaleStatus, useSaleHistory, usePromoteSale
} from "@/hooks/useFastTrack";
import {useParams} from "next/navigation";
import {useCurrentUser} from "@/utils/auth";
import Image from "next/image";
import HistoryTimeline from "@/components/HistoryTimeline";

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
    const user = useCurrentUser();
    const userId = Number(user?.id) || 1;

    const {data: sale, isLoading, error} = useSaleByTicket(ticketNumber);
    const assignToMeMutation = useClaimSaleLead();
    const createFollowupMutation = useCreateSaleFollowup();
    const createReminderMutation = useCreateSaleReminder();
    const updateSaleStatusMutation = useUpdateSaleStatus();
    const updateSalePriorityMutation = useUpdateSalePriority();

    const {data: history} = useSaleHistory(sale?.id);
    const promoteMutation = usePromoteSale();

    const [status, setStatus] = useState<SalesStatus>("New");
    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);
    const [activityText, setActivityText] = useState("");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

    useEffect(() => {
        if (sale) {
            setStatus(mapApiStatusToSalesStatus(sale.status));
        }
    }, [sale]);

    const handleAssignClick = () => {
        if (sale && sale.id && status === "New") {
            assignToMeMutation.mutate({saleId: sale.id, userId}, {
                onSuccess: () => {
                    setStatus("Ongoing");
                    message.success("Sale assigned to you");
                },
                onError: (err) => {
                    console.error("Assign sale error:", err);
                    message.error("Failed to assign sale.");
                },
            });
        }
    };

    const handleSaveActivity = () => {
        if (sale && sale.id && activityText) {
            createFollowupMutation.mutate(
                {
                    sale_id: sale.id,
                    activity: activityText,
                    activity_date: new Date().toISOString(),
                },
                {
                    onSuccess: () => {
                        message.success("Activity Saved!");
                        setActivityText("");
                        setActivityModalOpen(false);
                    },
                    onError: (err) => {
                        console.error("Failed to save followup:", err);
                        message.error("Failed to save follow-up.");
                    },
                }
            );
        } else {
            message.error("Please fill all required fields.");
        }
    };

    const handleSaveReminder = () => {
        if (sale && sale.id && reminderTitle && reminderDate) {
            createReminderMutation.mutate(
                {
                    task_title: reminderTitle,
                    task_date: new Date(reminderDate).toISOString(),
                    note: reminderNote || undefined,
                    sale_id: sale.id,
                },
                {
                    onSuccess: () => {
                        message.success("Reminder Saved!");
                        setReminderTitle("");
                        setReminderDate("");
                        setReminderNote("");
                        setReminderModalOpen(false);
                    },
                    onError: (err) => {
                        console.error("Reminder error:", err);
                        message.error("Failed to save reminder.");
                    },
                }
            );
        } else {
            message.error("Please fill all required fields.");
        }
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const priority = parseInt(value);
        if (sale && sale.id && !isNaN(priority)) {
            updateSalePriorityMutation.mutate(
                {saleId: sale.id, priority},
                {
                    onSuccess: () => {
                        message.success(`Priority updated to ${value}`);
                    },
                    onError: (err) => {
                        console.error("Failed to update priority:", err);
                        message.error("Failed to update priority.");
                    },
                }
            );
        }
    };


    const userRole = user?.user_role || "SALES01";
    const isLevel1 = userRole === "SALES01";
    const isLevel2 = userRole === "SALES02";

    const showHistoryButton = !isLevel1;

    const canPromote =
        (isLevel1 && sale?.current_level === 1 && status === "Ongoing") ||
        (isLevel2 && sale?.current_level === 2 && status === "Ongoing");

    const getPromoteLabel = () => {
        if (isLevel1) return "Escalate to Sales Lv 2";
        if (isLevel2) return "Escalate to Sales Lv 3";
        return "Escalate";
    };

    const handlePromote = async () => {
        if (!confirm("Are you sure you want to pass this lead to the next sales level? You will lose access.")) return;

        try {
            await promoteMutation.mutateAsync({id: sale.id, userId: Number(userId)});
            alert("Lead promoted successfully!");
            window.location.href = "/sales-agent/sales";
        } catch (e) {
            console.error(e);
            alert("Failed to promote lead.");
        }
    };


    const buttonText =
        status === "New" ? "Assign to me" : `Sales person: ${sale?.salesUser?.full_name || "Unknown"}`;

    if (isLoading) {
        return <div className="text-center mt-10"><p>Loading sale details...</p></div>;
    }

    if (error || !sale) {
        return (
            <div className="text-center mt-10 text-red-600">
                Error: {error?.message || "Sale not found!"}
            </div>
        );
    }

    const source = sale?.lead_source?.toLowerCase();

    let imageSrc = "";

    switch (source) {
        case "call agent":
            imageSrc = "/call.svg";
            break;
        case "website":
            imageSrc = "/icons/website.png";
            break;
        case "whatsapp":
            imageSrc = "/icons/whatsapp.png";
            break;
        case "facebook":
            imageSrc = "/icons/facebook.png";
            break;
        default:
            imageSrc = "/call.svg";
    }

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name={user?.full_name || "Sophie Eleanor"}
                    location={user?.branch || "Bambalapitiya"}
                    title="Indra Fast Track Sales Dashboard"
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
                                    <Image src={imageSrc} alt={source ?? "source icon"} width={20} height={20}/>
                            </span>
                            <span
                                className="w-[67px] h-[26px] rounded-[22.98px] px-[17.23px] py-[5.74px] max-[1140px]:text-[12px] bg-[#DBDBDB] text-sm flex items-center justify-center">
                ITPL
              </span>
                            <div
                                className="w-[61px] h-[26px] rounded-[22.98px] bg-[#FFA7A7] flex items-center justify-center px-[10px] py-[5.74px]">
                                <select
                                    onChange={handlePriorityChange}
                                    className="w-full h-full bg-transparent border-none text-sm max-[1140px]:text-[12px] cursor-pointer focus:outline-none"
                                    style={{textAlignLast: "center"}}
                                >
                                    <option value={0}>P0</option>
                                    <option value={1}>P1</option>
                                    <option value={2}>P2</option>
                                    <option value={3}>P3</option>
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
                                        {saleId: sale.id, status: newStatus.toUpperCase()},
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
                    {/*{role === "user" ? (*/}
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

                        {canPromote && (
                            <button
                                onClick={handlePromote}
                                className="h-[40px] rounded-[22.98px] px-5 font-medium text-sm bg-[#DB2727] text-white hover:bg-red-500 transition shadow-md flex items-center gap-2"
                                disabled={promoteMutation.isPending}
                            >
                                {promoteMutation.isPending ? "Processing..." : getPromoteLabel()}
                                {/*<Image src="/icons/arrow-right.svg" width={16} height={16} alt="arrow"/>*/}
                            </button>
                        )}

                        {/*{status !== "New" && (*/}
                        {/*    <div*/}
                        {/*        className="h-[40px] rounded-[22.98px] bg-[#FFEDD8] flex items-center justify-center px-4">*/}
                        {/*        <select*/}
                        {/*            className="w-full h-full bg-transparent border-none text-sm cursor-pointer focus:outline-none"*/}
                        {/*            style={{textAlignLast: "center"}}*/}
                        {/*        >*/}
                        {/*            <option value="S0">Sales Level 1</option>*/}
                        {/*            <option value="S1">Sales Level 2</option>*/}
                        {/*            <option value="S2">Sales Level 3</option>*/}
                        {/*            <option value="S3">Sales Level 4</option>*/}
                        {/*        </select>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/*<div*/}
                        {/*    className="h-[40px] px-6 rounded-[22.98px] bg-[#FFEDD8] border border-orange-200 flex items-center justify-center font-semibold text-[#8a5b28]">*/}
                        {/*    Current Level: Sales {sale?.current_level || 1}*/}
                        {/*</div>*/}

                        {showHistoryButton && (
                            <button
                                onClick={() => setHistoryModalOpen(true)}
                                className="ml-auto h-[40px] px-5 rounded-[22.98px] border border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                {/*<Image src="/dashboard/time.svg" width={20} height={20} alt="history" />*/}
                                View History
                            </button>
                        )}
                    </div>
                    {/*) : (*/}
                    {/*    <div className="w-full flex items-center gap-3 max-[1386px]:mt-5 mt-2 mb-8">*/}
                    {/*        <span>Assign to:</span>*/}
                    {/*        <div*/}
                    {/*            className="h-[40px] rounded-[22.98px] bg-[#FFEDD8] flex items-center justify-center px-4">*/}
                    {/*            <select*/}
                    {/*                className="w-full h-full bg-transparent border-none text-sm cursor-pointer focus:outline-none"*/}
                    {/*                style={{textAlignLast: "center"}}*/}
                    {/*            >*/}
                    {/*                <option value="S0">Sales Level 1</option>*/}
                    {/*                <option value="S1">Sales Level 2</option>*/}
                    {/*                <option value="S2">Sales Level 3</option>*/}
                    {/*                <option value="S3">Sales Level 4</option>*/}
                    {/*            </select>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/* Tabs */}
                    <div className="w-full flex">
                        <div className="w-2/5">
                            <div className="mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Customer Details
                            </div>
                            <InfoRow label="Customer Name:" value={sale.customer?.customer_name || "Unknown"}/>
                            <InfoRow label="Contact No:" value={sale.customer?.phone_number || "N/A"}/>
                            <InfoRow label="Email:" value={sale.customer?.email || "N/A"}/>

                            <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Vehicle Details
                            </div>
                            <InfoRow label="Vehicle Made:" value={sale.vehicle?.make || "Honda"}/>
                            <InfoRow label="Vehicle Model:" value={sale.vehicle?.model || "Civic"}/>
                            <InfoRow label="Manufacture Year:" value={sale.vehicle?.manufacture_year || "2019"}/>
                            <InfoRow label="Capacity:" value={sale.vehicle?.capacity || "2800cc"}/>
                            <InfoRow label="Transmission:" value={sale.vehicle?.transmission || "Auto"}/>
                            <InfoRow label="Fuel Type:" value={sale.vehicle?.fuel_type || "Petrol"}/>
                            <InfoRow label="Price Range:"
                                     value={(sale.price_range_min && sale.price_range_max) ? `${sale.price_range_min.toLocaleString()} - ${sale.price_range_max.toLocaleString()}` : "N/A"}/>
                            <InfoRow label="Additional Note:" value={sale.additional_note || "-"}/>
                        </div>

                        <div className="w-3/5 flex flex-col min-h-[400px]">
                            <SalesDetailsTab
                                customerId={sale.customer_id?.toString() || "1"}
                                reminders={sale.saleReminders || []}
                                followups={sale.followups || []}
                                status={status}
                                onOpenActivity={() => setActivityModalOpen(true)}
                                onOpenReminder={() => setReminderModalOpen(true)}
                            />
                            {/*{role === "admin" ? null : (*/}
                            <div className="mt-6 flex w-full justify-end">
                                <button
                                    className="w-[121px] h-[41px] bg-[#DB2727] text-white rounded-[30px] flex justify-center items-center">
                                    Save
                                </button>
                            </div>
                            {/*)}*/}
                        </div>
                    </div>
                </section>
            </main>

            {isHistoryModalOpen && (
                <Modal
                    title="Lead History Journey"
                    onClose={() => setHistoryModalOpen(false)}
                    isPriorityAvailable={false}
                >
                    <div className="w-full px-4 pb-4">
                        <HistoryTimeline history={history}/>
                    </div>
                </Modal>
            )}

            {/* Activity Modal */}
            {isActivityModalOpen && (
                <Modal
                    title="Add New Activity"
                    onClose={() => setActivityModalOpen(false)}
                    actionButton={{
                        label: "Save",
                        onClick: handleSaveActivity,
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
                        onClick: handleSaveReminder,
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