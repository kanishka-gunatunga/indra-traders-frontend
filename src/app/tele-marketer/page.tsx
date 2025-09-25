"use client";

import DetailsModal from "@/components/DetailsModal";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import VehicleGallery from "@/components/VehicleGallery";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const fastTrackDirectRequestData = [
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
  {
    name: "Albert Flores",
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    priceRange: "20,000,000 - 22,500,000",
  },
];

const reminderData = [
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
  {
    name: "Albert Frose",
    contact: "0783637333",
    title: "Find FK7 Ex Techpack",
    date: "12 March, 2025",
    note: "Color White or Red",
  },
];

const bestMatchesData = [
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
  {
    vehicle: "Toyota Hilux",
    type: "SUV",
    grade: "SR5",
    year: 2020,
    milage: "210,000km",
    estimatePrice: "20,000,000",
  },
];

const vehicleDetails = [
  { label: "Millage:", value: "210,000km" },
  { label: "No. of Owners:", value: "2" },
  { label: "Vehicle No:", value: "Brand New" },
  { label: "Color:", value: "Rallye Red" },
  { label: "Capacity:", value: "2800cc" },
  { label: "Model:", value: "2020 Toyota Hilux GR S" },
  { label: "Fuel:", value: "Diesel" },
  {
    label: "Transmission:",
    value: "Continuously Variable Transmission (CVT)",
  },
  { label: "Year:", value: "2020" },
  { label: "Grade:", value: "GR S" },
];

const customer = {
  name: "Emily Charlotte",
  contactNo: "077 5898712",
  email: "Emily@info.com",
  city: "Maharagama",
};

export default function TeleMarketerPage() {
  const [isBestMatchesModalOpen, setIsBestMatchesModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] =
    useState(false);

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderNote, setReminderNote] = useState("");

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Ronald Richards"
          location="Bambalapitiya"
          title="Indra Fast Track Telemarketer Dashboard"
          reminders={5}
        />

        {/* Request Section */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30  border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full">
            <span className="font-semibold text-[22px]">Direct Requests</span>
            <div className="w-full mt-7">
              <div className="h-[400px] overflow-x-auto overflow-y-hidden">
                <div className="min-w-[1000px]">
                  {/* Table header */}
                  <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                    <div className="flex-1 min-w-[140px] max-w-[220px] px-3 py-2">
                      Customer Name
                    </div>
                    <div className="flex-1 min-w-[120px] max-w-[180px] px-3 py-2">
                      Vehicle
                    </div>
                    <div className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2">
                      Type
                    </div>
                    <div className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2">
                      Grade
                    </div>
                    <div className="flex-1 min-w-[60px] max-w-[90px] px-3 py-2">
                      Year
                    </div>
                    <div className="flex-1 min-w-[100px] max-w-[180px] px-3 py-2">
                      Mileage
                    </div>
                    <div className="flex-1 min-w-[180px] max-w-[300px] px-3 py-2">
                      Price Range
                    </div>
                    <div className="flex-1 min-w-[90px] max-w-[130px] px-3 py-2">
                      Action
                    </div>
                  </div>

                  {/* Table body */}
                  <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                    {fastTrackDirectRequestData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex text-lg items-center mt-1 text-black hover:bg-gray-50 transition"
                      >
                        <div className="flex-1 min-w-[140px] max-w-[220px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.name}
                        </div>
                        <div className="flex-1 min-w-[120px] max-w-[180px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.vehicle}
                        </div>
                        <div className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.type}
                        </div>
                        <div className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.grade}
                        </div>
                        <div className="flex-1 min-w-[60px] max-w-[90px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.year}
                        </div>
                        <div className="flex-1 min-w-[100px] max-w-[180px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.milage}
                        </div>
                        <div className="flex-1 min-w-[180px] max-w-[300px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                          {item.priceRange}
                        </div>
                        <div className="flex-1 min-w-[90px] max-w-[130px] px-3 py-2 flex gap-4">
                          <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                            onClick={() => setIsBestMatchesModalOpen(true)}
                          >
                            <Image
                              src={"/images/comparison.svg"}
                              alt="comparison"
                              width={27}
                              height={27}
                            />
                          </button>
                          <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                            onClick={() => {
                              setReminderModalOpen(true);
                            }}
                          >
                            <Image
                              src={"/images/mdi_clock-arrow.svg"}
                              alt="comparison"
                              width={27}
                              height={27}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Matches Section */}
        {isBestMatchesModalOpen ? (
          <section className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
            <div className="w-full">
              <span className="font-semibold text-[22px]">Best Matches</span>
              <div className="w-full mt-7 ">
                <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                  <div className="min-w-[1000px] ">
                    {/* Table header */}
                    <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                      <div className="w-1/6 px-3 py-2">Vehicle</div>
                      <div className="w-1/6 px-3 py-2">Type</div>
                      <div className="w-1/6 px-3 py-2">Grade</div>
                      <div className="w-1/6 px-3 py-2">Year</div>
                      <div className="w-1/6 px-3 py-2">Mileage</div>
                      <div className="w-1/6 px-3 py-2">Estimate Price</div>
                    </div>

                    {/* Table body */}
                    <div
                      className="h-[360px] py-3 overflow-y-auto no-scrollbar"
                      onClick={() => {
                        setIsVehicleModalOpen(true);
                      }}
                    >
                      {bestMatchesData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                        >
                          <div className="w-1/6 px-3 py-2">{item.vehicle}</div>
                          <div className="w-1/6 px-3 py-2">{item.type}</div>
                          <div className="w-1/6 px-3 py-2">{item.grade}</div>
                          <div className="w-1/6 px-3 py-2 relative">
                            {item.year}
                          </div>
                          <div className="w-1/6 px-3 py-2">{item.milage}</div>
                          <div className="w-1/6 px-3 py-2">
                            {item.estimatePrice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Vehicle Details Section */}
        {isVehicleModalOpen && isBestMatchesModalOpen ? (
          <section className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
            <div className="w-full flex justify-between items-center">
              <span className="font-semibold text-[22px]">
                2020 Toyota Hilux GR S
              </span>
              <div className="flex gap-3">
                <button
                  className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                  onClick={() => {
                    window.location.href = "/sales";
                  }}
                >
                  <Image
                    src={"/images/fluent_person-star-20-regular.svg"}
                    alt="fluent_person-star-20-regular"
                    width={25}
                    height={25}
                  />
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <Image
                    src={"/images/material-symbols_sms-outline.svg"}
                    alt="material-symbols_sms-outline"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                  onClick={() => {
                    setIsCustomerDetailsModalOpen(true);
                  }}
                >
                  <Image
                    src={"/images/solar_phone-linear.svg"}
                    alt="solar_phone-linear"
                    width={26}
                    height={26}
                  />
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <Image
                    src={"/images/ri_whatsapp-line.svg"}
                    alt="ri_whatsapp-line"
                    width={24}
                    height={24}
                  />
                </button>
                <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <Image
                    src={"/images/material-symbols_mail-outline.svg"}
                    alt="material-symbols_mail-outline"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>

            <div className="w-full flex justify-center mt-8">
              <div className="w-1/2">
                <VehicleGallery
                  mainImage="/images/main-vehicle.png"
                  images={[
                    "/images/vehicle1.png",
                    "/images/vehicle2.png",
                    "/images/vehicle3.png",
                    "/images/vehicle4.png",
                  ]}
                />
              </div>
              <div className="w-1/2 px-10 flex flex-col">
                <span className="text-[20px] font-semibold tracking-wide">
                  Vehicle Details
                </span>
                <div className="text-[23px] mb-3 font-semibold tracking-wide text-[#DB2727] mt-5">
                  Rs. 22,400,000
                </div>
                <div className="flex flex-col gap-2">
                  {vehicleDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="w-full flex text-lg font-medium tracking-wide"
                    >
                      <div className="w-2/6">{detail.label}</div>
                      <div className="w-4/6 text-[#575757]">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Reminders Section */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 mb-5 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full">
            <span className="font-semibold text-[22px]">Reminders</span>
            <div className="w-full mt-7 ">
              <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                <div className="min-w-[1000px] ">
                  {/* Table header */}
                  <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                    <div className="w-1/5 px-3 py-2">Customer Name</div>
                    <div className="w-1/5 px-3 py-2">Contact No.</div>
                    <div className="w-1/5 px-3 py-2">Task Title</div>
                    <div className="w-1/5 px-3 py-2">Task Date</div>
                    <div className="w-1/5 px-3 py-2">Note</div>
                  </div>

                  {/* Table body */}
                  <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                    {reminderData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                      >
                        <div className="w-1/5 px-3 py-2">{item.name}</div>
                        <div className="w-1/5 px-3 py-2">{item.contact}</div>
                        <div className="w-1/5 px-3 py-2">{item.title}</div>
                        <div className="w-1/5 px-3 py-2 relative">
                          {item.date}
                        </div>
                        <div className="w-1/5 px-3 py-2">{item.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

      {/* Customer Details Modal */}
      {isCustomerDetailsModalOpen && (
        <DetailsModal
          isOpen={isCustomerDetailsModalOpen}
          onClose={() => setIsCustomerDetailsModalOpen(false)}
          title="Customer Details"
        >
          <div className="flex font-medium">
            <div className="w-1/4">Customer Name:</div>
            <div className="w-3/4 text-[#1D1D1D]">{customer.name}</div>
          </div>
          <div className="flex font-medium">
            <div className="w-1/4">Contact No:</div>
            <div className="w-3/4 text-[#1D1D1D]">{customer.contactNo}</div>
          </div>
          <div className="flex font-medium">
            <div className="w-1/4">Email:</div>
            <div className="w-3/4 text-[#1D1D1D]">{customer.email}</div>
          </div>
          <div className="flex font-medium">
            <div className="w-1/4">City:</div>
            <div className="w-3/4 text-[#1D1D1D]">{customer.city}</div>
          </div>
        </DetailsModal>
      )}
    </div>
  );
}
