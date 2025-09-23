import Header from "@/components/Header";
import Image from "next/image";
import React from "react";

const activityLogData = [
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
  {
    date: "12 Dec 2024",
    time: "08:10 PM",
    userRole: "Admin",
    userName: "Albert Flores",
    activityType: "User Level Edit",
    chanages: "764573 Change User Level",
  },
];

export default function ActivityLog() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="Activity Log"
        />

        {/* Activity Log Section */}
        <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">Activity Log</span>

            <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
              <Image
                src={"/images/admin/flowbite_filter-outline.svg"}
                width={24}
                height={24}
                alt="Filter icon"
              />
            </button>
          </div>
          <div className="w-full mt-5 ">
            <div className="h-[400px] overflow-x-auto overflow-y-hidden ">
              <div className="min-w-[1000px] ">
                {/* Table header */}
                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                  <div className="w-1/7 px-3 py-2">Date</div>
                  <div className="w-1/7 px-3 py-2">Time</div>
                  <div className="w-1/7 px-3 py-2">User Role</div>
                  <div className="w-1/7 px-3 py-2">User Name</div>
                  <div className="w-1/7 px-3 py-2">Activity Type</div>
                  <div className="w-2/7 px-3 py-2">Changes</div>
                </div>

                {/* Table body (scrollable vertically) */}
                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                  {activityLogData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex text-lg mt-2 text-black hover:bg-gray-50 transition"
                    >
                      <div className="w-1/7 px-3 py-2">{item.date}</div>
                      <div className="w-1/7 px-3 py-2">{item.time}</div>
                      <div className="w-1/7 px-3 py-2">{item.userRole}</div>
                      <div className="w-1/7 px-3 py-2 relative">
                        {item.userName}
                      </div>
                      <div className="w-1/7 px-3 py-2">{item.activityType}</div>
                      <div className="w-2/7 px-3 py-2">{item.chanages}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
