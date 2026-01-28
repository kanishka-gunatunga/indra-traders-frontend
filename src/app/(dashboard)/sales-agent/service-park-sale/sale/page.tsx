/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Modal from "@/components/Modal";
import Header from "@/components/Header";
import RedSpinner from "@/components/RedSpinner";
import { TicketCard, TicketCardProps } from "@/components/TicketCard";
import { TicketColumn } from "@/components/TicketColumn";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Role } from "@/types/role";
import {
    useAssignToSalesAgent,
    useNearestReminders,
    useUpdateSaleStatus,
    useVehicleSales,
    useAssignToSale
} from "@/hooks/useServicePark";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import Toast from "@/components/Toast";
import { createPortal } from "react-dom";
import { useCurrentUser } from "@/utils/auth";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/FormField";

type OptionType = { value: string; label: string };

import StatCard from "@/components/StatCard";
import { Table, Dropdown, MenuProps } from "antd";
import { MoreHorizontal, Phone, Mail, Eye, Search, LayoutGrid, List } from "lucide-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const selfAssignServiceSchema = z.object({
    customer_name: z.string().min(1, "Customer Name is required"),
    contact_number: z.string().min(1, "Valid Contact Number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().min(1, "City is required"),
    lead_source: z.string().min(1, "Lead Source is required"),
    vehicle_type: z.string().optional(),
    vehicle_make: z.string().min(1, "Make is required"),
    vehicle_model: z.string().min(1, "Model is required"),
    remark: z.string().optional(),
});

export type SelfAssignServiceFormData = z.infer<typeof selfAssignServiceSchema>;

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

type MappedTicket = {
    id: string;
    dbId: number;
    priority: number;
    user: string;
    ticketNumber: string;
    phone: string;
    email: string;
    date: string;
    rawDate: string;
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
    ticketNumber: apiSale.ticket_number,
    phone: apiSale.customer?.phone_number || "",
    email: apiSale.customer?.email || "",
    date: new Date(apiSale.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    rawDate: apiSale.date,
    status: mapStatus(apiSale.status),
});


export default function SalesDashboard() {
    const [role, setRole] = useState<Role>(
        process.env.NEXT_PUBLIC_USER_ROLE as Role
    );

    const user = useCurrentUser();

    const userId = Number(user?.id || 1);
    const userRole = user?.user_role;
    const isLevel1 = userRole === "SALES01";

    const [tickets, setTickets] = useState<MappedTicket[]>([]);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [priority, setPriority] = useState("P0");

    const [customerName, setCustomerName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [leadSource, setLeadSource] = useState("");
    const [remark, setRemark] = useState("");
    // const [priority, setPriority] = useState("P0");
    const [vehicleType, setVehicleType] = useState("");
    const [selectedMake, setSelectedMake] = useState<OptionType | null>(null);
    const [selectedModel, setSelectedModal] = useState<OptionType | null>(null);

    // Filter & View State
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All Status");
    const [filterPriority, setFilterPriority] = useState("All Priorities");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
    const filterRef = React.useRef<HTMLDivElement>(null);

    const [isMounted, setIsMounted] = useState(false);

    const [activeId, setActiveId] = useState<string | null>(null);

    const { toast, showToast, hideToast } = useToast();

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const filters = React.useMemo(() => ({
        search: debouncedSearchTerm,
        priority: filterPriority === "All Priorities" ? undefined : filterPriority,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
        status: filterStatus === "All Status" ? undefined : filterStatus
    }), [debouncedSearchTerm, filterPriority, dateFrom, dateTo, filterStatus]);


    const { data: apiSales, isLoading, isError } = useVehicleSales(undefined, userId, userRole, filters);
    console.log("----- sale details: ", apiSales);

    const { data: reminderData, isLoading: reminderLoading, error: reminderError } = useNearestReminders(userId);

    const updateStatusMutation = useUpdateSaleStatus();
    const assignMutation = useAssignToSalesAgent();

    const assignToSaleMutation = useAssignToSale();

    console.log("-------- reminders : ", reminderData);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SelfAssignServiceFormData>({
        resolver: zodResolver(selfAssignServiceSchema),
    });


    const handleSelfAssignSubmit = (data: SelfAssignServiceFormData) => {
        const payload = {
            ...data,
            sales_user_id: userId,
            is_self_assigned: true, // Tell backend this is a self-assign
            priority: parseInt(priority.replace("P", "")) || 0,
        };

        assignToSaleMutation.mutate(payload, {
            onSuccess: () => {
                showToast("Lead created successfully!", "success");
                setIsAddLeadModalOpen(false);
                reset();
                setPriority("P0");
            },
            onError: (err) => {
                console.error(err);
                showToast("Failed to create lead", "error");
            },
        });
    };


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        setIsMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (apiSales) {
            setTickets(apiSales.map(mapApiToTicket));
        }
    }, [apiSales]);

    // Ant Design Table Columns
    const tableColumns = [
        {
            title: (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    Lead ID <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ),
            dataIndex: 'id',
            key: 'id',
            sorter: (a: MappedTicket, b: MappedTicket) => a.id.localeCompare(b.id),
            render: (id: string) => <span className="font-semibold text-gray-900">{id}</span>
        },
        {
            title: (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    Name <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ),
            dataIndex: 'user',
            key: 'user',
            sorter: (a: MappedTicket, b: MappedTicket) => a.user.localeCompare(b.user),
            render: (user: string) => <span className="font-medium text-gray-900">{user}</span>
        },
        {
            title: (
                <div className="text-xs font-semibold text-gray-500 uppercase">
                    CONTACT
                </div>
            ),
            key: 'contact',
            render: (_: any, record: MappedTicket) => (
                <div className="flex flex-col">
                    <span className="text-gray-900 font-medium text-sm">{record.phone}</span>
                    <span className="text-gray-500 text-xs">{(record as any).email || `${record.user.toLowerCase().replace(" ", ".")}@email.com`}</span>
                </div>
            )
        },
        {
            title: (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    Status <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ),
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: MappedTicket) => {
                let colorClass = "bg-gray-100 text-gray-800";
                if (status === 'Won') colorClass = "bg-[#ECFDF3] text-[#027A48]";
                if (status === 'Lost') colorClass = "bg-[#F2F4F7] text-[#344054]";
                if (status === 'Ongoing') colorClass = "bg-[#FFFAEB] text-[#B54708]";
                if (status === 'New') colorClass = "bg-[#F9FAFB] text-[#344054]";

                // Dropdown items based on allowed transitions
                const menuItems: MenuProps['items'] = (allowedTransitions[record.status] || []).map((targetStatus) => ({
                    key: targetStatus,
                    label: targetStatus,
                    onClick: () => handleStatusChange(record.id, targetStatus as MappedTicket["status"]),
                }));

                // If no allowed transitions, just show pill
                if (!menuItems.length) {
                    return (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-between w-[110px] gap-1 opacity-70 cursor-not-allowed ${colorClass}`}>
                            {status}
                        </span>
                    )
                }

                return (
                    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-between w-[110px] gap-1 cursor-pointer transition-all hover:brightness-95 ${colorClass}`}>
                            {status}
                            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </Dropdown>
                );
            },
            sorter: (a: MappedTicket, b: MappedTicket) => a.status.localeCompare(b.status),
        },
        {
            title: (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    Priority <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ),
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: number) => {
                const priorityBadges = [
                    "bg-[#FFDDD1] text-[#B54708]", // P0 
                    "bg-[#FFEFD1] text-[#B54708]", // P1
                    "bg-[#E9D7FE] text-[#6941C6]", // P2
                    "bg-[#D1E9FF] text-[#026AA2]", // P3
                ];
                const badgeStyle = priorityBadges[priority] || priorityBadges[3];

                return (
                    <span className={`px-2 py-0.5 rounded-[6px] text-xs font-medium border border-transparent ${badgeStyle}`}>
                        P{priority}
                    </span>
                );
            },
            sorter: (a: MappedTicket, b: MappedTicket) => a.priority - b.priority,
        },
        {
            title: (
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
                    Date <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => <span className="text-gray-600 font-medium">{date}</span>,
            sorter: (a: MappedTicket, b: MappedTicket) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
        },
        {
            title: (
                <div className="text-xs font-semibold text-gray-500 uppercase">
                    ACTIONS
                </div>
            ),
            key: 'actions',
            render: (_: any, record: MappedTicket) => (
                <div className="flex items-center gap-4 text-gray-500">
                    <button className="hover:text-blue-600 transition-colors"><Phone size={16} /></button>
                    <button className="hover:text-blue-600 transition-colors"><Mail size={16} /></button>
                    <button className="hover:text-blue-600 transition-colors"><Eye size={16} /></button>
                    <button className="hover:text-gray-800 transition-colors"><MoreHorizontal size={16} /></button>
                </div>
            )
        }
    ];

    // Derived State: Filtering
    const filteredTickets = tickets;

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Derived State: Stats
    const totalLeads = tickets.length;
    const newLeads = tickets.filter((t) => t.status === "New").length;
    const wonDeals = tickets.filter((t) => t.status === "Won").length;
    const lostDeals = tickets.filter((t) => t.status === "Lost").length;

    const allowedTransitions: Record<
        TicketCardProps["status"],
        TicketCardProps["status"][]
    > = {
        New: ["Ongoing"],
        Ongoing: ["Won", "Lost"],
        Won: ["Ongoing"],
        Lost: ["Ongoing"],
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
    //
    //     setTickets((prev) =>
    //         prev.map((t) => {
    //             if (t.id !== draggableId) return t;
    //             const currentStatus = t.status;
    //             const newStatus = destination.droppableId as TicketCardProps["status"];
    //             if (allowedTransitions[currentStatus].includes(newStatus)) {
    //                 return {...t, status: newStatus};
    //             }
    //             return t;
    //         })
    //     );
    // };

    const handleStatusChange = (ticketId: string, newStatus: MappedTicket["status"]) => {
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
        updatedTickets[ticketIndex] = { ...ticket, status: newStatus };
        setTickets(updatedTickets);

        if (currentStatus === "New" && newStatus === "Ongoing") {
            assignMutation.mutate(
                {
                    saleId: ticket.dbId,
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const ticketId = active.id as string;
        const newStatus = over.id as MappedTicket["status"];

        handleStatusChange(ticketId, newStatus);
    }

    const activeTicket = tickets.find((t) => t.id === activeId);

    const columns: TicketCardProps["status"][] = [
        "New",
        "Ongoing",
        "Won",
        "Lost",
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
        return (
            <div className="h-screen flex items-center justify-center">
                <RedSpinner />
            </div>
        );
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
                    name={user?.full_name || "Sophie Eleanor"}
                    location={user?.branch || "Bambalapitiya"}
                    title="Indra Service Park Sales Dashboard"
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Leads" count={totalLeads} percentage="+12% from last month" icon="users" color="bg-blue-500" />
                    <StatCard title="New Leads" count={newLeads} percentage="+8% from last week" icon="trending-up" color="bg-orange-500" />
                    <StatCard title="Won Deals" count={wonDeals} percentage="31.5% conversion rate" icon="check-circle" color="bg-green-500" />
                    <StatCard title="Lost Deals" count={lostDeals} percentage="-3% from last month" icon="x-circle" color="bg-red-500" />
                </div>

                {/* Controls Section */}
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Search */}
                        <div className="relative w-full flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            <input
                                type="text"
                                placeholder="Search leads by name, phone, or ID..."
                                className="w-full pl-12 pr-4 py-3 rounded-[20px] bg-white border border-[#E0E0E0] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-[#667085]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Filter Toggle */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFilterOpen(!isFilterOpen);
                                }}
                                className={`flex items-center cursor-pointer gap-2 px-6 py-3 border rounded-[20px] transition-colors ${isFilterOpen
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-white border-[#E0E0E0] text-[#344054] hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
                                    <span className="font-medium">Filters</span>
                                </div>
                            </button>

                            {isLevel1 && (
                                <button
                                    className="flex flex-row items-center cursor-pointer gap-2 px-6 py-3 bg-[#DB2727] text-white rounded-[20px] hover:bg-red-700 transition shadow-lg shadow-red-500/30"
                                    onClick={() => setIsAddLeadModalOpen(true)}
                                >
                                    <Image
                                        src={"/plus.svg"}
                                        width={24}
                                        height={24}
                                        alt="Plus icon"
                                    />
                                    <span className="font-medium whitespace-nowrap">Add Lead</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expandable Filter Section */}
                    {isFilterOpen && (
                        <div ref={filterRef} className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <div className="relative">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-red-100 bg-white"
                                        >
                                            <option>All Status</option>
                                            <option value="New">New</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Won">Won</option>
                                            <option value="Lost">Lost</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-500">Priority</label>
                                    <div className="relative">
                                        <select
                                            value={filterPriority}
                                            onChange={(e) => setFilterPriority(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-red-100 bg-white"
                                        >
                                            <option>All Priorities</option>
                                            <option value="P1">P1 - High</option>
                                            <option value="P2">P2 - Medium</option>
                                            <option value="P3">P3 - Low</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-500">Date From</label>
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-500">Date To</label>
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Leads Section */}
                <section
                    className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] p-6 min-h-[500px]">
                    <div className="w-full flex justify-between items-center mb-6 px-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-[22px]">
                                {viewMode === "kanban" ? "Leads Board" : `All Leads (${filteredTickets.length})`}
                            </span>
                            <div className="text-sm text-gray-500">
                                Showing {filteredTickets.length} of {totalLeads} leads
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-white rounded-[14px] border border-gray-200 p-1">
                            <button
                                onClick={() => setViewMode("kanban")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${viewMode === "kanban" ? "bg-red-50 text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <LayoutGrid size={16} />
                                Kanban
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${viewMode === "table" ? "bg-red-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                Table
                            </button>
                        </div>
                    </div>

                    {viewMode === "kanban" ? (
                        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="w-full grid grid-cols-4 gap-4 items-start min-h-[400px]">
                                {columns.map((col) => (
                                    <TicketColumn
                                        key={col}
                                        title={col}
                                        route={"/sales-agent/service-park-sale/sale"}
                                        tickets={filteredTickets.filter((t) => t.status === col)}
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
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <Table
                                    columns={tableColumns}
                                    dataSource={paginatedTickets}
                                    rowKey="dbId"
                                    pagination={false}
                                />
                            </div>

                            {/* Custom Pagination */}
                            <div className="flex justify-between items-center px-4 w-full">
                                <span className="text-gray-500 text-sm font-medium">
                                    Page {currentPage} of {totalPages || 1}
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages || 1) }).map((_, idx) => {
                                        const pageNum = idx + 1;
                                        // Simple pagination logic for now
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border
                                                    ${currentPage === pageNum
                                                        ? 'bg-[#E52F2F] text-white border-[#E52F2F]'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                            <hr className="border-gray-300 my-4" />

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {reminderData?.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`flex ${idx > 0 ? "mt-3" : ""
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
                            <hr className="border-gray-300 my-4" />

                            <div className="h-[100] overflow-y-auto no-scrollbar">
                                {/* Table rows */}
                                {upcomingEventsData?.map((item, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`flex ${idx > 0 ? "mt-3" : ""
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




            {
                isAddLeadModalOpen && (
                    <Modal
                        title="Add New Lead"
                        onClose={() => setIsAddLeadModalOpen(false)}
                        actionButton={{
                            label: isSubmitting ? "Adding..." : "Add",
                            onClick: () => handleSubmit(handleSelfAssignSubmit)(),
                        }}
                        priority={priority}
                        onPriorityChange={setPriority}
                        isPriorityAvailable={true}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-6">
                            <FormField label="Customer Name" placeholder="Customer Name"
                                register={register("customer_name")} error={errors.customer_name} />
                            <FormField label="Contact No" placeholder="Contact No" register={register("contact_number")}
                                error={errors.contact_number} />
                            <FormField label="Email" placeholder="Email" register={register("email")} error={errors.email} />
                            <FormField label="City" placeholder="City" register={register("city")} error={errors.city} />
                        </div>

                        {/* Lead Source & Vehicle Type */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-6">
                            <FormField
                                label="Lead Source"
                                type="select"
                                options={[{ value: "Direct Call", label: "Direct Call" }, {
                                    value: "Walk In",
                                    label: "Walk In"
                                }]}
                                register={register("lead_source")}
                                error={errors.lead_source}
                            />
                            <FormField
                                label="Vehicle Type"
                                type="select"
                                options={[{ value: "SUV", label: "SUV" }, { value: "Sedan", label: "Sedan" }]}
                                register={register("vehicle_type")}
                                error={errors.vehicle_type}
                            />
                            <FormField
                                label="Vehicle Make"
                                type="select"
                                isIcon={true}
                                options={vehicleMakes}
                                register={register("vehicle_make")}
                                error={errors.vehicle_make}
                            />
                            <FormField
                                label="Vehicle Model"
                                type="select"
                                isIcon={true}
                                options={vehicleModels}
                                register={register("vehicle_model")}
                                error={errors.vehicle_model}
                            />
                        </div>

                        {/* Remark */}
                        <div className="w-full">
                            <label className="block mb-2 font-medium text-gray-700">Remark</label>
                            <textarea
                                {...register("remark")}
                                className="w-full h-[100px] rounded-[20px] bg-[#FFFFFF80] border border-gray-300 p-4 focus:outline-none"
                                placeholder="Remark"
                            />
                        </div>
                    </Modal>
                )
            }
        </div >
    );
}