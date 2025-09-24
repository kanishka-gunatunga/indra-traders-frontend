"use client";

import Header from "@/components/Header";
import Modal from "@/components/Modal";
import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const userData = [
  {
    fullName: "Guy Hawkins",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Devon Lane",
    contact: "077 5844125",
    email: "Devon@indra.com",
    role: "Call Agent",
    department: "",
    branch: "Bambalapitiya",
  },
  {
    fullName: "Arlene McCoy",
    contact: "077 3575412",
    email: "Devon@indra.com",
    role: "Call Agent",
    department: "",
    branch: "Kandy",
  },
  {
    fullName: "Eleanor Pena",
    contact: "077 5844125",
    email: "Devon@indra.com",
    role: "Sales lv 2",
    department: "IMS",
    branch: "Ratnapura",
  },
  {
    fullName: "Esther Howard",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "",
    branch: "Kandy",
  },
  {
    fullName: "Annette Black",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Robert Fox",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Esther Howard",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "",
    branch: "Kandy",
  },
  {
    fullName: "Annette Black",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Robert Fox",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Annette Black",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Robert Fox",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Esther Howard",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "",
    branch: "Kandy",
  },
  {
    fullName: "Annette Black",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
  {
    fullName: "Robert Fox",
    contact: "071 5425433",
    email: "Devon@indra.com",
    role: "Sales lv 1",
    department: "IPTL",
    branch: "Kandy",
  },
];

const userRoles = [
  "Admin",
  "Sales Lv 1",
  "Sales Lv 2",
  "Sales Lv 3",
  "Call Agent",
  "Telemarketer",
];
const departments = ["ITPL", "ISP", "IMS", "IFT"];
const branches = ["Bambalapitiya", "Kandy", "Jaffna", "Galle", "Negombo"];

export default function UserManagement() {
  const [isAddNewUserModalOpen, setIsAddNewUserModalOpen] = useState(false);
  const [isFilterUserModalOpen, setIsFilterUserModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="User Management"
        />

        {/* User Management Section */}
        <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">User Management</span>
            <div className="flex gap-5">
              <button
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                onClick={() => setIsFilterUserModalOpen(true)}
              >
                <Image
                  src={"/images/admin/flowbite_filter-outline.svg"}
                  width={24}
                  height={24}
                  alt="Filter icon"
                />
              </button>
              <button
                className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
                onClick={() => setIsAddNewUserModalOpen(true)}
              >
                <Image
                  src={"/images/sales/plus.svg"}
                  width={24}
                  height={24}
                  alt="Plus icon"
                />
              </button>
            </div>
          </div>
          <div className="w-full mt-5 ">
            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
              <div className="min-w-[1000px] ">
                {/* Table header */}
                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                  <div className="w-1/6 px-3 py-2">Full Name</div>
                  <div className="w-1/6 px-3 py-2">Contact No.</div>
                  <div className="w-1/6 px-3 py-2">Email</div>
                  <div className="w-1/6 px-3 py-2">User Role</div>
                  <div className="w-1/6 px-3 py-2">Department</div>
                  <div className="w-1/6 px-3 py-2">Branch</div>
                </div>

                {/* Table body (scrollable vertically) */}
                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                  {userData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                      onClick={() => {
                        setIsUserDetailsModalOpen(true);
                      }}
                    >
                      <div className="w-1/6 px-3 py-2">{item.fullName}</div>
                      <div className="w-1/6 px-3 py-2">{item.contact}</div>
                      <div className="w-1/6 px-3 py-2">{item.email}</div>
                      <div className="w-1/6 px-3 py-2">{item.role}</div>
                      <div className="w-1/6 px-3 py-2">
                        {item.department === "" ? "-" : item.department}
                      </div>
                      <div className="w-1/6 px-3 py-2">{item.branch}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Add New User Modal */}
      {isAddNewUserModalOpen && (
        <Modal
          title="User Management"
          onClose={() => setIsAddNewUserModalOpen(false)}
          actionButton={{
            label: "Add",
            onClick: () => {
              console.log("Saved user data:", {
                fullName,
                contactNumber,
                email,
                department,
                branch,
                userRole,
                password,
                confirmPassword,
              });
              // Reset form
              setFullName("");
              setContactNumber("");
              setEmail("");
              setBranch("");
              setDepartment("");
              setUserRole("");
              setPassword("");
              setConfirmPassword("");
              setIsAddNewUserModalOpen(false);
            },
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            <div>
              <label className="block mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4"
                placeholder="Full Name"
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
              <div>
                <label className="block mb-2 font-medium">User Role</label>
                <div className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-transparent outline-none appearance-none"
                  >
                    <option value="">User Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Sales Lv 1">Sales Lv 1</option>
                    <option value="Sales Lv 2">Sales Lv 2</option>
                    <option value="Sales Lv 3">Sales Lv 3</option>
                    <option value="Call Agent">Call Agent</option>
                    <option value="Telemarketer">Telemarketer</option>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-5">
            <div>
              <label className="block mb-2 font-medium">Department</label>
              <div className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  <option value="">Select Department</option>
                  <option value="ITPL">ITPL</option>
                  <option value="ISP">ISP</option>
                  <option value="IMS">IMS</option>
                  <option value="IFT">IFT</option>
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

            <div>
              <label className="block mb-2 font-medium">Branch</label>
              <div className="relative w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 flex items-center px-4">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  <option value="">Select Branch</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Nugegoda">Nugegoda</option>
                  <option value="Ratnapura">Hatchback</option>
                  <option value="Kandy">Kandy</option>
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

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 pr-10"
                  placeholder="Password"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[51px] rounded-[30px] bg-[#FFFFFF80] border border-black/50 backdrop-blur-[50px] px-4 pr-10"
                  placeholder="Confirm Password"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* User Filter Modal */}
      {isFilterUserModalOpen && (
        <Modal
          title="Filter"
          onClose={() => setIsFilterUserModalOpen(false)}
          actionButton={{
            label: "Apply",
            onClick: () => {
              console.log("Selected Roles:", selectedRoles);
              console.log("Selected Departments:", selectedDepartments);
              console.log("Selected Branches:", selectedBranches);
              setSelectedRoles([]);
              setSelectedDepartments([]);
              setSelectedBranches([]);
              setIsFilterUserModalOpen(false);
            },
          }}
        >
          {/* --- User Role --- */}
          <div className="w-full">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              User Role
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {userRoles.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <div
                    key={role}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRoles(
                          selectedRoles.filter((r) => r !== role)
                        );
                      } else {
                        setSelectedRoles([...selectedRoles, role]);
                      }
                    }}
                  >
                    {role}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Department --- */}
          <div className="w-full mt-5">
            <span className="font-montserrat font-semibold text-lg leading-[100%]">
              Department
            </span>
            <div className="w-full mt-5 flex gap-3 flex-wrap">
              {departments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept);
                return (
                  <div
                    key={dept}
                    className={`inline-flex items-center justify-center px-8 py-2 rounded-4xl border-b-[0.88px] bg-[#DFDFDF] opacity-[1] cursor-pointer
                ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDepartments(
                          selectedDepartments.filter((d) => d !== dept)
                        );
                      } else {
                        setSelectedDepartments([...selectedDepartments, dept]);
                      }
                    }}
                  >
                    {dept}
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
                ${isSelected ? "bg-blue-500 text-white border-none" : ""}`}
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

      {/* User Details Modal */}
      {isUserDetailsModalOpen && (
        <Modal
          title="User Details"
          onClose={() => setIsUserDetailsModalOpen(false)}
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
              setIsUserDetailsModalOpen(false);
            },
          }}
        >
          <div className="w-full min-w-[800px] mt-3 space-y-2">
            {/* Row */}
            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
              <div className="text-lg font-semibold">Full Name:</div>
              <div className="text-lg text-[#575757] break-words">
                Devon Lane
              </div>
              <div className="text-lg font-semibold">User Role:</div>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"
                  defaultValue="Sales Lv 1"
                >
                  <option>Sales Lv 1</option>
                  <option>Sales Lv 2</option>
                  <option>Sales Lv 3</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Another Row */}
            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
              <div className="text-lg font-semibold">Contact No:</div>
              <div className="text-lg text-[#575757]">077 5898712</div>
              <div className="text-lg font-semibold">Department:</div>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-transparent text-lg text-[#575757] pr-6 cursor-pointer focus:outline-none"
                  defaultValue="ITPL"
                >
                  <option>ITPL</option>
                  <option>IST</option>
                  <option>IFT</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M0 0L5 6L10 0H0Z" fill="#575757" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Email Row */}
            <div className="grid grid-cols-[150px_1fr_150px_1fr] gap-4 items-start">
              <div className="text-lg font-semibold">Email:</div>
              <div className="text-lg text-[#575757] break-words">
                Devon@infos.com
              </div>
              <div className="text-lg font-semibold">Branch:</div>
              <div className="text-lg text-[#575757]">Kandy</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
