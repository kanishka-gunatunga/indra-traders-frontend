"use client"

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
            className={`flex-1 py-5 cursor-pointer text-lg relative ${
              activeTab === index ? "font-medium text-[#575757]" : "text-gray-600"
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
        {activeTab === 0 && <div>Follow up content goes here.</div>}
        {activeTab === 1 && <div>Reminders content goes here.</div>}
        {activeTab === 2 && <div>Events content goes here.</div>}
      </div>
    </div>
  );
}
