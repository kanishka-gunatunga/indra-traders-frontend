/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import DetailsModal from "@/components/DetailsModal";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import VehicleGallery from "@/components/VehicleGallery";
import Image from "next/image";
import React, {useState} from "react";
import {useBestMatches, useDirectRequests, useRemindersByDirectRequest} from "@/hooks/useFastTrack";
import {useCreateReminder} from "@/hooks/useReminder";


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
    {label: "Millage:", value: "210,000km"},
    {label: "No. of Owners:", value: "2"},
    {label: "Vehicle No:", value: "Brand New"},
    {label: "Color:", value: "Rallye Red"},
    {label: "Capacity:", value: "2800cc"},
    {label: "Model:", value: "2020 Toyota Hilux GR S"},
    {label: "Fuel:", value: "Diesel"},
    {
        label: "Transmission:",
        value: "Continuously Variable Transmission (CVT)",
    },
    {label: "Year:", value: "2020"},
    {label: "Grade:", value: "GR S"},
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

    const [selectedDirectRequestId, setSelectedDirectRequestId] = useState<number | null>(null);

    const [isReminderModalOpen, setReminderModalOpen] = useState(false);
    const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] =
        useState(false);

    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderNote, setReminderNote] = useState("");

    const {data: directRequests = [], isLoading: isLoadingRequests, error: requestsError} = useDirectRequests();
    const {
        data: bestMatches = [],
        isLoading: isLoadingBestMatches
    } = useBestMatches(selectedDirectRequestId?.toString() || "");
    const {
        data: reminders = [],
        isLoading: isLoadingReminders
    } = useRemindersByDirectRequest(selectedDirectRequestId?.toString() || "");
    const createReminderMutation = useCreateReminder();


    const handleBestMatchesClick = (directRequestId: number) => {
        setSelectedDirectRequestId(directRequestId);
        setIsBestMatchesModalOpen(true);
    };

    const handleReminderClick = (directRequestId: number) => {
        setSelectedDirectRequestId(directRequestId);
        setReminderModalOpen(true);
    };

    const handleSaveReminder = () => {
        if (!selectedDirectRequestId) return;

        createReminderMutation.mutate(
            {
                task_title: reminderTitle,
                task_date: reminderDate,
                note: reminderNote,
                direct_request_id: selectedDirectRequestId,
            },
            {
                onSuccess: () => {
                    alert("Reminder created successfully!");
                    setReminderTitle("");
                    setReminderDate("");
                    setReminderNote("");
                    setReminderModalOpen(false);
                },
                onError: (error) => {
                    console.error("Failed to create reminder:", error);
                    alert("Failed to create reminder");
                },
            }
        );
    };

    const handleRowClickForVehicle = () => {
        setIsVehicleModalOpen(true);
    };

    if (requestsError) {
        return <div>Error loading direct requests: {requestsError.message}</div>;
    }

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Ronald Richards"
                    location="Bambalapitiya"
                    title="Indra Fast Track Telemarketer Dashboard"
                    reminders={reminders.length}
                />

                {/* Request Section */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30  border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full">
                        <span className="font-semibold text-[22px]">Direct Requests</span>
                        <div className="w-full mt-7">
                            <div className="h-[400px] overflow-x-auto overflow-y-hidden">
                                <div className="min-w-[1000px]">
                                    {/* Table header */}
                                    <div
                                        className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
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
                                        {isLoadingRequests ? (
                                            <div
                                                className="flex items-center justify-center h-full text-gray-500">Loading
                                                requests...</div>
                                        ) : directRequests.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-gray-500">No
                                                direct requests found.</div>
                                        ) : (
                                            directRequests.map((request: any, idx: number) => (
                                                <div
                                                    key={request.id || idx}
                                                    className="flex text-lg items-center mt-1 text-black hover:bg-gray-50 transition"
                                                >
                                                    <div
                                                        className="flex-1 min-w-[140px] max-w-[220px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.customer?.name || "Unknown Customer"}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[120px] max-w-[180px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {`${request.vehicle_make} ${request.vehicle_model}`}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.vehicle_type}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[60px] max-w-[100px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.grade || "N/A"}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[60px] max-w-[90px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.manufacture_year || "N/A"}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[100px] max-w-[180px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.mileage_min && request.mileage_max ? `${request.mileage_min}-${request.mileage_max}km` : "N/A"}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[180px] max-w-[300px] px-3 py-2 break-words whitespace-normal overflow-hidden">
                                                        {request.price_from && request.price_to ? `${request.price_from.toLocaleString()} - ${request.price_to.toLocaleString()}` : "N/A"}
                                                    </div>
                                                    <div
                                                        className="flex-1 min-w-[90px] max-w-[130px] px-3 py-2 flex gap-4">
                                                        <button
                                                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                                                            onClick={() => handleBestMatchesClick(request.id)}
                                                            disabled={isLoadingBestMatches}
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
                                                            onClick={() => handleReminderClick(request.id)}
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
                                            )))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Best Matches Section */}
                {isBestMatchesModalOpen ? (
                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                        <div className="w-full">
                            <span className="font-semibold text-[22px]">Best Matches</span>
                            <div className="w-full mt-7 ">
                                <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                                    <div className="min-w-[1000px] ">
                                        {/* Table header */}
                                        <div
                                            className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
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
                                            onClick={handleRowClickForVehicle}
                                        >
                                            {isLoadingBestMatches ? (
                                                <div
                                                    className="flex items-center justify-center h-full text-gray-500">Loading
                                                    best matches...</div>
                                            ) : bestMatches.length === 0 ? (
                                                <div
                                                    className="flex items-center justify-center h-full text-gray-500">No
                                                    best matches found.</div>
                                            ) : (
                                                bestMatches.map((match: any, idx: number) => (
                                                    <div
                                                        key={match.id || idx}
                                                        className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                                                    >
                                                        <div
                                                            className="w-1/6 px-3 py-2">{match.vehicle?.model || "N/A"}</div>
                                                        <div
                                                            className="w-1/6 px-3 py-2">{match.vehicle?.type || "N/A"}</div>
                                                        <div
                                                            className="w-1/6 px-3 py-2">{match.vehicle?.grade || "N/A"}</div>
                                                        <div className="w-1/6 px-3 py-2 relative">
                                                            {match.vehicle?.manufacture_year || "N/A"}
                                                        </div>
                                                        <div
                                                            className="w-1/6 px-3 py-2">{match.vehicle?.mileage || "N/A"}</div>
                                                        <div className="w-1/6 px-3 py-2">
                                                            {match.estimate_price?.toLocaleString() || "N/A"}
                                                        </div>
                                                    </div>
                                                )))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                {/* Vehicle Details Section */}
                {isVehicleModalOpen && isBestMatchesModalOpen ? (
                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
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
                                <button
                                    className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
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
                                <button
                                    className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                                    <Image
                                        src={"/images/ri_whatsapp-line.svg"}
                                        alt="ri_whatsapp-line"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                                <button
                                    className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
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
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 mb-5 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full">
                        <span className="font-semibold text-[22px]">Reminders</span>
                        <div className="w-full mt-7 ">
                            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
                                <div className="min-w-[1000px] ">
                                    {/* Table header */}
                                    <div
                                        className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                        <div className="w-1/5 px-3 py-2">Customer Name</div>
                                        <div className="w-1/5 px-3 py-2">Contact No.</div>
                                        <div className="w-1/5 px-3 py-2">Task Title</div>
                                        <div className="w-1/5 px-3 py-2">Task Date</div>
                                        <div className="w-1/5 px-3 py-2">Note</div>
                                    </div>

                                    {/* Table body */}
                                    <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                        {isLoadingReminders ? (
                                            <div
                                                className="flex items-center justify-center h-full text-gray-500">Loading
                                                reminders...</div>
                                        ) : reminders.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-gray-500">No
                                                reminders found.</div>
                                        ) : (
                                            reminders.map((reminder: any, idx: number) => (
                                                <div
                                                    key={reminder.id || idx}
                                                    className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                                                >
                                                    <div
                                                        className="w-1/5 px-3 py-2">{reminder.customer?.name || "Unknown"}</div>
                                                    <div
                                                        className="w-1/5 px-3 py-2">{reminder.customer?.contact_no || "N/A"}</div>
                                                    <div className="w-1/5 px-3 py-2">{reminder.task_title}</div>
                                                    <div className="w-1/5 px-3 py-2 relative">
                                                        {new Date(reminder.task_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="w-1/5 px-3 py-2">{reminder.note || "N/A"}</div>
                                                </div>
                                            )))}
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
