"use client";

import { useState } from "react";

export default function SalesDetailsTab() {
  const tabs = ["Follow up", "Reminders", "Events"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className={`flex-1 py-4 px-2 cursor-pointer text-lg relative ${
              activeTab === index
                ? "font-medium text-[#575757]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
            {/* Active indicator line */}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#DB2727] rounded-t"></div>
            )}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 0 && (
          <div className="mt-8 bg-white rounded-4xl py-8 px-8 ">
            <div className="flex">
              <div className="w-1/2 px-2 font-medium text-[#575757]">
                Activity
              </div>
              <div className="w-1/2 px-2 font-medium text-[#575757]">Date</div>
            </div>
            <hr className="border-gray-300 mb-4 mt-4" />
            <div className="flex">
              <div className="w-1/2 px-2 font-medium text-black">
                Proposed Red Color Civic
              </div>
              <div className="w-1/2 px-2 font-medium text-black">12 March, 2025</div>
            </div>
            <div className="flex">
              <div className="w-1/2 px-2 font-medium text-black">
                Proposed FK7 Ex Tech Pack Edition
              </div>
              <div className="w-1/2 px-2 font-medium text-black">10 March, 2025</div>
            </div>
          </div>
        )}
        {activeTab === 1 && <div>Reminders content goes here.</div>}
        {activeTab === 2 && <div>Events content goes here.</div>}
      </div>
    </div>
  );
}
