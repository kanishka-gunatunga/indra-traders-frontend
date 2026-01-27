/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import { useUnavailableServices, useUnavailableSpareParts, useUnavailableVehicleSales } from "@/hooks/useUnavailable";
import { useBydUnavailableSales } from "@/hooks/useBydSales";
import Modal from "@/components/Modal";
import { useCurrentUser } from "@/utils/auth";

export default function Unavailable() {

    const user = useCurrentUser();

    // Filter States
    const [filtersVehicle, setFiltersVehicle] = React.useState<any>({});
    const [filtersService, setFiltersService] = React.useState<any>({});
    const [filtersSpare, setFiltersSpare] = React.useState<any>({});
    const [filtersByd, setFiltersByd] = React.useState<any>({});

    const [activeFilterSection, setActiveFilterSection] = React.useState<string | null>(null);

    // Pagination State (Restored)
    const [currentVehiclePage, setCurrentVehiclePage] = React.useState(1);
    const [currentServicePage, setCurrentServicePage] = React.useState(1);
    const [currentSparePage, setCurrentSparePage] = React.useState(1);
    const [currentBydPage, setCurrentBydPage] = React.useState(1);

    const ITEMS_PER_PAGE = 5;

    const { data: vehicleSales, isLoading: loadingVehicle } = useUnavailableVehicleSales(currentVehiclePage, ITEMS_PER_PAGE, filtersVehicle);
    const { data: services, isLoading: loadingService } = useUnavailableServices(currentServicePage, ITEMS_PER_PAGE, filtersService);
    const { data: spareParts, isLoading: loadingSpare } = useUnavailableSpareParts(currentSparePage, ITEMS_PER_PAGE, filtersSpare);
    const { data: bydUnavailableSales, isLoading: loadingBydUnavailable } = useBydUnavailableSales(currentBydPage, ITEMS_PER_PAGE, filtersByd);

    // Hardcoded OPTIONS for demo (In real app, fetch dynamically or use text inputs)
    const OPTIONS = {
        VEHICLE: {
            MaKe: ["Toyota", "Honda", "Nissan", "Suzuki"],
            Model: ["Corolla", "Civic", "Alto", "WagonR"],
            Year: ["2020", "2021", "2022", "2023", "2024"]
        },
        SERVICE: {
            Repair: ["Engine", "Body", "Electrical"],
            Paint: ["Full", "Touchup"],
            Search: [] // Text input
        },
        SPARE: {
            Make: ["Toyota", "Nissan"],
            Model: ["Axio", "Leaf"],
            Year: ["2018", "2019"]
        },
        BYD: {
            Model: ["Atto 3", "Dolphin", "Seal"],
            Year: ["2023", "2024"],
            Color: ["White", "Black", "Blue"]
        }
    }

    const FilterModalWrapper = ({ section, onClose }: { section: string, onClose: () => void }) => {
        const [localFilters, setLocalFilters] = React.useState<any>({});

        const handleOptionClick = (key: string, value: string) => {
            setLocalFilters((prev: any) => {
                const current = prev[key];
                if (current === value) {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [key]: value };
            });
        };

        const applyFilters = () => {
            if (section === "VEHICLE") setFiltersVehicle(localFilters);
            if (section === "SERVICE") setFiltersService(localFilters);
            if (section === "SPARE") setFiltersSpare(localFilters);
            if (section === "BYD") setFiltersByd(localFilters);
            onClose();
        };

        const renderOptions = (label: string, key: string, options: string[]) => (
            <div className="w-full mt-5">
                <span className="font-montserrat font-semibold text-lg leading-[100%]">{label}</span>
                <div className="w-full mt-5 flex gap-3 flex-wrap">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleOptionClick(key, opt)}
                            className={`px-4 py-1 rounded-full border text-sm transition ${localFilters[key] === opt ? "bg-blue-500 text-white border-blue-500" : "bg-gray-200 text-gray-700 border-transparent hover:bg-gray-300"}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        );

        return (
            <Modal
                title={`Filter ${section}`}
                onClose={onClose}
                actionButton={{
                    label: "Apply",
                    onClick: applyFilters,
                }}
            >
                <div className="w-[600px]">
                    {section === "VEHICLE" && (
                        <>
                            {renderOptions("Make", "make", OPTIONS.VEHICLE.MaKe)}
                            {renderOptions("Model", "model", OPTIONS.VEHICLE.Model)}
                            {renderOptions("Year", "year", OPTIONS.VEHICLE.Year)}
                        </>
                    )}
                    {section === "SERVICE" && (
                        <>
                            <div className="w-full mt-5">
                                <span className="font-montserrat font-semibold text-lg leading-[100%]">Search Note</span>
                                <input
                                    className="w-full mt-2 p-2 border rounded-lg"
                                    placeholder="Search..."
                                    onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                />
                            </div>
                            {renderOptions("Unavailable Repair", "unavailable_repair", OPTIONS.SERVICE.Repair)}
                            {renderOptions("Unavailable Paint", "unavailable_paint", OPTIONS.SERVICE.Paint)}
                        </>
                    )}
                    {section === "SPARE" && (
                        <>
                            {renderOptions("Make", "make", OPTIONS.SPARE.Make)}
                            {renderOptions("Model", "model", OPTIONS.SPARE.Model)}
                            {renderOptions("Part No (Text)", "part_no", [])}
                            <input
                                className="w-full mt-2 p-2 border rounded-lg"
                                placeholder="Type Part No..."
                                onChange={(e) => setLocalFilters({ ...localFilters, part_no: e.target.value })}
                            />
                        </>
                    )}
                    {section === "BYD" && (
                        <>
                            {renderOptions("Model", "model", OPTIONS.BYD.Model)}
                            {renderOptions("Year", "year", OPTIONS.BYD.Year)}
                            {renderOptions("Color", "color", OPTIONS.BYD.Color)}
                        </>
                    )}
                </div>
            </Modal>
        );
    }

    // Pagination Component
    const Pagination = ({ currentPage, totalItems, onPageChange }: { currentPage: number, totalItems: number, onPageChange: (page: number) => void }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;

        const handlePageChange = (page: number) => {
            if (page >= 1 && page <= totalPages) {
                onPageChange(page);
            }
        };

        return (
            <div className="flex items-center justify-center gap-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages || 1) }).map((_, idx) => {
                    // Start page window logic to show current page in view
                    let startPage = Math.max(1, currentPage - 2);
                    if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4);

                    const pageNum = startPage + idx;
                    if (pageNum > totalPages) return null;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors border cursor-pointer
                            ${currentPage === pageNum
                                    ? 'bg-[#E52F2F] text-white border-[#E52F2F]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            {pageNum}
                        </button>
                    )
                })}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            {activeFilterSection && <FilterModalWrapper section={activeFilterSection} onClose={() => setActiveFilterSection(null)} />}

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">

                <Header
                    name={user?.full_name || "Sophie Eleanor"}
                    title="Unavailable Items"
                />

                {/* Unavailable Items Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Vehicles</span>

                        <button
                            onClick={() => setActiveFilterSection("VEHICLE")}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
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
                                        (vehicleSales?.data?.map((item: any, idx: number) => (
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
                        <Pagination
                            currentPage={currentVehiclePage}
                            totalItems={vehicleSales?.meta?.total || 0}
                            onPageChange={setCurrentVehiclePage}
                        />
                    </div>
                </section>

                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Services</span>

                        <button
                            onClick={() => setActiveFilterSection("SERVICE")}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
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
                                        (services?.data?.map((item: any, idx: number) => (
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
                        <Pagination
                            currentPage={currentServicePage}
                            totalItems={services?.meta?.total || 0}
                            onPageChange={setCurrentServicePage}
                        />
                    </div>
                </section>

                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Spare Part</span>

                        <button
                            onClick={() => setActiveFilterSection("SPARE")}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
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
                                        (spareParts?.data?.map((item: any, idx: number) => (
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
                        <Pagination
                            currentPage={currentSparePage}
                            totalItems={spareParts?.meta?.total || 0}
                            onPageChange={setCurrentSparePage}
                        />
                    </div>
                </section>

                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable BYD Vehicles</span>

                        <button
                            onClick={() => setActiveFilterSection("BYD")}
                            className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
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
                                    <div className="w-1/6 px-3 py-2">Model</div>
                                    <div className="w-1/6 px-3 py-2">Year</div>
                                    <div className="w-1/6 px-3 py-2">Color</div>
                                    <div className="w-1/6 px-3 py-2">Type</div>
                                    <div className="w-1/6 px-3 py-2">Down Payment</div>
                                    <div className="w-1/6 px-3 py-2">Price Range</div>
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingBydUnavailable ? <p>Loading...</p> :
                                        (bydUnavailableSales?.data?.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex text-lg mt-1 text-black hover:bg-gray-50 transition"
                                            >
                                                <div className="w-1/6 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/6 px-3 py-2">{item.manufacture_year}</div>
                                                <div className="w-1/6 px-3 py-2">{item.color}</div>
                                                <div className="w-1/6 px-3 py-2">{item.type}</div>
                                                <div className="w-1/6 px-3 py-2">{item.down_payment ? `LKR ${item.down_payment}` : '-'}</div>
                                                <div className="w-1/6 px-3 py-2">
                                                    {item.price_from && item.price_to ? `${item.price_from} - ${item.price_to}` : '-'}
                                                </div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                        <Pagination
                            currentPage={currentBydPage}
                            totalItems={bydUnavailableSales?.meta?.total || 0}
                            onPageChange={setCurrentBydPage}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
