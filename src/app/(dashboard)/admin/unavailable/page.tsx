"use client";
import Header from "@/components/Header";
import Image from "next/image";
import React from "react";
import { useUnavailableServices, useUnavailableSpareParts, useUnavailableVehicleSales } from "@/hooks/useUnavailable";
import { useBydUnavailableSales } from "@/hooks/useBydSales";
import { useCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Modal from "@/components/Modal";

export default function Unavailable() {

    const user = useCurrentUser();

    // Summary View Configuration
    const ITEMS_PER_PAGE = 5;
    const FIRST_PAGE = 1;

    // Filter States
    const [filtersVehicle, setFiltersVehicle] = React.useState<any>({});
    const [filtersService, setFiltersService] = React.useState<any>({});
    const [filtersSpare, setFiltersSpare] = React.useState<any>({});
    const [filtersByd, setFiltersByd] = React.useState<any>({});

    const [activeFilterSection, setActiveFilterSection] = React.useState<string | null>(null);

    // Search States
    const [searchVehicleQuery, setSearchVehicleQuery] = useState("");
    const [isSearchVehicleActive, setIsSearchVehicleActive] = useState(false);
    const debouncedVehicleSearch = useDebounce(searchVehicleQuery, 500);

    const [searchServiceQuery, setSearchServiceQuery] = useState("");
    const [isSearchServiceActive, setIsSearchServiceActive] = useState(false);
    const debouncedServiceSearch = useDebounce(searchServiceQuery, 500);

    const [searchSpareQuery, setSearchSpareQuery] = useState("");
    const [isSearchSpareActive, setIsSearchSpareActive] = useState(false);
    const debouncedSpareSearch = useDebounce(searchSpareQuery, 500);

    const [searchBydQuery, setSearchBydQuery] = useState("");
    const [isSearchBydActive, setIsSearchBydActive] = useState(false);
    const debouncedBydSearch = useDebounce(searchBydQuery, 500);

    const currentVehicleFilters = React.useMemo(() => ({ ...filtersVehicle, search: debouncedVehicleSearch }), [filtersVehicle, debouncedVehicleSearch]);
    const currentServiceFilters = React.useMemo(() => ({ ...filtersService, search: debouncedServiceSearch }), [filtersService, debouncedServiceSearch]);
    const currentSpareFilters = React.useMemo(() => ({ ...filtersSpare, search: debouncedSpareSearch }), [filtersSpare, debouncedSpareSearch]);
    const currentBydFilters = React.useMemo(() => ({ ...filtersByd, search: debouncedBydSearch }), [filtersByd, debouncedBydSearch]);

    const {
        data: vehicleSales,
        isLoading: loadingVehicle
    } = useUnavailableVehicleSales(FIRST_PAGE, ITEMS_PER_PAGE, currentVehicleFilters);
    const {
        data: services,
        isLoading: loadingService
    } = useUnavailableServices(FIRST_PAGE, ITEMS_PER_PAGE, currentServiceFilters);
    const {
        data: spareParts,
        isLoading: loadingSpare
    } = useUnavailableSpareParts(FIRST_PAGE, ITEMS_PER_PAGE, currentSpareFilters);
    const {
        data: bydUnavailableSales,
        isLoading: loadingBydUnavailable
    } = useBydUnavailableSales(FIRST_PAGE, ITEMS_PER_PAGE, currentBydFilters);

    // Filter Options
    const OPTIONS = {
        VEHICLE: {
            MaKe: ["Toyota", "Honda", "Nissan", "Suzuki"],
            Model: ["Corolla", "Civic", "Alto", "WagonR"],
            Year: ["2020", "2021", "2022", "2023", "2024"]
        },
        SERVICE: {
            Repair: ["Engine", "Body", "Electrical"],
            Paint: ["Full", "Touchup"],
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
    };

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

    // Reusable See More Button
    const SeeMoreButton = ({ href }: { href: string }) => (
        <div className="flex items-center justify-center mt-6">
            <Link
                href={href}
                className="px-6 py-2 bg-[#E52F2F] text-white rounded-full font-medium hover:bg-[#d42020] transition-colors shadow-md flex items-center gap-2"
            >
                See More
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );

    return (
        <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            {activeFilterSection &&
                <FilterModalWrapper section={activeFilterSection} onClose={() => setActiveFilterSection(null)} />}

            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">

                {/* Unavailable Items Section */}
                <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center mb-5">
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
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/7 px-3 py-2">Make</div>
                                    <div className="w-1/7 px-3 py-2">Model</div>
                                    <div className="w-1/7 px-3 py-2">Year</div>
                                    <div className="w-1/7 px-3 py-2">Transmission</div>
                                    <div className="w-1/7 px-3 py-2">Fuel Type</div>
                                    <div className="w-1/7 px-3 py-2">Down Payment</div>
                                    <div className="w-1/7 px-3 py-2">Price Range</div>
                                </div>

                                <div className="py-3">
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
                        <SeeMoreButton href="/admin/unavailable/vehicles" />
                    </div>
                </section>

                <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center mb-5">
                        <span className="font-semibold text-[22px]">Unavailable Services</span>

                        <div className="flex gap-5">
                            <div className="relative flex items-center justify-end">
                                <input
                                    type="text"
                                    value={searchServiceQuery}
                                    onChange={(e) => setSearchServiceQuery(e.target.value)}
                                    // onBlur={() => !searchServiceQuery && setIsSearchServiceActive(false)}
                                    placeholder={`Search Services...`}
                                    className={`
                                        bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                        rounded-full border border-gray-300 outline-none
                                        transition-all duration-300 ease-in-out h-10 text-sm
                                        ${isSearchServiceActive ? 'w-64 px-4 opacity-100 mr-2 border' : 'w-0 px-0 opacity-0 border-none'}
                                    `}
                                    autoFocus={isSearchServiceActive}
                                />
                                <button
                                    onClick={() => setIsSearchServiceActive(!isSearchServiceActive)}
                                    className={`ml-auto text-white text-base font-medium rounded-full z-10 transition-transform duration-200 cursor-pointer ${isSearchServiceActive ? 'scale-90' : ''}`}
                                >
                                    <Image src="/search.svg" alt="search" height={36} width={36} className="h-12 w-12" />
                                </button>
                            </div>
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
                    </div>
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/4 px-3 py-2">Unavailable Repair</div>
                                    <div className="w-1/4 px-3 py-2">Unavailable Paint</div>
                                    <div className="w-1/4 px-3 py-2">Unavailable Add-On</div>
                                    <div className="w-1/4 px-3 py-2">Note</div>
                                </div>

                                <div className="py-3">
                                    {loadingService ? <p>Loading...</p> :
                                        (services?.data?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex text-lg mt-1 text-black hover:bg-gray-50 transition">
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_repair || "-"}</div>
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_paint || "-"}</div>
                                                <div className="w-1/4 px-3 py-2">{item.unavailable_add_on || "-"}</div>
                                                <div className="w-1/4 px-3 py-2 relative">{item.note}</div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                        <SeeMoreButton href="/admin/unavailable/services" />
                    </div>
                </section>

                <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center mb-5">
                        <span className="font-semibold text-[22px]">Unavailable Spare Part</span>

                        <div className="flex gap-5">
                            <div className="relative flex items-center justify-end">
                                <input
                                    type="text"
                                    value={searchSpareQuery}
                                    onChange={(e) => setSearchSpareQuery(e.target.value)}
                                    // onBlur={() => !searchSpareQuery && setIsSearchSpareActive(false)}
                                    placeholder={`Search Spare Parts...`}
                                    className={`
                                        bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                        rounded-full border border-gray-300 outline-none
                                        transition-all duration-300 ease-in-out h-10 text-sm
                                        ${isSearchSpareActive ? 'w-64 px-4 opacity-100 mr-2 border' : 'w-0 px-0 opacity-0 border-none'}
                                    `}
                                    autoFocus={isSearchSpareActive}
                                />
                                <button
                                    onClick={() => setIsSearchSpareActive(!isSearchSpareActive)}
                                    className={`ml-auto text-white text-base font-medium rounded-full z-10 transition-transform duration-200 cursor-pointer ${isSearchSpareActive ? 'scale-90' : ''}`}
                                >
                                    <Image src="/search.svg" alt="search" height={36} width={36} className="h-12 w-12" />
                                </button>
                            </div>
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
                    </div>
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/4 px-3 py-2">Vehicle Make</div>
                                    <div className="w-1/4 px-3 py-2">Vehicle Model</div>
                                    <div className="w-1/4 px-3 py-2">Part No.</div>
                                    <div className="w-1/4 px-3 py-2">Year of Manufacture</div>
                                </div>
                                <div className="py-3">
                                    {loadingSpare ? <p>Loading...</p> :
                                        (spareParts?.data?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex text-lg mt-1 text-black hover:bg-gray-50 transition">
                                                <div className="w-1/4 px-3 py-2">{item.vehicle_make}</div>
                                                <div className="w-1/4 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/4 px-3 py-2">{item.part_no}</div>
                                                <div className="w-1/4 px-3 py-2 relative">{item.year_of_manufacture}</div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                        <SeeMoreButton href="/admin/unavailable/spare-parts" />
                    </div>
                </section>

                <section className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center mb-5">
                        <span className="font-semibold text-[22px]">Unavailable BYD Vehicles</span>

                        <div className="flex gap-5">
                            <div className="relative flex items-center justify-end">
                                <input
                                    type="text"
                                    value={searchBydQuery}
                                    onChange={(e) => setSearchBydQuery(e.target.value)}
                                    // onBlur={() => !searchBydQuery && setIsSearchBydActive(false)}
                                    placeholder={`Search BYD Vehicles...`}
                                    className={`
                                        bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
                                        rounded-full border border-gray-300 outline-none
                                        transition-all duration-300 ease-in-out h-10 text-sm
                                        ${isSearchBydActive ? 'w-64 px-4 opacity-100 mr-2 border' : 'w-0 px-0 opacity-0 border-none'}
                                    `}
                                    autoFocus={isSearchBydActive}
                                />
                                <button
                                    onClick={() => setIsSearchBydActive(!isSearchBydActive)}
                                    className={`ml-auto text-white text-base font-medium rounded-full z-10 transition-transform duration-200 cursor-pointer ${isSearchBydActive ? 'scale-90' : ''}`}
                                >
                                    <Image src="/search.svg" alt="search" height={36} width={36} className="h-12 w-12" />
                                </button>
                            </div>
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
                    </div>
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <div className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    <div className="w-1/6 px-3 py-2">Model</div>
                                    <div className="w-1/6 px-3 py-2">Year</div>
                                    <div className="w-1/6 px-3 py-2">Color</div>
                                    <div className="w-1/6 px-3 py-2">Type</div>
                                    <div className="w-1/6 px-3 py-2">Down Payment</div>
                                    <div className="w-1/6 px-3 py-2">Price Range</div>
                                </div>
                                <div className="py-3">
                                    {loadingBydUnavailable ? <p>Loading...</p> :
                                        (bydUnavailableSales?.data?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex text-lg mt-1 text-black hover:bg-gray-50 transition">
                                                <div className="w-1/6 px-3 py-2">{item.vehicle_model}</div>
                                                <div className="w-1/6 px-3 py-2">{item.manufacture_year}</div>
                                                <div className="w-1/6 px-3 py-2">{item.color}</div>
                                                <div className="w-1/6 px-3 py-2">{item.type}</div>
                                                <div className="w-1/6 px-3 py-2">{item.down_payment ? `LKR ${item.down_payment}` : '-'}</div>
                                                <div className="w-1/6 px-3 py-2">{item.price_from && item.price_to ? `${item.price_from} - ${item.price_to}` : '-'}</div>
                                            </div>
                                        )))
                                    }
                                </div>
                            </div>
                        </div>
                        <SeeMoreButton href="/admin/unavailable/byd" />
                    </div>
                </section>
            </main>
        </div>
    );
}
