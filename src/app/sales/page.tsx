"use client";

import Modal from "@/components/Modal";
import SalesHeader from "@/components/SalesHeader";
import { TicketCardProps } from "@/components/TicketCard";
import { TicketColumn } from "@/components/TicketColumn";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import React, { useState } from "react";
import Select from "react-select";

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
  {
    id: "ITPL122455874593",
    priority: 2,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "New",
  },
  {
    id: "ITPL122455874504",
    priority: 3,
    user: "Alex",
    phone: "0777654321",
    date: "13 Mar, 2025",
    status: "Lost",
  },
  {
    id: "ITPL122455174565",
    priority: 4,
    user: "Sophie",
    phone: "0771234567",
    date: "12 Mar, 2025",
    status: "Won",
  },
];

const vehicleMakes = [
  { value: "Toyota", label: "Toyota" },
  { value: "Nissan", label: "Nissan" },
  { value: "Honda", label: "Honda" },
];

const vehicleModels = [
  { value: "Corolla", label: "Corolla" },
  { value: "Civic", label: "Civic" },
  { value: "Navara", label: "Navara" },
];

export default function SalesDashboard() {
  const [tickets, setTickets] = useState<TicketCardProps[]>(dummyTickets);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [remark, setremark] = useState("");

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

    // If dropped in same place → do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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
        <SalesHeader />

        {/* Leads Section */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 mb-5 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">Leads</span>
            <button
              className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
              onClick={() => setIsAddLeadModalOpen(true)}
            >
              <Image
                src={"/images/sales/plus.svg"}
                width={24}
                height={24}
                alt="Plus icon"
              />
            </button>
          </div>

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
        </section>
      </main>

      {/* Activity Modal */}
      {isAddLeadModalOpen && (
        <Modal
          title="Add New lead"
          onClose={() => setIsAddLeadModalOpen(false)}
          onSave={() => {
            console.log("Activity saved:", {
              customerName,
              contactNumber,
              email,
            });
            setCustomerName("");
            setContactNumber("");
            setEmail("");
            setIsAddLeadModalOpen(false);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            <div>
              <label className="block mb-2 font-medium">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Contact No</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                placeholder="Contact No"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                placeholder="City"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
            {/* Lead Source */}
            <div>
              <label className="block mb-2 font-medium">Lead Source</label>

              <div className="relative w-full">
                <div className="h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] flex items-center px-4">
                  <select
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-transparent outline-none appearance-none"
                  >
                    <option value="Direct Call">Direct Call</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <span className="absolute right-4 text-gray-600 pointer-events-none">
                    <Image
                      src={"images/sales/icon-park-solid_down-one.svg"}
                      alt="Dropdown arrow"
                      width={19}
                      height={19}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block mb-2 font-medium">Vehicle Type</label>
              <div className="h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] flex items-center px-4">
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <span className="absolute right-4 text-gray-600 pointer-events-none">
                  <Image
                    src={"images/sales/icon-park-solid_down-one.svg"}
                    alt="Dropdown arrow"
                    width={19}
                    height={19}
                  />
                </span>
              </div>
            </div>

            {/* Vehicle Make */}
            <div>
              <label className="block mb-2 font-medium">Vehicle Make</label>
              <Select
                options={vehicleMakes}
                placeholder="Select Vehicle Make"
                isSearchable
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "51px",
                    borderRadius: "30px",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(50px)",
                    borderColor: "rgba(0,0,0,0.5)",
                    paddingLeft: "10px",
                  }),
                }}
              />
            </div>

            {/* Vehicle Model */}
            <div>
              <label className="block mb-2 font-medium">Vehicle Model</label>
              <Select
                options={vehicleModels}
                placeholder="Select Vehicle Model"
                isSearchable
                className="w-full mt-3"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "51px",
                    borderRadius: "30px",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(50px)",
                    borderColor: "rgba(0,0,0,0.5)",
                    paddingLeft: "10px",
                  }),
                }}
              />
            </div>
          </div>

          {/* Remark Full Width */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
            <div className="md:col-span-4">
              <label className="block mb-2 font-medium">Remark</label>
              <textarea
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-[120px] rounded-[20px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 py-2"
                placeholder="Enter remarks here..."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
