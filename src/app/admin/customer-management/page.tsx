"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useState } from "react";

const customerData = [
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    vehicleNo: ["CAB - 4875", "CAB - 1234"],
    branch: "Kandy",
    customerType: "Individual",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    vehicleNo: ["CAB - 4875", "CAB - 1234"],
    branch: "Kandy",
    customerType: "Individual",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    vehicleNo: ["CAB - 4875", "CAB - 1234"],
    branch: "Kandy",
    customerType: "Individual",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    vehicleNo: ["CAB - 4875", "CAB - 1234"],
    branch: "Kandy",
    customerType: "Individual",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    vehicleNo: ["CAB - 4875", "CAB - 1234"],
    branch: "Kandy",
    customerType: "Individual",
  },
  {
    fullName: "Jane Doe",
    contact: "071 1234567",
    email: "Jane@indra.com",
    vehicleNo: ["CAB - 9999"],
    branch: "Colombo",
    customerType: "Corporate",
  },
];

const customerType = ["Individual", "Corporate", "Garage"];
const leadSource = ["Direct call", "Walk-in", "Facebook", "Website"];
const branches = ["Bambalapitiya", "Kandy", "Jaffna", "Galle", "Negombo"];

export default function CustomerManagement() {
  const [isCustomerFilterModalOpen, setIsCustomerFilterModalOpen] =
    useState(false);

  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] =
    useState(false);

  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<string[]>(
    []
  );
  const [selectedLeadSources, setSelectedLeadSources] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
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
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
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
                  {customerData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                      onClick={() => setIsCustomerDetailsModalOpen(true)}
                    >
                      <div className="w-1/6 px-3 py-2">{item.fullName}</div>
                      <div className="w-1/6 px-3 py-2">{item.contact}</div>
                      <div className="w-1/6 px-3 py-2">{item.email}</div>
                      <div className="w-1/6 px-3 py-2 relative">
                        {item.vehicleNo.length > 1 ? (
                          <div className="relative group">
                            {/* Visible text + arrow */}
                            <div className="flex items-center gap-3 cursor-pointer select-none">
                              <span>{item.vehicleNo[0]}</span>
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

                            {/* Dropdown menu */}
                            <div className="absolute left-0 mt-1 w-max bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all z-10">
                              {item.vehicleNo.map((v, i) => (
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
                          item.vehicleNo[0]
                        )}
                      </div>

                      <div className="w-1/6 px-3 py-2">{item.branch}</div>
                      <div className="w-1/6 px-3 py-2">{item.customerType}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Customer Filter Modal */}
      {isCustomerFilterModalOpen && (
        <Modal
          title="Filter"
          onClose={() => setIsCustomerFilterModalOpen(false)}
          actionButton={{
            label: "Apply",
            onClick: () => {
              console.log("Selected Types:", selectedCustomerTypes);
              console.log("Selected Lead Source:", selectedLeadSources);
              console.log("Selected Branches:", selectedBranches);
              setSelectedCustomerTypes([]);
              setSelectedLeadSources([]);
              setSelectedBranches([]);
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
              {customerType.map((type) => {
                const isSelected = selectedCustomerTypes.includes(type);
                return (
                  <div
                    key={type}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${
                        isSelected ? "bg-blue-500 text-white border-none" : ""
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
              Department
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {leadSource.map((source) => {
                const isSelected = selectedLeadSources.includes(source);
                return (
                  <div
                    key={source}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${
                        isSelected ? "bg-blue-500 text-white border-none" : ""
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
              {branches.map((branch) => {
                const isSelected = selectedBranches.includes(branch);
                return (
                  <div
                    key={branch}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                      ${
                        isSelected ? "bg-blue-500 text-white border-none" : ""
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

      {isCustomerDetailsModalOpen && (
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
                Devon Lane
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                NIC No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                982345678V
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Gender:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                Male
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Contact No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                077 5898712
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Vehicle No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                CAB - 4875
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Customer Type:
              </div>
              <div className="flex-1 relative min-w-0">
                <select
                  className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"
                  defaultValue="Individual"
                >
                  <option>Individual</option>
                  <option>Corporate</option>
                  <option>Garage</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Whatsapp No:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                077 5898712
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Branch:
              </div>
              <div className="flex-1 relative min-w-0">
                <select
                  className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"
                  defaultValue="Bambalapitiya"
                >
                  <option>Bambalapitiya</option>
                  <option>Ratnapura</option>
                  <option>Kandy</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                  </svg>
                </span>
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Profession:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                Engineer
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Email:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                Devon@info.com
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                City:
              </div>
              <div className="flex-1 text-lg text-[#575757] break-words min-w-0">
                Maharagama
              </div>

              <div className="flex-shrink-0 w-[150px] text-lg font-semibold">
                Lead Source:
              </div>
              <div className="flex-1 relative min-w-0">
                <select
                  className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"
                  defaultValue="Direct Call"
                >
                  <option>Direct Call</option>
                  <option>Walk-in</option>
                  <option>Facebook</option>
                  <option>Website</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
