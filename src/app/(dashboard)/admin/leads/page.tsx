"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import { TicketCardProps } from "@/components/TicketCard";
import { TicketColumn } from "@/components/TicketColumn";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import React, { useState } from "react";

const dummyTickets: TicketCardProps[] = [
  {
    id: "ITPL122455874561",
    priority: 0,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "New",
  },
  {
    id: "ITPL122455874562",
    priority: 1,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
    status: "Ongoing",
  },
  {
    id: "ITPL122455874563",
    priority: 2,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "New",
  },
  {
    id: "ITPL122455874564",
    priority: 3,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
    status: "Lost",
  },
  {
    id: "ITPL122455874565",
    priority: 4,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "Won",
  },
];

const priority = ["P0", "P1", "P2", "P3", "P4", "P5"];
const department = ["ITPL", "ISP", "IMS", "IFT"];

export default function Leads() {
  const [tickets, setTickets] = useState<TicketCardProps[]>(dummyTickets);

  const [isFilterLeadsModalOpen, setIsFilterLeadsModalOpen] = useState(false);

  const [selectedPriorirties, setSelectedPriorities] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const allowedTransitions: Record<
    TicketCardProps["status"],
    TicketCardProps["status"][]
  > = {
    New: ["Ongoing"],
    Ongoing: ["Won", "Lost"],
    Won: [],
    Lost: [],
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== draggableId) return t;
        const currentStatus = t.status;
        const newStatus = destination.droppableId as TicketCardProps["status"];
        if (allowedTransitions[currentStatus].includes(newStatus)) {
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const columns: TicketCardProps["status"][] = [
    "New",
    "Ongoing",
    "Won",
    "Lost",
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="All Leads"
        />

        {/* All Leads Section */}
        <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">All Leads</span>

            <button
              className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
              onClick={() => {
                setIsFilterLeadsModalOpen(true);
              }}
            >
              <Image
                src={"/images/admin/flowbite_filter-outline.svg"}
                width={24}
                height={24}
                alt="Filter icon"
              />
            </button>
          </div>
          <div className="w-full mt-5">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="w-full mt-6 flex gap-6 overflow-x-auto ">
                {columns.map((col) => (
                  <TicketColumn
                    key={col}
                    title={col}
                    tickets={tickets.filter((t) => t.status === col)}
                  />
                ))}
              </div>
            </DragDropContext>
          </div>
        </section>
      </main>
      {/* Complain Filter Modal */}
      {isFilterLeadsModalOpen && (
        <Modal
          title="Filter"
          onClose={() => setIsFilterLeadsModalOpen(false)}
          actionButton={{
            label: "Apply",
            onClick: () => {
              console.log("Selected Priorities:", selectedPriorirties);
              console.log("Selected Departments:", selectedDepartments);
              setSelectedPriorities([]);
              setSelectedDepartments([]);
              setIsFilterLeadsModalOpen(false);
            },
          }}
        >
          {/* --- Priority --- */}
          <div className="w-full">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              Priority
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {priority.map((priority) => {
                const isSelected = selectedPriorirties.includes(priority);
                return (
                  <div
                    key={priority}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                                  ${
                                    isSelected
                                      ? "bg-blue-500 text-white border-none"
                                      : ""
                                  }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPriorities(
                          selectedPriorirties.filter((r) => r !== priority)
                        );
                      } else {
                        setSelectedPriorities([
                          ...selectedPriorirties,
                          priority,
                        ]);
                      }
                    }}
                  >
                    {priority}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Department --- */}
          <div className="w-full mt-5">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              Department
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {department.map((dept) => {
                const isSelected = selectedDepartments.includes(dept);
                return (
                  <div
                    key={dept}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                                  ${
                                    isSelected
                                      ? "bg-blue-500 text-white border-none"
                                      : ""
                                  }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDepartments(
                          selectedDepartments.filter((d) => d !== dept)
                        );
                      } else {
                        setSelectedDepartments([...selectedDepartments, dept]);
                      }
                    }}
                  >
                    {dept}
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
