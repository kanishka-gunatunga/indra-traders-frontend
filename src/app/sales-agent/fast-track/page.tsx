/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Modal from "@/components/Modal";
import Header from "@/components/Header";
import {TicketCardProps} from "@/components/TicketCard";
import {TicketColumn} from "@/components/TicketColumn";
import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Role} from "@/types/role";
import {useCreateDirectRequest, useFastTrackSales, useUpdateSaleStatus} from "@/hooks/useFastTrack";
import {useNearestReminders} from "@/hooks/useSparePartSales";

type OptionType = { value: string; label: string };

const vehicleMakes = [
    {value: "Toyota", label: "Toyota"},
    {value: "Nissan", label: "Nissan"},
    {value: "Honda", label: "Honda"},
];

const vehicleModels = [
    {value: "Corolla", label: "Corolla"},
    {value: "Civic", label: "Civic"},
    {value: "Navara", label: "Navara"},
];

type MappedTicket = {
    id: string;
    priority: number;
    user: string;
    phone: string;
    date: string;
    status: "New" | "Ongoing" | "Won" | "Lost";
};

const mapStatus = (apiStatus: string): MappedTicket["status"] => {
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

const mapApiToTicket = (apiSale: any): MappedTicket => ({
    id: apiSale.ticket_number,
    priority: apiSale.priority || 0, // Assuming priority is optional in API response
    user: apiSale.customer?.name || "Unknown",
    phone: apiSale.customer?.contact_no || "",
    date: new Date(apiSale.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }),
    status: mapStatus(apiSale.status),
});

export default function SalesDashboard() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const [tickets, setTickets] = useState<MappedTicket[]>([]);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

    // Form state for creating a direct request
    const [customerId, setCustomerId] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [leadSource, setLeadSource] = useState("");
    const [remark, setRemark] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
    const [selectedModel, setSelectedModel] = useState<OptionType | null>(null);
    const [grade, setGrade] = useState("");
    const [manufactureYear, setManufactureYear] = useState("");
    const [mileageMin, setMileageMin] = useState("");
    const [mileageMax, setMileageMax] = useState("");
    const [noOfOwners, setNoOfOwners] = useState("");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");

    const {data: apiSales, isLoading} = useFastTrackSales();
    const createDirectRequestMutation = useCreateDirectRequest();
    const updateSaleStatusMutation = useUpdateSaleStatus();

    const userId = 1;
    const {data: reminderData, isLoading: reminderLoading, error: reminderError} = useNearestReminders(userId);

    useEffect(() => {
        if (apiSales) {
            setTickets(apiSales.map(mapApiToTicket));
        }
    }, [apiSales]);

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
        const {destination, source, draggableId} = result;
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        const ticket = tickets.find((t) => t.id === draggableId);
        if (!ticket) return;

        const currentStatus = ticket.status;
        const newStatus = destination.droppableId as TicketCardProps["status"];
        if (allowedTransitions[currentStatus].includes(newStatus)) {
            // Update local state
            setTickets((prev) =>
                prev.map((t) =>
                    t.id === draggableId ? {...t, status: newStatus} : t
                )
            );

            // Update sale status via API
            updateSaleStatusMutation.mutate(
                {saleId: draggableId, status: newStatus.toUpperCase()},
                {
                    onError: (err) => {
                        console.error("Error updating sale status:", err);
                        // Revert local state on failure
                        setTickets((prev) =>
                            prev.map((t) =>
                                t.id === draggableId ? {...t, status: currentStatus} : t
                            )
                        );
                        alert("Failed to update sale status.");
                    },
                }
            );
        }
    };

    const columns: TicketCardProps["status"][] = [
        "New",
        "Ongoing",
        "Won",
        "Lost"
    ];

    const handleCreateDirectRequest = () => {
        if (
            !customerId ||
            !vehicleType ||
            !selectedMake ||
            !selectedModel ||
            !manufactureYear
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = {
            customer_id: parseInt(customerId),
            vehicle_type: vehicleType,
            vehicle_make: selectedMake.value,
            vehicle_model: selectedModel.value,
            grade: grade || null,
            manufacture_year: parseInt(manufactureYear),
            mileage_min: mileageMin ? parseInt(mileageMin) : null,
            mileage_max: mileageMax ? parseInt(mileageMax) : null,
            no_of_owners: noOfOwners ? parseInt(noOfOwners) : null,
            price_from: priceFrom ? parseInt(priceFrom) : null,
            price_to: priceTo ? parseInt(priceTo) : null,
        };

        createDirectRequestMutation.mutate(payload, {
            onSuccess: () => {
                alert("Direct request created successfully!");
                // Reset form
                setCustomerId("");
                setContactNumber("");
                setEmail("");
                setCity("");
                setLeadSource("");
                setRemark("");
                setVehicleType("");
                setSelectedMake(null);
                setSelectedModel(null);
                setGrade("");
                setManufactureYear("");
                setMileageMin("");
                setMileageMax("");
                setNoOfOwners("");
                setPriceFrom("");
                setPriceTo("");
                setIsAddLeadModalOpen(false);
            },
            onError: (err: any) => {
                console.error("Error creating direct request:", err);
                alert("Failed to create direct request.");
            },
        });
    };

    const upcomingEventsData = [
        {
            customerName: "Emily Charlotte",
            date: "March 15",
            eventType: "BirthDay",
        },
        {
            customerName: "Albert Flore",
            date: "March 16",
            eventType: "Reminder",
        },
        {
            customerName: "Guy Hawkins",
            date: "May 12",
            eventType: "Reminder",
        },
        {
            customerName: "Wade Warren",
            date: "May 6",
            eventType: "BirthDay",
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title="Indra Fast Track Sales Dashboard"
                />

                {/* Leads Section */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
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

                {/* Next action and Upcomming events */}
                <section className="relative  flex flex-wrap w-full mb-5 gap-3 justify-center items-center">
                    <div
                        className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Next Action</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Ticket No.</div>
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Conatct No.</div>
                            </div>
                            <hr className="border-gray-300 my-4"/>

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {/*{nextActionData.map((item, idx) => (*/}
                                {/*    <div*/}
                                {/*        key={idx}*/}
                                {/*        className={`flex ${*/}
                                {/*            idx > 0 ? "mt-3" : ""*/}
                                {/*        } font-medium text-black min-w-[400px]`}*/}
                                {/*    >*/}
                                {/*        <div className="w-1/3 px-2">{item.ticketNo}</div>*/}
                                {/*        <div className="w-1/3 px-2">{item.name}</div>*/}
                                {/*        <div className="w-1/3 px-2">{item.contactNo}</div>*/}
                                {/*    </div>*/}
                                {/*))}*/}

                                {reminderData?.data.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            idx > 0 ? "mt-3" : ""
                                        } font-medium text-black min-w-[400px]`}
                                    >
                                        <div className="w-1/3 px-2">{item.ticket_number}</div>
                                        <div className="w-1/3 px-2">{item.customer_name}</div>
                                        <div className="w-1/3 px-2">{item.contact_number}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex flex-col flex-1 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10">
                        <span className="font-semibold text-[22px]">Upcoming Events</span>
                        <div className="h-full mt-5 overflow-y-auto no-scrollbar pr-2">
                            {/* Table header */}
                            <div className="flex font-medium text-[#575757] min-w-[400px]">
                                <div className="w-1/3 px-2">Customer Name</div>
                                <div className="w-1/3 px-2">Date</div>
                                <div className="w-1/3 px-2">Event Type</div>
                            </div>
                            <hr className="border-gray-300 my-4"/>

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {upcomingEventsData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            idx > 0 ? "mt-3" : ""
                                        } font-medium text-black min-w-[400px]`}
                                    >
                                        <div className="w-1/3 px-2">{item.customerName}</div>
                                        <div className="w-1/3 px-2">{item.date}</div>
                                        <div className="w-1/3 px-2">{item.eventType}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Add Lead Modal */}
            {isAddLeadModalOpen && (
                <Modal
                    title="Add New Lead"
                    onClose={() => setIsAddLeadModalOpen(false)}
                    actionButton={{
                        label: "Add",
                        onClick: handleCreateDirectRequest,
                    }}
                    isPriorityAvailable={true}
                    // priority={priority}
                    // onPriorityChange={setPriority}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Customer Name</label>
                            <input
                                type="text"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
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

                    {/* Lead Source & Vehicle Type */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
                        {/* Lead Source */}
                        <div>
                            <label className="block mb-2 font-medium">Lead Source</label>
                            <div
                                className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                                <select
                                    value={leadSource}
                                    onChange={(e) => setLeadSource(e.target.value)}
                                    className="w-full bg-transparent outline-none appearance-none"
                                >
                                    <option value="">Select Lead Source</option>
                                    <option value="Direct Call">Direct Call</option>
                                    <option value="Website">Website</option>
                                    <option value="Referral">Referral</option>
                                </select>
                                <span className="absolute right-4 pointer-events-none">
                  <Image
                      src={"/images/sales/icon-park-solid_down-one.svg"}
                      width={19}
                      height={19}
                      alt="Arrow"
                  />
                </span>
                            </div>
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="block mb-2 font-medium">Vehicle Type</label>
                            <div
                                className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                                <select
                                    value={vehicleType}
                                    onChange={(e) => setVehicleType(e.target.value)}
                                    className="w-full bg-transparent outline-none appearance-none"
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Truck">Truck</option>
                                </select>
                                <span className="absolute right-4 pointer-events-none">
                  <Image
                      src={"/images/sales/icon-park-solid_down-one.svg"}
                      width={19}
                      height={19}
                      alt="Arrow"
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
                                value={selectedMake}
                                onChange={(option) => setSelectedMake(option)}
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
                                value={selectedModel}
                                onChange={(option) => setSelectedModel(option)}
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

                    {/* Remark */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
                        <div className="md:col-span-4">
                            <label className="block mb-2 font-medium">Remark</label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
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