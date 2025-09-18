"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface SalesDetailsTabProps {
  status: string;
}

export default function SalesDetailsTab({ status }: SalesDetailsTabProps) {
  const tabs = ["Follow up", "Reminders", "Events"];
  const [activeTab, setActiveTab] = useState(0);

  const followUpData = [
    { activity: "Proposed Red Color Civic", date: "12 March, 2025" },
    { activity: "Proposed FK7 Ex Tech Pack Edition", date: "10 March, 2025" },
  ];

  const reminderData = [
    {
      title: "Find FK7 Ex Techpack",
      date: "12 March, 2025",
      note: "Color White or Red",
    },
    {
      title: "Find FK7 Ex Techpack",
      date: "12 March, 2025",
      note: "Color White or Red",
    },
  ];

  const isAddDisabled = status === "New";

  return (
    <div className="w-full relative">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className={`flex-1 py-4 cursor-pointer text-lg text-center relative ${
              activeTab === index
                ? "font-medium text-[#575757]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#DB2727] rounded-t"></div>
            )}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 0 && (
          <div className="mt-8 bg-white rounded-4xl py-8 px-8 relative">
            {/* Table header */}
            <div className="flex font-medium text-[#575757]">
              <div className="w-1/2 px-2">Activity</div>
              <div className="w-1/2 px-2">Date</div>
            </div>
            <hr className="border-gray-300 my-4" />

            {/* Table rows */}
            {followUpData.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${
                  idx > 0 ? "mt-3" : ""
                } font-medium text-black`}
              >
                <div className="w-1/2 px-2">{item.activity}</div>
                <div className="w-1/2 px-2">{item.date}</div>
              </div>
            ))}

            {/* Floating Add button */}
            <button
              disabled={isAddDisabled}
              className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                isAddDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#DB2727] hover:bg-red-700"
              }`}
            >
              <FiPlus size={24} />
            </button>
          </div>
        )}

        {activeTab === 1 && (
          <div className="mt-8 bg-white rounded-4xl py-8 px-8 relative">
            {/* Table header */}
            <div className="flex font-medium text-[#575757]">
              <div className="w-1/3 px-2">Task Title</div>
              <div className="w-1/3 px-2">Task Date</div>
              <div className="w-1/3 px-2">Note</div>
            </div>
            <hr className="border-gray-300 my-4" />

            {/* Table rows */}
            {reminderData.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${
                  idx > 0 ? "mt-3" : ""
                } font-medium text-black`}
              >
                <div className="w-1/3 px-2">{item.activity}</div>
                <div className="w-1/3 px-2">{item.date}</div>
                <div className="w-1/3 px-2">{item.date}</div>
              </div>
            ))}

            {/* Floating Add button */}
            <button
              disabled={isAddDisabled}
              className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                isAddDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#DB2727] hover:bg-red-700"
              }`}
            >
              <FiPlus size={24} />
            </button>
          </div>
        )}
        {activeTab === 2 && (
          <div className="mt-8">Events content goes here.</div>
        )}
      </div>
    </div>
  );
}
