"use client";

import FlowBar, { ComplainStatus } from "@/components/FlowBar";
import SalesDetailsTab from "@/components/SalesDetailsTab";
import Header from "@/components/Header";
import InfoRow from "@/components/SalesInfoRow";
import Modal from "@/components/Modal";
import React, { useState } from "react";

type Role = "user" | "admin";

export default function ComplainDetailsPage() {
  const [role, setRole] = useState<Role>("admin");

  const [status, setStatus] = useState<ComplainStatus>("New");

  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);

  const [activityText, setActivityText] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderNote, setReminderNote] = useState("");

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="All Complains"
        />

        <section className="relative bg-[#FFFFFF4D] mb-5 bg-opacity-30 rounded-[45px] border border-[#E0E0E0] px-9 py-10 flex flex-col justify-center items-center">
          {/* Header */}
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-wrap w-full gap-4 max-[1140px]:gap-2 items-center">
              <span className="font-semibold text-[22px] max-[1140px]:text-[18px]">
                Ticket No. T25458756
              </span>
            </div>
            <FlowBar<ComplainStatus>
              variant="complains"
              status={status}
              onStatusChange={setStatus}
            />
          </div>

          {/* Tabs */}
          <div className="w-full flex mt-10">
            <div className="w-2/5">
              <div className="mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                Customer Details
              </div>
              <InfoRow label="Customer Name:" value="Emily Charlotte" />
              <InfoRow label="Contact No:" value="077 5898712" />
              <InfoRow label="Email:" value="Info@indra.com" />

              <div className="mt-8 mb-6 font-semibold text-[20px] max-[1140px]:text-[18px]">
                Ticket Details
              </div>
              <InfoRow label="Category:" value="ITPL" />
              <InfoRow label="Vehicle No." value="CAB - 1547" />
              <InfoRow label="Title:" value="Billing Issue" />
              <InfoRow label="Transmission:" value="Auto" />
              <InfoRow label="Preferred Solution:" value="Replacement" />
              <InfoRow
                label="Description:"
                value="Customer's vehicle service, scheduled for March 25, is delayed with no updates. Requests urgent status and completion time."
              />
            </div>

            <div className="w-3/5 flex flex-col min-h-[400px]">
              <SalesDetailsTab
                status={status}
                onOpenActivity={() => setActivityModalOpen(true)}
                onOpenReminder={() => setReminderModalOpen(true)}
              />
              {role === "admin" ? null : (
                <div className="mt-6 flex w-full justify-end">
                  <button className="w-[121px] h-[41px] bg-[#DB2727] text-white rounded-[30px] flex justify-center items-center">
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
