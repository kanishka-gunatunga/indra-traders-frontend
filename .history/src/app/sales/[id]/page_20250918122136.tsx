"use client";

import FlowBar from "@/components/FlowBar";
import SalesHeader from "@/components/SalesHeader";
import InfoRow from "@/components/SalesInfoRow";
import React, { useState } from "react";

export default function SalesDetailsPage() {
  const [status, setStatus] = useState<"New" | "Ongoing" | "Won" | "Lost">(
    "New"
  );

  const handleAssignClick = () => {
    if (status === "New") setStatus("Ongoing");
  };

  const buttonText = status === "New" ? "Assign to me" : "Sophie Eleanor";

  return (
    <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
      <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
        <SalesHeader />

        <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
          <div className="flex w-full justify-between items-center">
            <div className="flex w-full gap-4 items-center">
              <span className="font-semibold text-[22px] leading-[100%] tracking-normal">
                ITPL122455874565
              </span>
            </div>

            {/* Flow bar */}
            <FlowBar status={status} onStatusChange={setStatus} />
          </div>

          <div className="w-full flex mt-2 mb-8">
            <button
              onClick={handleAssignClick}
              className={`w-[145px] h-[32px] rounded-[22.98px] px-[17.23px] py-[5.74px] text-white font-light flex items-center justify-center ${
                status === "New" ? "bg-[#DB2727]" : "bg-[#d7a73f]"
              }`}
              disabled={status !== "New"}
            >
              {buttonText}
            </button>
          </div>

          <div className="w-full flex">
            <div className="w-2/5">
              <div className="mb-6 font-semibold text-[20px] leading-[100%] tracking-[0%]">
                Customer Details
              </div>
              <InfoRow label="Customer Name:" value="Emily Charlotte" />
              <InfoRow label="Contact No:" value="077 5898712" />
              <InfoRow label="Email:" value="Info@indra.com" />

              <div className="mt-8 mb-6 font-semibold text-[20px] leading-[100%] tracking-[0%]">
                Vehicle Details
              </div>
              <InfoRow label="Vehicle Made:" value="Honda" />
              <InfoRow label="Vehicle Model:" value="Civic" />
              <InfoRow label="Manufacture Year:" value="2019" />
              <InfoRow label="Transmission:" value="Auto" />
              <InfoRow label="Fuel Type:" value="Petrol" />
              <InfoRow label="Down Payment:" value="500,000LKR" />
              <InfoRow label="Price Range:" value="6,000,000 - 8,000,000" />
              <InfoRow label="Additional Note:" value="White color" />
            </div>
            <div className="w-3/5">
            import {Tabs, Tab, Card, CardBody} from "@heroui/react";

export default function App() {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="photos" title="Photos">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="music" title="Music">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="videos" title="Videos">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
