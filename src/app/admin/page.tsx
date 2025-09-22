import Header from "@/components/Header";
import Image from "next/image";
import React from "react";

export default function UserManagement() {
  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <Header
          name="Sophie Eleanor"
          location="Bambalapitiya"
          title="User Management"
        />

        {/* User Management Section */}
        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold text-[22px]">User Management</span>
            <div className="flex gap-5">
              <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                <Image
                  src={"/images/admin/flowbite_filter-outline.svg"}
                  width={24}
                  height={24}
                  alt="Plus icon"
                />
              </button>
              <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                <Image
                  src={"/images/sales/plus.svg"}
                  width={24}
                  height={24}
                  alt="Plus icon"
                />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
