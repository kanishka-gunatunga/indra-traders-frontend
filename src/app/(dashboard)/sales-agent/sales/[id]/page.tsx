/* eslint-disable @typescript-eslint/no-explicit-any */
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
    useAssignVehicleSale,
    useCreateFollowup,
    useUpdateSaleStatus,
    useVehicleSaleByTicket,
    useUpdatePriority,
    useCreateReminder, useSaleHistory, usePromoteSale
} from "@/hooks/useVehicleSales";
// import {useCreateReminder} from "@/hooks/useReminder";
import {message} from "antd";
import {useCurrentUser} from "@/utils/auth";
import Image from "next/image";
import HistoryTimeline from "@/components/HistoryTimeline";

export default function SalesDetailsPage() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const params = useParams();
    const ticketNumber = params?.id as string;

    const user = useCurrentUser();
    const userId = Number(user?.id) || 2;

    console.log(ticketNumber);

    const {data: sale, isLoading, error} = useVehicleSaleByTicket(ticketNumber);
    const assignMutation = useAssignVehicleSale();
    const updateStatusMutation = useUpdateSaleStatus();
    const createFollowupMutation = useCreateFollowup();
    const createReminderMutation = useCreateReminder();

    const {data: history} = useSaleHistory(sale?.id);
    const promoteMutation = usePromoteSale();

    const updatePriorityMutation = useUpdatePriority();

    const [status, setStatus] = useState<SalesStatus>("New");

    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);

    const [activityText, setActivityText] = useState("");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");

    // Sync status from fetched sale
    useEffect(() => {
        if (sale) {
            const displayStatus: SalesStatus = sale.status === "NEW" ? "New" : sale.status === "ONGOING" ? "Ongoing" : sale.status === "WON" ? "Won" : "Lost"; // Adjust for Won/Lost if needed
            setStatus(displayStatus);
        }
    }, [sale]);

    const handleAssignClick = async () => {
        if (!sale || status !== "New") return;
        try {
            await assignMutation.mutateAsync({id: sale.id, salesUserId: userId});
            setStatus("Ongoing");
        } catch (error: any) {
            console.error("Error assigning sale:", error);
            alert(`Failed to assign: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleStatusChange = async (newStatus: SalesStatus) => {
        if (!sale) return;
        let backendStatus = newStatus === "New" ? "NEW" : newStatus === "Ongoing" ? "ONGOING" : "COMPLETED";
        if (newStatus === "Won" || newStatus === "Lost") {
            backendStatus = "COMPLETED";
        }
        try {
            await updateStatusMutation.mutateAsync({id: sale.id, status: backendStatus});
            setStatus(newStatus);
        } catch (error: any) {
            console.error("Error updating status:", error);
            alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleActivitySave = async () => {
        if (!activityText.trim() || !sale) return;
        try {
            await createFollowupMutation.mutateAsync({
                activity: activityText,
                activity_date: new Date().toISOString().split('T')[0],
                vehicleSaleId: sale.id,
                userId: userId
            });
            setActivityText("");
            setActivityModalOpen(false);
        } catch (error: any) {
            console.error("Error creating followup:", error);
            alert(`Failed to save activity: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleReminderSave = async () => {
        if (!reminderTitle.trim() || !reminderDate || !sale) return;
        try {
            await createReminderMutation.mutateAsync({
                task_title: reminderTitle,
                task_date: reminderDate,
                note: reminderNote,
                vehicleSaleId: sale.id,
                userId: userId
            });
            setReminderTitle("");
            setReminderDate("");
            setReminderNote("");
            setReminderModalOpen(false);
        } catch (error: any) {
            console.error("Error creating reminder:", error);
            alert(`Failed to save reminder: ${error.response?.data?.message || error.message}`);
        }
    };

    const handlePriorityChange = (newPriority: number) => {
        if (!sale?.id) return;

        updatePriorityMutation.mutate(
            {id: sale.id, priority: newPriority},
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading sale details...</p>
            </div>
        );
    }

    if (error || !sale) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Sale not found or error loading details.</p>
            </div>
        );
    }

    const buttonText =
        status === "New" ? "Assign to me" : `Sales person: ${sale.salesUser?.full_name || "Unknown"}`;

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
                    title="Indra Traders Sales Dashboard"
                />

                <section
                    className="relative bg-[#FFFFFF4D] mb-5 bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-9 py-10 flex flex-col justify-center items-center">
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
                                    value={sale.priority}
                                    onChange={(e) => handlePriorityChange(Number(e.target.value))}
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
                            onStatusChange={handleStatusChange}
                        />
                    </div>

                    <div className="w-full flex items-center gap-3 max-[1386px]:mt-5 mt-2 mb-8">
                        <button
                            onClick={handleAssignClick}
                            className={`h-[40px] rounded-[22.98px] px-5 font-light flex items-center justify-center text-sm ${
                                status === "New"
                                    ? "bg-[#DB2727] text-white"
                                    : "bg-[#EBD4FF] text-[#1D1D1D]"
                            }`}
                            disabled={status !== "New" || assignMutation.isPending}
                        >
                            {assignMutation.isPending ? "Assigning..." : buttonText}
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
                            <InfoRow label="Customer Name:" value={sale.customer?.customer_name || "N/A"}/>
                            <InfoRow label="Contact No:" value={sale.customer?.phone_number || "N/A"}/>
                            <InfoRow label="Email:" value={sale.customer?.email || "N/A"}/>

                            <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Vehicle Details
                            </div>
                            <InfoRow label="Vehicle Made:" value={sale.vehicle_make || "N/A"}/>
                            <InfoRow label="Vehicle Model:" value={sale.vehicle_model || "N/A"}/>
                            {/*{role === "admin" ? (*/}
                            {/*    <>*/}
                            {/*        <InfoRow label="Part No:" value="BF-DOT4"/>*/}
                            {/*        <InfoRow label="YOM:" value="2024"/>*/}
                            {/*        <InfoRow*/}
                            {/*            label="Additional Note:"*/}
                            {/*            value="hydraulic brake systems"*/}
                            {/*        />*/}
                            {/*    </>*/}
                            {/*) : role === "tele-marketer" ? (*/}
                            {/*    <>*/}
                            {/*        <InfoRow label="Manufacture Year:" value="2019"/>*/}
                            {/*        <InfoRow label="Capacity:" value="2800cc"/>*/}
                            {/*        <InfoRow label="Transmission:" value="Auto"/>*/}
                            {/*        <InfoRow label="Fuel Type:" value="Petrol"/>*/}
                            {/*        <InfoRow label="Price Range:" value="6,000,000 - 8,000,000"/>*/}
                            {/*        <InfoRow label="Additional Note:" value="White color"/>*/}
                            {/*    </>*/}
                            {/*) : (*/}
                            <InfoRow label="Manufacture Year:" value={sale.manufacture_year || "N/A"}/>
                            <InfoRow label="Transmission:" value={sale.transmission || "N/A"}/>
                            <InfoRow label="Fuel Type:" value={sale.fuel_type || "N/A"}/>
                            <InfoRow label="Down Payment:" value={`${sale.down_payment || 0}LKR`}/>
                            <InfoRow label="Price Range:"
                                     value={`${sale.price_from || 0} - ${sale.price_to || 0}`}/>
                            <InfoRow label="Additional Note:" value={sale.additional_note || "N/A"}/>
                            {/*)}*/}
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
                        label: createFollowupMutation.isPending ? "Saving..." : "Save",
                        onClick: handleActivitySave,
                        // disabled: createFollowupMutation.isPending,
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
                        label: createReminderMutation.isPending ? "Saving..." : "Save",
                        onClick: handleReminderSave,
                        // disabled: createReminderMutation.isPending,
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
