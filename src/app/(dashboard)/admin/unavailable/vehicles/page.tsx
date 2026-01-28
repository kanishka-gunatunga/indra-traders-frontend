/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Header from "@/components/Header";
import Image from "next/image";
import React, { useState } from "react";
import { useUnavailableVehicleSales } from "@/hooks/useUnavailable";
import Modal from "@/components/Modal";
import { useCurrentUser } from "@/utils/auth";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

export default function UnavailableVehicles() {
    const user = useCurrentUser();

    // Filter States
    const [filtersVehicle, setFiltersVehicle] = React.useState<any>({});
    const [activeFilterSection, setActiveFilterSection] = React.useState<string | null>(null);

    // Pagination State
    const [currentVehiclePage, setCurrentVehiclePage] = React.useState(1);
    const ITEMS_PER_PAGE = 10; // Full page can show more items

    // Search State
    const [searchVehicleQuery, setSearchVehicleQuery] = useState("");
    const [isSearchVehicleActive, setIsSearchVehicleActive] = useState(false);
    const debouncedVehicleSearch = useDebounce(searchVehicleQuery, 500);

    const currentVehicleFilters = React.useMemo(() => ({ ...filtersVehicle, search: debouncedVehicleSearch }), [filtersVehicle, debouncedVehicleSearch]);

    const {
        data: vehicleSales,
        isLoading: loadingVehicle
    } = useUnavailableVehicleSales(currentVehiclePage, ITEMS_PER_PAGE, currentVehicleFilters);

    const OPTIONS = {
        VEHICLE: {
            MaKe: ["Toyota", "Honda", "Nissan", "Suzuki"],
            Model: ["Corolla", "Civic", "Alto", "WagonR"],
            Year: ["2020", "2021", "2022", "2023", "2024"]
        }
    };

    const FilterModalWrapper = ({ onClose }: { onClose: () => void }) => {
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
            setFiltersVehicle(localFilters);
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
                title={`Filter Vehicles`}
                onClose={onClose}
                actionButton={{
                    label: "Apply",
                    onClick: applyFilters,
                }}
            >
                <div className="w-[600px]">
                    {renderOptions("Make", "make", OPTIONS.VEHICLE.MaKe)}
                    {renderOptions("Model", "model", OPTIONS.VEHICLE.Model)}
                    {renderOptions("Year", "year", OPTIONS.VEHICLE.Year)}
                </div>
            </Modal>
        );
    };

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
        <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            {activeFilterSection && <FilterModalWrapper onClose={() => setActiveFilterSection(null)} />}

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                {/* Back Button */}
                <div className="w-full flex justify-start">
                    <Link href="/admin/unavailable" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium">
                        <span>← Back to Dashboard</span>
                    </Link>
                </div>

                <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Unavailable Vehicles</span>

                        <div className="flex gap-5">
                            <div className="relative flex items-center justify-end">
                                <input
                                    type="text"
                                    value={searchVehicleQuery}
                                    onChange={(e) => setSearchVehicleQuery(e.target.value)}
                                    // onBlur={() => !searchVehicleQuery && setIsSearchVehicleActive(false)}
                                    placeholder={`Search Vehicles...`}
                                    className={`
                                        bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                        rounded-full border border-gray-300 outline-none
                                        transition-all duration-300 ease-in-out h-10 text-sm
                                        ${isSearchVehicleActive ? 'w-64 px-4 opacity-100 mr-2 border' : 'w-0 px-0 opacity-0 border-none'}
                                    `}
                                    autoFocus={isSearchVehicleActive}
                                />
                                <button
                                    onClick={() => setIsSearchVehicleActive(!isSearchVehicleActive)}
                                    className={`ml-auto text-white text-base font-medium rounded-full z-10 transition-transform duration-200 cursor-pointer ${isSearchVehicleActive ? 'scale-90' : ''}`}
                                >
                                    <Image src="/search.svg" alt="search" height={36} width={36} className="h-12 w-12" />
                                </button>
                            </div>
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
                    </div>
                    <div className="w-full mt-5 ">
                        <div className="h-[600px] overflow-x-auto overflow-y-hidden "> {/* Increased height for full page */}
                            <div className="min-w-[1000px] ">
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/7 px-3 py-2">Make</div>
                                    <div className="w-1/7 px-3 py-2">Model</div>
                                    <div className="w-1/7 px-3 py-2">Year</div>
                                    <div className="w-1/7 px-3 py-2">Transmission</div>
                                    <div className="w-1/7 px-3 py-2">Fuel Type</div>
                                    <div className="w-1/7 px-3 py-2">Down Payment</div>
                                    <div className="w-1/7 px-3 py-2">Price Range</div>
                                </div>
                                <div className="h-[550px] py-3 overflow-y-auto no-scrollbar">
                                    {loadingVehicle ? <p>Loading...</p> :
                                        (vehicleSales?.data?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex text-lg mt-1 text-black hover:bg-gray-50 transition">
                                                <div className="w-1/7 px-3 py-2">{item.vehicle_make}</div>
                                                <div className="w-1/7 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/7 px-3 py-2">{item.manufacture_year}</div>
                                                <div className="w-1/7 px-3 py-2 relative">{item.transmission}</div>
                                                <div className="w-1/7 px-3 py-2">{item.fuel_type}</div>
                                                <div className="w-1/7 px-3 py-2">LKR {item.down_payment}</div>
                                                <div className="w-1/7 px-3 py-2">{item.price_from} - {item.price_to}</div>
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
            </main>
        </div>
    );
}
