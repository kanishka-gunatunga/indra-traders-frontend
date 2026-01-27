"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import { useCustomers } from "@/hooks/useCustomers";
import { useCurrentUser } from "@/utils/auth";
import Image from "next/image";
import React, { useState } from "react";

const customerTypeOptions = ["INDIVIDUAL", "COMPANY"];
const leadSourceOptions = ["Direct call", "Walk-in", "Facebook", "Website"];
const branchOptions = ["Bambalapitiya", "Kandy", "Jaffna", "Galle", "Negombo"];

export default function CustomerManagement() {

  const user = useCurrentUser();

  const [isCustomerFilterModalOpen, setIsCustomerFilterModalOpen] = useState(false);
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);

  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<string[]>([]);
  const [selectedLeadSources, setSelectedLeadSources] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Search state? The UI doesn't have a search bar visible in the code I seeing, 
  // but I can add one or just rely on filters for now.
  // The filter modal has checkboxes.

  // Construct filters object
  const filters: any = {};
  if (selectedCustomerTypes.length > 0) filters.type = selectedCustomerTypes;
  if (selectedLeadSources.length > 0) filters.source = selectedLeadSources;
  if (selectedBranches.length > 0) filters.branch = selectedBranches;

  const { data, isLoading } = useCustomers(currentPage, ITEMS_PER_PAGE, filters);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const handleRowClick = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCustomerDetailsModalOpen(true);
  };

  const Pagination = ({ currentPage, totalItems, onPageChange }: { currentPage: number, totalItems: number, onPageChange: (page: number) => void }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Previous
        </button>

        {Array.from({ length: Math.min(5, totalPages || 1) }).map((_, idx) => {
          // Start page window logic to show current page in view
          let startPage = Math.max(1, currentPage - 2);
          if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4);

          const pageNum = startPage + idx;
          if (pageNum > totalPages) return null;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border cursor-pointer
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
          className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">

        <Header
          name={user?.full_name || "Sophie Eleanor"}
          title="Customer Management"
        />

        {/* Customer Management Section */}
        <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">
              Customer Management
            </span>
            <div className="flex gap-5">
              <button
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => {
                  setIsCustomerFilterModalOpen(true);
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
          </div>
          <div className="w-full mt-5 ">
            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
              <div className="min-w-[1000px] ">
                {/* Table header */}
                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                  <div className="w-1/6 px-3 py-2">Name</div>
                  <div className="w-1/6 px-3 py-2">Contact No.</div>
                  <div className="w-1/6 px-3 py-2">Email</div>
                  <div className="w-1/6 px-3 py-2">Vehicle No.</div>
                  <div className="w-1/6 px-3 py-2">Branch</div>
                  <div className="w-1/6 px-3 py-2">Customer Type</div>
                </div>

                {/* Table body (scrollable vertically) */}
                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">Loading...</div>
                  ) : (
                    data?.data?.map((item: any, idx: number) => {
                      // Assuming vehicle_number is comma separated string or actual string
                      const vehicles = item.vehicle_number ? item.vehicle_number.split(',') : [];
                      return (
                        <div
                          key={idx}
                          className="flex text-lg mt-1 text-black hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => handleRowClick(item)}
                        >
                          <div className="w-1/6 px-3 py-2">{item.customer_name}</div>
                          <div className="w-1/6 px-3 py-2">{item.phone_number}</div>
                          <div className="w-1/6 px-3 py-2 break-all flex items-center">{item.email || "-"}</div>
                          <div className="w-1/6 px-3 py-2 relative">
                            {vehicles.length > 1 ? (
                              <div className="relative group">
                                <div className="flex items-center gap-3 cursor-pointer select-none">
                                  <span>{vehicles[0]}</span>
                                  <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                                  </svg>
                                </div>
                                <div className="absolute left-0 mt-1 w-max bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all z-10">
                                  {vehicles.map((v: string, i: number) => (
                                    <div
                                      key={i}
                                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap text-left"
                                    >
                                      {v}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              vehicles[0] || '-'
                            )}
                          </div>

                          <div className="w-1/6 px-3 py-2">{item.convenient_branch || "-"}</div>
                          <div className="w-1/6 px-3 py-2">{item.customer_type || "-"}</div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={data?.meta?.total || 0}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </main>

      {/* Customer Filter Modal */}
      {isCustomerFilterModalOpen && (
        <Modal
          title="Filter"
          onClose={() => setIsCustomerFilterModalOpen(false)}
          actionButton={{
            label: "Apply Filter",
            onClick: () => {
              // Filters are applied automatically via state, but we can close modal here
              // actually the state is updated on click of options, so we just close
              setIsCustomerFilterModalOpen(false);
            },
          }}
        >
          {/* --- User Type --- */}
          <div className="w-full">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              User Role
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {customerTypeOptions.map((type) => {
                const isSelected = selectedCustomerTypes.includes(type);
                return (
                  <div
                    key={type}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${isSelected ? "bg-blue-500 text-white border-none" : ""
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCustomerTypes(
                          selectedCustomerTypes.filter((r) => r !== type)
                        );
                      } else {
                        setSelectedCustomerTypes([
                          ...selectedCustomerTypes,
                          type,
                        ]);
                      }
                    }}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Lead Source --- */}
          <div className="w-full mt-5">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              lead source
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {leadSourceOptions.map((source) => {
                const isSelected = selectedLeadSources.includes(source);
                return (
                  <div
                    key={source}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${isSelected ? "bg-blue-500 text-white border-none" : ""
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedLeadSources(
                          selectedLeadSources.filter((d) => d !== source)
                        );
                      } else {
                        setSelectedLeadSources([
                          ...selectedLeadSources,
                          source,
                        ]);
                      }
                    }}
                  >
                    {source}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Branch --- */}
          <div className="w-full mt-5">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              Branch
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {branchOptions.map((branch) => {
                const isSelected = selectedBranches.includes(branch);
                return (
                  <div
                    key={branch}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${isSelected ? "bg-blue-500 text-white border-none" : ""
                      }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedBranches(
                          selectedBranches.filter((b) => b !== branch)
                        );
                      } else {
                        setSelectedBranches([...selectedBranches, branch]);
                      }
                    }}
                  >
                    {branch}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {isCustomerDetailsModalOpen && selectedCustomer && (
        <Modal
          title="Customer Details"
          onClose={() => setIsCustomerDetailsModalOpen(false)}
          actionButton={{
            label: "",
            icon: (
              <Image
                src="/images/mdi_edit-outline.svg"
                alt="Edit"
                width={24}
                height={24}
              />
            ),
            onClick: () => {
              // Handle edit logic if needed
              setIsCustomerDetailsModalOpen(false);
            },
          }}
        >
          <div className="w-full min-w-[1000px] max-[1080px]:min-w-[800px] mt-3 space-y-2">
            {/* Row 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Customer Name:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.customer_name}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                NIC No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.id}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Gender:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.gender}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Contact No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.phone_number}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Vehicle No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.vehicle_number || "-"}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Customer Type:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.customer_type}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Whatsapp No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.whatsapp_number || "-"}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Branch:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.convenient_branch || "-"}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Profession:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.profession || "-"}
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Email:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.email || "-"}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                City:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.city || "-"}
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Lead Source:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                {selectedCustomer.lead_source || "-"}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
