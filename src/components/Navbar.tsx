/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Role } from "@/types/role";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const userTabs = [
  { label: "Customer Calls", href: "/call-agent/dashboard" },
  { label: "Vehicle Sales", href: "/call-agent/vehicle-sales" },
  { label: "Service Park", href: "/call-agent/service-park" },
  { label: "Spare Parts", href: "/call-agent/spare-parts" },
  { label: "Fast Track", href: "/call-agent/fast-track" },
];

const adminTabs = [
  { label: "User Management", href: "/admin" },
  { label: "Customer Management", href: "/admin/customer-management" },
  { label: "All Complains", href: "/admin/complains" },
  { label: "All Leads", href: "/admin/leads" },
  { label: "Unavailable Items", href: "/admin/unavailable" },
];

const Navbar = () => {
  const [role, setRole] = useState<Role>(process.env.NEXT_PUBLIC_USER_ROLE as Role);
  const tabs = role === "admin" ? adminTabs : userTabs;

  const [activeTab, setActiveTab] = useState<string>(tabs[0].href);

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 backdrop-blur-md montserrat z-50 px-6 flex items-center h-24 max-w-[1800px] mx-auto container">
        <div className="flex flex-row w-full items-center justify-between">
          {/* Logo */}
          <div className="w-20 h-20 bg-[url('/indra-logo.png')] bg-contain bg-no-repeat" />

          {/* Navigation Tabs */}
          <div className="flex-1 flex justify-center">
            <nav className="flex gap-4 overflow-x-auto no-scrollbar">
              {tabs.map(({ label, href }) => {
                const isActive = href === activeTab;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setActiveTab(href)}
                    className={`rounded-full px-5 py-3 text-[15px] font-medium whitespace-nowrap ${
                      isActive ? "bg-[#DB2727] text-white" : "text-[#1D1D1D]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-[#FFFFFFB2]/70 rounded-full flex items-center justify-center">
              {/* search icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16.893 16.92L19.973 20M19 11.5C19 13.4891 18.2098 15.3968 16.8033 16.8033C15.3968 18.2098 13.4891 19 11.5 19C9.51088 19 7.60322 18.2098 6.1967 16.8033C4.79018 15.3968 4 13.4891 4 11.5C4 9.51088 4.79018 7.60322 6.1967 6.1967C7.60322 4.79018 9.51088 4 11.5 4C13.4891 4 15.3968 4.79018 16.8033 6.1967C18.2098 7.60322 19 9.51088 19 11.5Z"
                  stroke="#575757"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="relative w-12 h-12 bg-[#FFFFFFB2]/70 rounded-full flex items-center justify-center">
              {/* bell */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.134 11C18.715 16.375 21 18 21 18H3C3 18 6 15.867 6 8.4C6 6.703 6.632 5.075 7.757 3.875C8.882 2.675 10.41 2 12 2C12.338 2 12.6713 2.03 13 2.09M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21M19 8C19.7956 8 20.5587 7.68393 21.1213 7.12132C21.6839 6.55871 22 5.79565 22 5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2C18.2044 2 17.4413 2.31607 16.8787 2.87868C16.3161 3.44129 16 4.20435 16 5C16 5.79565 16.3161 6.55871 16.8787 7.12132C17.4413 7.68393 18.2044 8 19 8Z"
                  stroke="#575757"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="19" cy="5" r="4" fill="#DB2727" />
              </svg>
            </button>

            <Image
              width={200}
              height={200}
              src="/avatar.png"
              alt="User Avatar"
              className="w-11 h-11 rounded-full object-cover"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
