/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import {useUnavailableServices, useUnavailableSpareParts, useUnavailableVehicleSales} from "@/hooks/useUnavailable";

export default function Unavailable() {

    const {data: vehicleSales, isLoading: loadingVehicle} = useUnavailableVehicleSales();
    const {data: services, isLoading: loadingService} = useUnavailableServices();
    const {data: spareParts, isLoading: loadingSpare} = useUnavailableSpareParts();

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title="Unavailable Items"
                />

                {/* Unavailable Items Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Vehicles</span>

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
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/7 px-3 py-2">Make</div>
                                    <div className="w-1/7 px-3 py-2">Model</div>
                                    <div className="w-1/7 px-3 py-2">Year</div>
                                    <div className="w-1/7 px-3 py-2">Transmission</div>
                                    <div className="w-1/7 px-3 py-2">Fuel Type</div>
                                    <div className="w-1/7 px-3 py-2">Down Payment</div>
                                    <div className="w-1/7 px-3 py-2">Price Range</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingVehicle ? <p>Loading...</p> :
                                        (vehicleSales?.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                                            >
                                                <div className="w-1/7 px-3 py-2">{item.vehicle_make}</div>
                                                <div className="w-1/7 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/7 px-3 py-2">{item.manufacture_year}</div>
                                                <div className="w-1/7 px-3 py-2 relative">
                                                    {item.transmission}
                                                </div>
                                                <div className="w-1/7 px-3 py-2">{item.fuel_type}</div>
                                                <div className="w-1/7 px-3 py-2">
                                                    LKR {item.down_payment}
                                                </div>
                                                <div
                                                    className="w-1/7 px-3 py-2">{item.price_from} - {item.price_to}</div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Services</span>

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
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/4 px-3 py-2">Unavailable Repair</div>
                                    <div className="w-1/4 px-3 py-2">Unavailable Paint</div>
                                    <div className="w-1/4 px-3 py-2">Unavailable Add-On</div>
                                    <div className="w-1/4 px-3 py-2">Note</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingService ? <p>Loading...</p> :
                                        (services?.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                                            >
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_repair || "-"}</div>
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_paint || "-"}</div>
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_add_on || "-"}</div>
                                                <div className="w-1/4 px-3 py-2 relative">
                                                    {item.note}
                                                </div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Spare Part</span>

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
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/4 px-3 py-2">Vehicle Make</div>
                                    <div className="w-1/4 px-3 py-2">Vehicle Model</div>
                                    <div className="w-1/4 px-3 py-2">Part No.</div>
                                    <div className="w-1/4 px-3 py-2">Year of Manufacture</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingSpare ? <p>Loading...</p> :
                                        (spareParts?.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                                            >
                                                <div className="w-1/4 px-3 py-2">{item.vehicle_make}</div>
                                                <div className="w-1/4 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/4 px-3 py-2">{item.part_no}</div>
                                                <div className="w-1/4 px-3 py-2 relative">
                                                    {item.year_of_manufacture}
                                                </div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
