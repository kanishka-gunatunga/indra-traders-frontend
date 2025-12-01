/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Modal from "@/components/Modal";
import Header from "@/components/Header";
import {TicketCard, TicketCardProps} from "@/components/TicketCard";
import {TicketColumn} from "@/components/TicketColumn";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Role} from "@/types/role";
import {
    useSpareSales,
    useSpareCreateSale,
    useNearestReminders,
    useUpdateSaleStatus,
    useAssignToMe
} from "@/hooks/useSparePartSales";
import {useToast} from "@/hooks/useToast";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {createPortal} from "react-dom";
import Toast from "@/components/Toast";

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
const partNos = [
    {value: "BP-001", label: "BP-001"},
    {value: "EC-005", label: "EC-005"},
    {value: "BP-002", label: "BP-002"},
];

type MappedTicket = {
    id: string;
    dbId: number;
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

const mapStatusToApi = (uiStatus: string): string => {
    switch (uiStatus) {
        case "New":
            return "NEW";
        case "Ongoing":
            return "ONGOING";
        case "Won":
            return "WON";
        case "Lost":
            return "LOST";
        default:
            return "NEW";
    }
};

const mapApiToTicket = (apiSale: any): MappedTicket => ({
    id: apiSale.ticket_number,
    dbId: apiSale.id,
    priority: apiSale.priority,
    user: apiSale.customer?.customer_name || "Unknown",
    phone: apiSale.customer?.phone_number || "",
    date: new Date(apiSale.date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"}),
    status: mapStatus(apiSale.status),
});

export default function SalesDashboard() {
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


    const [isMounted, setIsMounted] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(null);

    const {toast, showToast, hideToast} = useToast();



    const {data: apiSales, isLoading} = useSpareSales();
    const createSaleMutation = useSpareCreateSale();

    const updateStatusMutation = useUpdateSaleStatus();
    const assignMutation = useAssignToMe();


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );


    const userId = 1;
    const {data: reminderData, isLoading: reminderLoading, error: reminderError} = useNearestReminders(userId);


    useEffect(() => {
        setIsMounted(true);
    }, []);


    useEffect(() => {
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


    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    // const onDragEnd = (result: DropResult) => {
    //     const {destination, source, draggableId} = result;
    //     if (!destination) return;
    //     if (
    //         destination.droppableId === source.droppableId &&
    //         destination.index === source.index
    //     )
    //         return;
    //     setTickets((prev) =>
    //         prev.map((t) => {
    //             if (t.id !== draggableId) return t;
    //             const currentStatus = t.status;
    //             const newStatus = destination.droppableId as MappedTicket["status"];
    //             if (allowedTransitions[currentStatus].includes(newStatus)) {
    //                 return {...t, status: newStatus};
    //             }
    //             return t;
    //         })
    //     );
    // };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        setActiveId(null);

        if (!over) return;

        const ticketId = active.id as string;
        const newStatus = over.id as MappedTicket["status"];

        const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
        if (ticketIndex === -1) return;

        const ticket = tickets[ticketIndex];
        const currentStatus = ticket.status;

        if (currentStatus === newStatus) return;

        const isAllowed = allowedTransitions[currentStatus]?.includes(newStatus);

        if (!isAllowed) {
            console.warn(`Invalid transition: ${currentStatus} -> ${newStatus}`);
            showToast("Invalid status transition", "error");
            return;
        }

        const updatedTickets = [...tickets];
        updatedTickets[ticketIndex] = {...ticket, status: newStatus};
        setTickets(updatedTickets);


        if (currentStatus === "New" && newStatus === "Ongoing") {
            assignMutation.mutate(
                {
                    id: ticket.dbId,
                    userId: userId
                },
                {
                    onSuccess: () => {
                        showToast("Lead assigned successfully.", "success");
                        console.log("Lead assigned successfully");
                    },
                    onError: (error) => {
                        console.error("Failed to assign lead:", error);
                        setTickets(tickets);
                        showToast("Failed to assign lead", "error");
                    }
                }
            );
        } else {
            updateStatusMutation.mutate(
                {
                    id: ticket.dbId,
                    status: mapStatusToApi(newStatus) as "WON" | "LOST"
                },
                {
                    onError: () => {
                        // Revert on failure
                        setTickets(tickets);
                        showToast("Failed to update status", "error");
                    }
                }
            )
        }
    };

    const activeTicket = tickets.find((t) => t.id === activeId);

    const columns: MappedTicket["status"][] = [
        "New",
        "Ongoing",
        "Won",
        "Lost",
    ];

    const handleCreateSale = () => {
        if (!customerId || !vehicleMake || !vehicleModel || !partNo || !yearOfManufacture) {
            showToast("Please fill all required fields", "error");
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
                showToast("Sale created successfully!", "success");
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
                showToast("Failed to create sale", "error");
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

    if (!isMounted) return null;

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
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title="Indra Motor Spare Sales Dashboard"
                />

                {/* Leads Section */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Leads</span>
                        <button
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                            onClick={() => setIsAddSaleModalOpen(true)}
                        >
                            <Image
                                src={"/images/sales/plus.svg"}
                                width={24}
                                height={24}
                                alt="Plus icon"
                            />
                        </button>
                    </div>

                    {/*<DragDropContext onDragEnd={onDragEnd}>*/}
                    {/*    <div className="w-full mt-6 flex gap-6 overflow-x-auto ">*/}
                    {/*        {columns.map((col) => (*/}
                    {/*            <TicketColumn*/}
                    {/*                key={col}*/}
                    {/*                title={col}*/}
                    {/*                route={"/sales-agent/spare-parts"}*/}
                    {/*                tickets={tickets.filter((t) => t.status === col)}*/}
                    {/*            />*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</DragDropContext>*/}

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                        <div className="w-full mt-6 flex gap-6 overflow-x-auto pb-4 items-start">
                            {columns.map((col) => (
                                <TicketColumn
                                    key={col}
                                    title={col}
                                    route={"/sales-agent/spare-parts"}
                                    tickets={tickets.filter((t) => t.status === col)}
                                />
                            ))}
                        </div>

                        {isMounted && typeof document !== "undefined"
                            ? createPortal(
                                <DragOverlay>
                                    {activeTicket ? (
                                        <TicketCard
                                            {...activeTicket}
                                            isOverlay={true}
                                        />
                                    ) : null}
                                </DragOverlay>,
                                document.body
                            )
                            : null
                        }

                    </DndContext>


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

                                {reminderData?.data.map((item:any, idx: number) => (
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

            {/*{isReminderModalOpen && (*/}
            {/*    <Modal*/}
            {/*        title="Add New Reminder"*/}
            {/*        onClose={() => setReminderModalOpen(false)}*/}
            {/*        actionButton={{*/}
            {/*            label: "Save",*/}
            {/*            onClick: () => {*/}
            {/*                console.log("Reminder saved:", {*/}
            {/*                    reminderTitle,*/}
            {/*                    reminderDate,*/}
            {/*                    reminderNote,*/}
            {/*                });*/}
            {/*                setReminderTitle("");*/}
            {/*                setReminderDate("");*/}
            {/*                setReminderNote("");*/}
            {/*                setReminderModalOpen(false);*/}
            {/*            },*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Task Title</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    value={reminderTitle}*/}
            {/*                    onChange={(e) => setReminderTitle(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Task Date</label>*/}
            {/*                <input*/}
            {/*                    type="date"*/}
            {/*                    value={reminderDate}*/}
            {/*                    onChange={(e) => setReminderDate(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="block mb-2 font-medium">Note</label>*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    value={reminderNote}*/}
            {/*                    onChange={(e) => setReminderNote(e.target.value)}*/}
            {/*                    className="w-[400px] max-[1345px]:w-[280px] h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Modal>*/}
            {/*)}*/}

            {isAddSaleModalOpen && (
                <Modal
                    title="Add New Sale"
                    onClose={() => setIsAddSaleModalOpen(false)}
                    actionButton={{
                        label: "Add",
                        onClick: handleCreateSale,
                        // disabled: createSaleMutation.isPending,
                    }}
                    isPriorityAvailable={false} // Not used for sales
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                        <div>
                            <label className="block mb-2 font-medium">Sale Date</label>
                            <input
                                type="date"
                                value={saleDate}
                                onChange={(e) => setSaleDate(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Customer ID</label>
                            <input
                                type="text"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="e.g., CUS123"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Call Agent ID</label>
                            <input
                                type="number"
                                value={callAgentId}
                                onChange={(e) => setCallAgentId(parseInt(e.target.value))}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="e.g., 1"
                            />
                        </div>
                        {/* Spacer */}
                        <div></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
                        <div>
                            <label className="block mb-2 font-medium">Vehicle Make</label>
                            <Select
                                options={vehicleMakes}
                                placeholder="Select Vehicle Make"
                                isSearchable
                                value={selectedMake}
                                onChange={(option) => {
                                    setSelectedMake(option);
                                    setVehicleMake(option?.value || "");
                                }}
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
                        <div>
                            <label className="block mb-2 font-medium">Vehicle Model</label>
                            <Select
                                options={vehicleModels}
                                placeholder="Select Vehicle Model"
                                isSearchable
                                value={selectedModel}
                                onChange={(option) => {
                                    setSelectedModel(option);
                                    setVehicleModel(option?.value || "");
                                }}
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
                        <div>
                            <label className="block mb-2 font-medium">Part No.</label>
                            <Select
                                options={partNos}
                                placeholder="Select Part No."
                                isSearchable
                                value={selectedPartNo}
                                onChange={(option) => {
                                    setSelectedPartNo(option);
                                    setPartNo(option?.value || "");
                                }}
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
                        <div>
                            <label className="block mb-2 font-medium">Year of Manufacture</label>
                            <input
                                type="number"
                                value={yearOfManufacture}
                                onChange={(e) => setYearOfManufacture(e.target.value)}
                                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                                placeholder="e.g., 2020"
                            />
                        </div>
                    </div>
                    {/* Additional Note */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
                        <div className="md:col-span-4">
                            <label className="block mb-2 font-medium">Additional Note</label>
                            <textarea
                                value={additionalNote}
                                onChange={(e) => setAdditionalNote(e.target.value)}
                                className="w-full h-[120px] rounded-[20px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 py-2"
                                placeholder="Enter additional notes here..."
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

