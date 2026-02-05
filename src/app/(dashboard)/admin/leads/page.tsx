/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import { TicketCardProps, TicketCard } from "@/components/TicketCard";
import { TicketColumn } from "@/components/TicketColumn";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useLeads } from "@/hooks/useLeads";
import { useCurrentUser } from "@/utils/auth";
import { useDebounce } from "@/hooks/useDebounce";
import { Table, Dropdown, MenuProps } from "antd";
import { MoreHorizontal, Phone, Mail, Eye, Search, LayoutGrid } from "lucide-react";
import RedSpinner from "@/components/RedSpinner";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

const priorityOptions = ["P0", "P1", "P2", "P3", "P4", "P5"];
const departmentOptions = ["ITPL", "ISP", "IMS", "IFT"];

type MappedTicket = TicketCardProps & {
  rawDate: Date; // For sorting if needed locally
};

export default function Leads() {

  const user = useCurrentUser();
  const { toast, showToast, hideToast } = useToast();

  // --- States ---
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterPriority, setFilterPriority] = useState("All Priority");
  const [department, setDepartment] = useState("All Departments");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filterRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size for now

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // --- Query ---
  const filters = React.useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
    status: filterStatus === "All Status" ? undefined : filterStatus,
    priority: filterPriority === "All Priority" ? undefined : filterPriority,
    department: department === "All Departments" ? undefined : department,
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
  }), [currentPage, pageSize, debouncedSearchTerm, filterStatus, filterPriority, department, dateFrom, dateTo]);

  // Reset page when filters change (except page itself)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterStatus, filterPriority, department, dateFrom, dateTo]);


  const { data: leadsResponse, isLoading } = useLeads(filters);
  // const updateStatusMutation = useUpdateLeadStatus(); // Removed as per request

  const leads = leadsResponse?.data || [];
  const meta = leadsResponse?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // const [activeId, setActiveId] = useState<string | null>(null); // No drag needed

  // --- Map data ---
  const tickets = React.useMemo(() => {
    if (!leads) return [];

    return leads.map((lead: any) => {
      let route;
      let categoryTag = "ITPL";

      switch (lead.type) {
        case 'BYD':
          route = "/sales-agent/byd-sales";
          categoryTag = "BYD";
          break;
        case 'VEHICLE':
          route = "/sales-agent/sales";
          categoryTag = "ITPL";
          break;
        case 'FAST_TRACK':
          route = "/sales-agent/fast-track";
          categoryTag = "IFT";
          break;
        case 'SPARE_PART':
          route = "/sales-agent/spare-parts";
          categoryTag = "IMS";
          break;
        case 'SERVICE_PARK':
          route = "/sales-agent/service-park-sale/sale";
          categoryTag = "ISP";
          break;
        default:
          route = "/sales-agent/byd-sales";
      }

      return {
        id: lead.ticket_number, // This is "TYPE_ID" string
        dbId: lead.original_id,
        priority: lead.priority,
        user: lead.user,
        ticketNumber: lead.ticket_number,
        categoryTag: categoryTag,
        phone: lead.phone,
        date: lead.date,
        rawDate: new Date(lead.date),
        status: (["New", "Ongoing", "Won", "Lost"].includes(lead.status) ? lead.status : "New") as any,
        route: route
      };
    });
  }, [leads]);


  // --- Dnd Logic ---
  // Dnd sensors setup still required for TicketCard useDraggable hook init internally (even if disabled)
  // unless we remove DndContext? If we remove DndContext, useDraggable throws.
  // So kept minimal setup but no Drag Overlay or handlers needed really if disabled.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    // Disabled
  };

  const activeTicket = null; // No active ticket dragging
  const columns = ["New", "Ongoing", "Won", "Lost"];

  // --- Table Columns ---
  const tableColumns = [
    {
      title: (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
          Lead ID
        </div>
      ),
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (text: string) => <span className="font-semibold text-gray-900">{text}</span>
    },
    {
      title: (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
          Name
        </div>
      ),
      dataIndex: 'user',
      key: 'user',
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
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
          Category
        </div>
      ),
      dataIndex: 'categoryTag',
      key: 'categoryTag',
      render: (tag: string) => (
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">{tag}</span>
      )
    },
    {
      title: (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
          Status
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let colorClass = "bg-gray-100 text-gray-800";
        if (status === 'Won') colorClass = "bg-[#ECFDF3] text-[#027A48]";
        if (status === 'Lost') colorClass = "bg-[#F2F4F7] text-[#344054]";
        if (status === 'Ongoing') colorClass = "bg-[#FFFAEB] text-[#B54708]";
        if (status === 'New') colorClass = "bg-[#F9FAFB] text-[#344054]";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-[100px] ${colorClass}`}>
            {status}
          </span>
        );
      }
    },
    {
      title: (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase">
          Priority
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
          <span
            className={`px-2 py-0.5 rounded-[6px] text-xs font-medium border border-transparent ${badgeStyle}`}>
            P{priority}
          </span>
        );
      }
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
        </div>
      )
    }
  ];

  if (isLoading && !tickets.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E6E6E6B2]/70 backdrop-blur-md">
        <RedSpinner />
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden pb-10">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />

      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        {/*<Header*/}
        {/*  name={user?.full_name || "Sophie Eleanor"}*/}
        {/*  title="All Leads"*/}
        {/*/>*/}

        {/* Controls Section (Search, Filters, View Toggle) */}
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search and Filters same as before */}
            <div className="relative w-full flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20} />
              <input
                type="text"
                placeholder="Search leads by ticket no, name or phone..."
                className="w-full pl-12 pr-4 py-3 rounded-[20px] bg-white border border-[#E0E0E0] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-[#667085]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 py-3 border cursor-pointer rounded-[20px] transition-colors ${isFilterOpen
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-[#E0E0E0] text-[#344054] hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Filters</span>
                </div>
              </button>
            </div>
          </div>


          {isFilterOpen && (
            <div ref={filterRef}
              className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100">
                    <option>All Status</option>
                    <option value="New">New</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100">
                    <option>All Priority</option>
                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-100">
                    <option>All Departments</option>
                    {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-500">Date Range</label>
                  <div className="flex gap-2">
                    <input type="date" value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-1/2 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                      className="w-1/2 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-100" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <section
          className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] p-6 min-h-[500px]">
          <div className="w-full flex justify-between items-center mb-6 px-4">
            <div className="flex flex-col">
              <span className="font-semibold text-[22px]">
                {viewMode === "kanban" ? "Leads Board" : `All Leads (${meta.total})`}
              </span>
              <div className="text-sm text-gray-500">
                Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} leads
              </div>
            </div>

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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                Table
              </button>
            </div>


            {isLoading && <div className="text-red-500 text-sm font-medium">Updating...</div>}
          </div>

          {viewMode === "kanban" ? (
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="w-full grid grid-cols-4 gap-4 items-start min-h-[400px]">
                {columns.map((col) => (
                  <TicketColumn
                    key={col}
                    title={col}
                    tickets={tickets.filter((t: MappedTicket) => t.status === col)}
                    draggable={false} // Disable dragging for Admin
                  />
                ))}
              </div>
              {/* DragOverlay removed as it won't be triggered */}
            </DndContext>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Table
                  columns={tableColumns}
                  dataSource={tickets}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            </div>
          )}

          {/* Pagination Controls ... (kept same) */}
          <div className="flex justify-between items-center px-4 w-full mt-6">
            <span className="text-gray-500 text-sm font-medium">
              Page {meta.page} of {meta.totalPages || 1}
            </span>
            {/* ... pagination buttons ... */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={meta.page === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, meta.totalPages || 1) }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border cursor-pointer
                                      ${meta.page === pageNum
                        ? 'bg-[#E52F2F] text-white border-[#E52F2F]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page === meta.totalPages}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
