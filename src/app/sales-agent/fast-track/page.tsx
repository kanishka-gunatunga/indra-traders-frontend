"use client";

import Modal from "@/components/Modal";
import Header from "@/components/Header";
import {TicketCardProps} from "@/components/TicketCard";
import {TicketColumn} from "@/components/TicketColumn";
import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import Image from "next/image";
import React, {useState} from "react";
import Select from "react-select";
import {Role} from "@/types/role";
import {useSpareCreateSale, useSpareSales} from "@/hooks/useSparePartSales";
import {useFastTrackSales} from "@/hooks/useFastTrack";

type OptionType = { value: string; label: string };

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
    priority: apiSale.priority,
    user: apiSale.customer?.customer_name || "Unknown",
    phone: apiSale.customer?.phone_number || "",
    date: new Date(apiSale.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}),
    status: mapStatus(apiSale.status),
});

const FastTrackSales = () => {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );
    const [tickets, setTickets] = useState<MappedTicket[]>([]);
    const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false); // Renamed from Add Lead to Add Sale
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
    const [customerId, setCustomerId] = useState(""); // Assume input for customer_id
    const [callAgentId, setCallAgentId] = useState(1); // Hardcoded or select
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [partNo, setPartNo] = useState("");
    const [yearOfManufacture, setYearOfManufacture] = useState("");
    const [additionalNote, setAdditionalNote] = useState("");
    const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
    const [selectedModel, setSelectedModel] = useState<OptionType | null>(null); // Fixed typo: setSelectedModal -> setSelectedModel
    const [selectedPartNo, setSelectedPartNo] = useState<OptionType | null>(null);

    const {data: apiSales, isLoading} = useFastTrackSales();
    const createSaleMutation = useSpareCreateSale();

    React.useEffect(() => {
        if (apiSales) {
            setTickets(apiSales.map(mapApiToTicket));
        }
    }, [apiSales]);

    const allowedTransitions: Record<MappedTicket["status"], MappedTicket["status"][]> = {
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
        setTickets((prev) =>
            prev.map((t) => {
                if (t.id !== draggableId) return t;
                const currentStatus = t.status;
                const newStatus = destination.droppableId as MappedTicket["status"];
                if (allowedTransitions[currentStatus].includes(newStatus)) {
                    return {...t, status: newStatus};
                }
                return t;
            })
        );
    };

    const columns: MappedTicket["status"][] = [
        "New",
        "Ongoing",
        "Won",
        "Lost",
    ];

    const handleCreateSale = () => {
        if (!customerId || !vehicleMake || !vehicleModel || !partNo || !yearOfManufacture) {
            alert("Please fill all required fields.");
            return;
        }
        const payload = {
            date: saleDate,
            customer_id: customerId,
            call_agent_id: callAgentId,
            vehicle_make: vehicleMake,
            vehicle_model: vehicleModel,
            part_no: partNo,
            year_of_manufacture: parseInt(yearOfManufacture),
            additional_note: additionalNote,
        };
        createSaleMutation.mutate(payload, {
            onSuccess: () => {
                alert("Sale created successfully!");
                // Reset form
                setSaleDate(new Date().toISOString().split("T")[0]);
                setCustomerId("");
                setVehicleMake("");
                setVehicleModel("");
                setPartNo("");
                setYearOfManufacture("");
                setAdditionalNote("");
                setSelectedMake(null);
                setSelectedModel(null);
                setSelectedPartNo(null);
                setIsAddSaleModalOpen(false);
            },
            onError: (err: any) => {
                console.error("Error creating sale:", err);
                alert("Failed to create sale.");
            },
        });
    };

    const nextActionData = [
        {
            ticketNo: "ITPL122455874564",
            name: "Emily Charlotte",
            contactNo: "0773839322",
        },
        {
            ticketNo: "ITPL122455874595",
            name: "Emily Charlotte",
            contactNo: "0773839322",
        },
        {
            ticketNo: "ITPL122455874165",
            name: "Emily Charlotte",
            contactNo: "0773839322",
        },
        {
            ticketNo: "ITPL122455874505",
            name: "Emily Charlotte",
            contactNo: "0773839322",
        },
    ];
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
                    title={
                        role === "tele-marketer"
                            ? "Indra Fast Track Sales Dashboard"
                            : "Indra Traders Sales Dashboard"
                    }
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
                                {nextActionData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            idx > 0 ? "mt-3" : ""
                                        } font-medium text-black min-w-[400px]`}
                                    >
                                        <div className="w-1/3 px-2">{item.ticketNo}</div>
                                        <div className="w-1/3 px-2">{item.name}</div>
                                        <div className="w-1/3 px-2">{item.contactNo}</div>
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
                        onClick: () => {
                            console.log("Saved lead data:", {
                                customerName,
                                contactNumber,
                                email,
                                city,
                                leadSource,
                                remark,
                                priority,
                            });
                            // Reset form
                            setCustomerName("");
                            setContactNumber("");
                            setEmail("");
                            setCity("");
                            setLeadSource("");
                            setRemark("");
                            setPriority("P0");
                            setIsAddLeadModalOpen(false);
                        },
                    }}
                    isPriorityAvailable={true}
                    priority={priority}
                    onPriorityChange={setPriority}
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
                                onChange={(option) => setSelectedModal(option)}
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

export default FastTrackSales;