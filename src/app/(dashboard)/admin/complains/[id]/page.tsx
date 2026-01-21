/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import FlowBar, { ComplainStatus } from "@/components/FlowBar";
import SalesDetailsTab from "@/components/SalesDetailsTab";
import Header from "@/components/Header";
import InfoRow from "@/components/SalesInfoRow";
import Modal from "@/components/Modal";
import React, { useState } from "react";
import { Role } from "@/types/role";
import { useComplaintById, useUpdateComplaint } from "@/hooks/useComplaint";
import { useParams } from "next/navigation";
import { useCreateFollowUp } from "@/hooks/useFollowUp";
import { useCreateReminder } from "@/hooks/useReminder";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { useCurrentUser } from "@/utils/auth";

export default function ComplainDetailsPage() {
    const { showToast, hideToast, toast } = useToast();

    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const user = useCurrentUser();

    const params = useParams();
    const id = Number(params?.id);

    const { data: complaint, isLoading } = useComplaintById(id);

    const updateComplaint = useUpdateComplaint();
    const createFollowUpMutation = useCreateFollowUp();
    const createReminderMutation = useCreateReminder();

    const [status, setStatus] = useState<ComplainStatus>("New");

    const [isActivityModalOpen, setActivityModalOpen] = useState(false);
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);

    const [activityText, setActivityText] = useState("");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");

    const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);
    const [adminNote, setAdminNote] = useState("");

    // Calculate progress based on status
    const getProgress = (status: ComplainStatus) => {
        switch (status) {
            case "New": return 0;
            case "In Review": return 25;
            case "Processing": return 50;
            case "Approval": return 75;
            case "Completed": return 100;
            default: return 0;
        }
    };

    const handleStatusChange = async (newStatus: ComplainStatus, note?: string) => {
        const progress = getProgress(newStatus);
        const payload: any = { status: newStatus, progress };

        if (note) payload.comment = note;

        try {
            await updateComplaint.mutateAsync({ id, data: payload });
            setStatus(newStatus);
            showToast("Complaint updated successfully", "success");
            if (newStatus === "Completed") setCompleteModalOpen(false);
        } catch (error: any) {
            console.error("Error updating complaint:", error);
            showToast(`Failed to update complaint: ${error.message}`, "error");
        }
    };

    const handleActivitySave = async () => {
        if (!activityText.trim()) return;
        try {
            await createFollowUpMutation.mutateAsync({
                activity: activityText,
                activity_date: new Date().toISOString().split('T')[0],
                complaintId: id,
            });
            setActivityText("");
            setActivityModalOpen(false);
        } catch (error: any) {
            console.error("Error creating follow-up:", error);
            alert(`Failed to save activity: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleReminderSave = async () => {
        if (!reminderTitle.trim() || !reminderDate) return;
        try {
            await createReminderMutation.mutateAsync({
                task_title: reminderTitle,
                task_date: reminderDate,
                note: reminderNote,
                complaintId: id,
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading complaint details...</p>
            </div>
        );
    }

    if (!complaint) {
        return <p className="text-center mt-10 text-gray-500">Complaint not found.</p>;
    }



    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name={user?.full_name || "Sophie Eleanor"}
                    title="All Complains"
                />

                <section
                    className="relative bg-[#FFFFFF4D] mb-5 bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-9 py-10 flex flex-col justify-center items-center">
                    {/* Header */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-wrap w-full gap-4 max-[1140px]:gap-2 items-center">
                            <span className="font-semibold text-[22px] max-[1140px]:text-[18px]">
                                Ticket No. {complaint.ticket_no}
                            </span>
                        </div>
                        <FlowBar<ComplainStatus>
                            variant="complains"
                            status={complaint.status as ComplainStatus}
                            onStatusChange={(newStatus) => {
                                const COMPLAIN_STEPS = ["New", "In Review", "Processing", "Approval", "Completed"];
                                const currentIndex = COMPLAIN_STEPS.indexOf(complaint.status as string);
                                const newIndex = COMPLAIN_STEPS.indexOf(newStatus);

                                if (newIndex <= currentIndex) {
                                    return;
                                }

                                if (newStatus === "Completed") {
                                    setCompleteModalOpen(true);
                                } else {
                                    handleStatusChange(newStatus);
                                }
                            }}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="w-full flex mt-10">
                        <div className="w-2/5">
                            <div className="mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Customer Details
                            </div>
                            <InfoRow label="Customer Name:" value={complaint?.customer.customer_name || 'N/A'} />
                            <InfoRow label="Contact No:" value={complaint.contact_no || 'N/A'} />
                            <InfoRow label="Email:" value={complaint?.customer?.email || 'N/A'} />

                            <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                                Ticket Details
                            </div>
                            <InfoRow label="Category:" value={complaint.category || 'N/A'} />
                            <InfoRow label="Vehicle No." value={complaint.vehicle_no || 'N/A'} />
                            <InfoRow label="Title:" value={complaint.title || 'N/A'} />
                            <InfoRow label="Transmission:" value="Auto" />
                            <InfoRow label="Preferred Solution:" value={complaint.preferred_solution || 'N/A'} />
                            <InfoRow
                                label="Description:"
                                value={complaint.description || 'N/A'}
                            />
                        </div>

                        <div className="w-3/5 flex flex-col min-h-[400px]">
                            <SalesDetailsTab
                                // complaintId={complaint.id}
                                customerId={complaint.customerId}
                                status={status}
                                onOpenActivity={() => setActivityModalOpen(true)}
                                onOpenReminder={() => setReminderModalOpen(true)}
                                followups={complaint?.followups || []}
                                reminders={complaint?.reminders || []}
                            />
                            <div className="mt-6 flex w-full justify-end">
                                <button
                                    className="w-[121px] h-[41px] bg-[#DB2727] text-white rounded-[30px] flex justify-center items-center">
                                    Save
                                </button>
                            </div>
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
                        onClick: handleActivitySave,
                        // disabled: createFollowUpMutation.isPending,
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
            {/* Complete Complaint Modal */}
            {isCompleteModalOpen && (
                <Modal
                    title={`Ticket No. ${complaint.ticket_no}`}
                    onClose={() => setCompleteModalOpen(false)}
                    actionButton={{
                        label: "Submit",
                        onClick: () => {
                            if (!adminNote.trim()) {
                                showToast("Please enter a comment to close the complaint.", "error");
                                return;
                            }
                            handleStatusChange("Completed", adminNote);
                        },
                    }}
                >
                    <div className="w-[800px]">
                        <p className="mb-4 text-[18px] font-medium text-[#1D1D1D]">Give a comment for close the complain.</p>
                        <label className="block mb-2 text-[17px] text-[#1D1D1D] font-medium">Comment</label>
                        <textarea
                            rows={4}
                            placeholder="Type your Comment Here"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            className="w-full text-[14px] text-[#575757] rounded-[20px] bg-[#FFFFFF80] p-4 focus:outline-none resize-none"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}
