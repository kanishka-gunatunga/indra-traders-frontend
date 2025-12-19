/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import React, {useEffect, useMemo, useState} from "react";
import {Badge, Calendar, ConfigProvider, Select, Spin} from "antd";
import dayjs from "dayjs";
import {useSelector, useDispatch} from "react-redux";
import {useToast} from "@/hooks/useToast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
    useBookingAvailability,
    useBranchDetails,
    useBranches,
    useDailyBookings,
    useSubmitBooking
} from "@/hooks/useServicePark";
import {vehicleHistorySchema} from "../page";
import FormField from "@/components/FormField";
import Toast from "@/components/Toast";
import {removeBookingItem} from "@/redux/slices/bookingSlice";
import Modal from "@/components/Modal";

// --- Types ---
interface TimeSlot {
    start: string;
    end: string;
    label: string;
}

interface SlotStatus {
    status: 'available' | 'booked' | 'pending';
    data: any | null;
}

// --- Helper: Generate Slots ---
const generateTimeSlots = (): TimeSlot[] => {
    const slots = [];
    let start = 8 * 60; // 8:00 AM
    const end = 17 * 60; // 5:00 PM

    while (start < end) {
        const startH = Math.floor(start / 60).toString().padStart(2, '0');
        const startM = (start % 60).toString().padStart(2, '0');
        const endMins = start + 30;
        const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
        const endM = (endMins % 60).toString().padStart(2, '0');

        slots.push({
            start: `${startH}:${startM}`,
            end: `${endH}:${endM}`,
            label: `${startH}:${startM} - ${endH}:${endM}`
        });
        start += 30;
    }
    return slots;
};

const TIME_SLOTS = generateTimeSlots();

const ServiceParkBooking = () => {
    const {toast, showToast, hideToast} = useToast();
    const dispatch = useDispatch();
    const bookingState = useSelector((state: any) => state.booking);

    // --- State ---
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
    const selectedDateString = selectedDate.format('YYYY-MM-DD');

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // Array of start times

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleConfirmClick = () => {
        if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
            showToast("Please select branch, line, and at least one time slot.", "error");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const categoryTitles: Record<string, string> = {
        packages: "Packages",
        repairs: "Repairs",
        paints: "Paints",
        maintenance: "Maintenance",
        addOns: "Add-Ons"
    };

    const groupedItems = useMemo(() => {
        const items = bookingState.selectedServices || [];
        return {
            packages: items.filter((i: any) => i.type === 'Package'),
            repairs: items.filter((i: any) => i.type === 'Repair'),
            paints: items.filter((i: any) => i.type === 'Paint'),
            maintenance: items.filter((i: any) => i.type === 'Maintenance'),
            addOns: items.filter((i: any) => i.type === 'AddOn'),
        };
    }, [bookingState.selectedServices]);

    const handleRemoveItem = (id: string | number, type: string) => {
        dispatch(removeBookingItem({id, type}));
        showToast("Item removed", "success");
    };

    // --- Form ---
    const {register, setValue} = useForm({
        resolver: zodResolver(vehicleHistorySchema),
        defaultValues: {
            vehicle_no: "", owner_name: "", contact_no: "",
            mileage: "", oil_type: "", service_center: "", service_advisor: ""
        }
    });

    // --- Queries ---
    const {data: branches} = useBranches();
    const {data: branchDetails} = useBranchDetails(selectedBranchId!);

    // --- Effect 1: Hydrate Form Data from Redux ---
    useEffect(() => {
        if (bookingState.isFromServicePark && bookingState.vehicleData) {
            const vData = bookingState.vehicleData;
            Object.keys(vData).forEach((key) => setValue(key as any, vData[key]));
        }
    }, [bookingState, setValue]);

    // --- Effect 2: Auto-Select Branch based on Form Data ---
    useEffect(() => {
        // Only run if branches are loaded and we haven't selected one yet (or want to overwrite)
        if (branches && branches.length > 0 && bookingState.vehicleData?.service_center) {
            const formBranchName = bookingState.vehicleData.service_center;

            // Find the branch ID that matches the name in the form
            const matchedBranch = branches.find((b: any) =>
                b.name.toLowerCase().trim() === formBranchName.toLowerCase().trim()
            );

            if (matchedBranch) {
                setSelectedBranchId(matchedBranch.id);
            }
        }
    }, [branches, bookingState.vehicleData]);

    const serviceTypes = React.useMemo(() => {
        if (!branchDetails?.serviceLines) return [];
        const types = new Set(branchDetails.serviceLines.map((l: any) => l.type));
        return Array.from(types).map(t => ({value: t, label: t}));
    }, [branchDetails]);

    const serviceLines = React.useMemo(() => {
        if (!branchDetails?.serviceLines || !selectedServiceType) return [];
        return branchDetails.serviceLines
            .filter((l: any) => l.type === selectedServiceType && l.status === 'ACTIVE')
            .map((l: any) => ({value: l.id, label: `${l.name} (${l.advisor})`}));
    }, [branchDetails, selectedServiceType]);

    const {data: availabilityData} = useBookingAvailability(selectedBranchId, selectedLineId, calendarMonth);
    const {
        data: dailyBookings,
        isLoading: loadingSlots
    } = useDailyBookings(selectedBranchId, selectedLineId, selectedDateString);
    const bookingMutation = useSubmitBooking();

    // --- Handlers ---
    const disabledDate = (current: dayjs.Dayjs) => {
        if (!availabilityData?.unavailableDates) return false;
        const dateStr = current.format('YYYY-MM-DD');
        return availabilityData.unavailableDates.some((d: any) => d.date === dateStr);
    };

    const dateCellRender = (date: dayjs.Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const dotColors = availabilityData?.dots?.[dateStr] || [];
        return (
            <div className="flex justify-center items-end h-full pb-1 gap-1">
                {dotColors.slice(0, 3).map((color: string, i: number) => ( // Limit to 3 dots for UI
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                        color === 'green' ? 'bg-[#039855]' : color === 'red' ? 'bg-[#DB2727]' : 'bg-[#FF961B]'
                    }`}/>
                ))}
            </div>
        );
    };

    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
        setSelectedSlots([]); // Clear slots on date change
    };

    // --- FIX: Ensure consistent return type (Object) ---
    const getSlotStatus = (slotStart: string): SlotStatus => {
        if (!dailyBookings) return {status: 'available', data: null};

        const booking = dailyBookings.find((b: any) => b.start_time.substring(0, 5) === slotStart);
        if (booking) return {status: 'booked', data: booking};

        if (selectedSlots.includes(slotStart)) return {status: 'pending', data: null};
        return {status: 'available', data: null};
    };

    const toggleSlot = (start: string) => {
        const {status} = getSlotStatus(start);
        if (status === 'booked') return;
        setSelectedSlots(prev => prev.includes(start) ? prev.filter(s => s !== start) : [...prev, start]);
    };

    const handleSubmitBooking = () => {
        if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
            showToast("Please select slots", "error");
            return;
        }
        const slotsPayload = selectedSlots.map(start => {
            const slotObj = TIME_SLOTS.find(ts => ts.start === start);
            return {start: slotObj?.start, end: slotObj?.end};
        });

        bookingMutation.mutate({
            branch_id: selectedBranchId,
            service_line_id: selectedLineId,
            booking_date: selectedDateString,
            slots: slotsPayload,
            vehicle_no: bookingState.vehicleData?.vehicle_no,
            customer_id: bookingState.vehicleData?.customer_id,
        }, {
            onSuccess: () => {
                showToast("Booking created successfully", "success");
                setSelectedSlots([]);
                setIsConfirmModalOpen(false);
            },
            onError: (err: any) => showToast(err.response?.data?.message || "Failed", "error")
        });
    };

    const branchName = branches?.find((b: any) => b.id === selectedBranchId)?.name || "Unknown Branch";
    const lineLabel = serviceLines.find((l: any) => l.value === selectedLineId)?.label || "Unknown Line";

    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast}/>

            <div className="max-w-[1800px] mx-auto container">

                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-8">Indra Service Park Sales Dashboard</h1>

                    {/* 1. Vehicle Details (Read Only / Prefilled) */}
                    <section className="bg-white/60 rounded-[45px] px-14 py-10 mb-8 border border-white shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-semibold text-[22px]">Last Service Details</h2>
                        </div>
                        <div className="grid grid-cols-4 gap-6 opacity-80 pointer-events-none">
                            <FormField label="Mileage" register={register("mileage")}/>
                            <FormField label="Oil Type" register={register("oil_type")}/>
                            <FormField label="Service Center" register={register("service_center")}/>
                            <FormField label="Service Advisor" register={register("service_advisor")}/>
                        </div>
                    </section>

                    {/*{repairsTotal > 0 && (*/}
                    {/*    <section*/}
                    {/*        id="repairs-section"*/}
                    {/*        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">*/}
                    {/*        <div*/}
                    {/*            className="w-full">*/}
                    {/*            <div className="flex flex-row items-center justify-between">*/}
                    {/*                <h2 className="text-xl md:text-[22px] font-semibold text-black mb-8 px-4">Repairs</h2>*/}
                    {/*                <div className="flex flex-row gap-6">*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="overflow-x-auto">*/}
                    {/*                <table className="w-full text-black">*/}
                    {/*                    <thead>*/}
                    {/*                    <tr className="border-b-2 border-[#CCCCCC] text-[#575757] justify-between font-medium text-lg">*/}
                    {/*                        <th className="py-5 px-4 text-left">Repairs</th>*/}
                    {/*                        <th className="py-5 px-4 text-right justify-items-end">Estimate Price*/}
                    {/*                        </th>*/}
                    {/*                    </tr>*/}
                    {/*                    </thead>*/}
                    {/*                    <tbody>*/}
                    {/*                    {groupedItems.repairs.map((item, index) => (*/}
                    {/*                        <tr key={index}*/}
                    {/*                            className="group text-lg font-medium justify-between text-[#1D1D1D] hover:bg-red-50/30 transition-colors duration-200">*/}
                    {/*                            <td className="py-4 px-4 text-[#1D1D1D]">{item.name}</td>*/}
                    {/*                            /!*<td className="py-4 px-4 text-right text-[#1D1D1D]">LKR {item.price.toLocaleString()}</td>*!/*/}
                    {/*                            <td className="py-3 px-4 text-right">*/}
                    {/*                                <div className="flex items-center justify-end gap-4">*/}
                    {/*                                    /!* Price (Visible by default) *!/*/}
                    {/*                                    <span className="text-[#1D1D1D] text-lg font-medium group-hover:mr-2 transition-all duration-200">*/}
                    {/*                                    LKR {item.price.toLocaleString()}*/}
                    {/*                                </span>*/}

                    {/*                                    /!* Remove Button (Visible on Hover) *!/*/}
                    {/*                                    <button*/}
                    {/*                                        onClick={() => removeItem(item.id, item.type)}*/}
                    {/*                                        className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 p-1 hover:bg-red-100 rounded-full"*/}
                    {/*                                        title="Remove item"*/}
                    {/*                                        aria-label={`Remove ${item.name}`}*/}
                    {/*                                    >*/}
                    {/*                                        <Image*/}
                    {/*                                            src="/close.svg"*/}
                    {/*                                            alt="remove"*/}
                    {/*                                            width={32}*/}
                    {/*                                            height={32}*/}
                    {/*                                            className="w-8 h-8 opacity-100"*/}
                    {/*                                        />*/}
                    {/*                                    </button>*/}
                    {/*                                </div>*/}
                    {/*                            </td>*/}
                    {/*                        </tr>*/}
                    {/*                    ))}*/}
                    {/*                    <tr className="border-y-1 border-[#575757]">*/}
                    {/*                        <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total*/}
                    {/*                            Estimate*/}
                    {/*                            Price*/}
                    {/*                        </td>*/}
                    {/*                        <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">*/}
                    {/*                            LKR {groupedItems.repairs.reduce((sum, i) => sum + i.price, 0).toLocaleString()}*/}
                    {/*                        </td>*/}
                    {/*                    </tr>*/}
                    {/*                    </tbody>*/}
                    {/*                </table>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </section>*/}
                    {/*)}*/}


                    {Object.entries(groupedItems).map(([key, items]: [string, any[]]) => {
                        // 1. Skip if no items in this category
                        if (!items || items.length === 0) return null;

                        // 2. Calculate Subtotal for this specific table
                        const categorySubTotal = items.reduce((sum, item) => sum + item.price, 0);

                        // 3. Get Display Title
                        const title = categoryTitles[key] || key.charAt(0).toUpperCase() + key.slice(1);

                        return (
                            <section
                                key={key}
                                id={`${key}-section`}
                                className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center mb-8 border border-white shadow-sm"
                            >
                                <div className="w-full">
                                    {/* Header */}
                                    <div className="flex flex-row items-center justify-between mb-6">
                                        <h2 className="text-xl md:text-[22px] font-semibold text-black px-4">
                                            {title}
                                        </h2>
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-black border-collapse">
                                            <thead>
                                            <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                                <th className="py-4 px-4 text-left w-2/3">Description</th>
                                                <th className="py-4 px-4 text-right w-1/3">Estimate Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/* Items Rows */}
                                            {items.map((item, index) => (
                                                <tr
                                                    key={`${item.type}-${item.id}`}
                                                    className="group text-lg font-medium text-[#1D1D1D] hover:bg-red-50/30 transition-colors duration-200 border-b border-gray-200/50 last:border-0"
                                                >
                                                    <td className="py-4 px-4 text-[#1D1D1D] pl-8">
                                                        {item.name}
                                                    </td>

                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-4">
                                                            {/* Price */}
                                                            <span
                                                                className="text-[#1D1D1D] text-lg font-medium group-hover:mr-2 transition-all duration-200">
                                                LKR {item.price.toLocaleString()}
                                            </span>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id, item.type)}
                                                                className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200 p-1.5 hover:bg-red-100 rounded-full flex-shrink-0"
                                                                title="Remove item"
                                                                aria-label={`Remove ${item.name}`}
                                                            >
                                                                <Image
                                                                    src="/close.svg"
                                                                    alt="remove"
                                                                    width={20}
                                                                    height={20}
                                                                    className="w-8 h-8 opacity-100"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="border-y-1 border-[#575757]">
                                                <td className="py-4 px-4 font-bold text-lg text-[#1D1D1D]">Total
                                                    Estimate
                                                    Price
                                                </td>
                                                <td className="py-4 px-4 font-bold text-lg text-right text-[#1D1D1D]">
                                                    LKR {categorySubTotal.toLocaleString()}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        );
                    })}

                    {/* 2. Main Schedule Section */}
                    <section className="bg-white/60 rounded-[45px] px-14 py-12 mb-8 border border-white shadow-sm">

                        {/* Header Controls */}
                        <div className="flex items-center justify-between gap-[80px] mb-12">
                            <div className="flex flex-row items-center gap-[80px]">
                            <h2 className="font-bold text-[28px] text-[#101828]">Service Schedule</h2>

                            <div className="flex gap-4">
                                <Select
                                    className="w-30 h-10 custom-select"
                                    placeholder="Select Branch"
                                    bordered={false}
                                    suffixIcon={<svg className="" width="10" height="6"
                                                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                              fill="#575757"/>
                                    </svg>}
                                    options={branches?.map((b: any) => ({value: b.id, label: b.name}))}
                                    // ADDED: Value prop binding
                                    value={selectedBranchId}
                                    onChange={(val) => {
                                        setSelectedBranchId(val);
                                        setSelectedServiceType(null);
                                        setSelectedLineId(null);
                                    }}
                                />
                                <Select
                                    className="w-30 h-10 custom-select"
                                    placeholder="Service Type"
                                    bordered={false}
                                    disabled={!selectedBranchId}
                                    suffixIcon={<svg className="" width="10" height="6"
                                                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                              fill="#575757"/>
                                    </svg>}
                                    options={serviceTypes}
                                    value={selectedServiceType}
                                    onChange={(val) => {
                                        setSelectedServiceType(val);
                                        setSelectedLineId(null);
                                    }}
                                />
                                <Select
                                    className="w-30 h-10 custom-select"
                                    placeholder="Select Line"
                                    bordered={false}
                                    disabled={!selectedServiceType}
                                    suffixIcon={<svg className="" width="10" height="6"
                                                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                              fill="#575757"/>
                                    </svg>}
                                    options={serviceLines}
                                    value={selectedLineId}
                                    onChange={setSelectedLineId}
                                />
                            </div>
                            </div>

                            <div
                                // className="mt-8 pl-[80px] flex justify-between items-center border-t border-gray-200 pt-6"
                                className="justify-end"
                            >
                                <button
                                    onClick={handleConfirmClick}
                                    disabled={bookingMutation.isPending || selectedSlots.length === 0}
                                    className="bg-[#DB2727] text-white px-8 py-2 rounded-full font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 justify-end"
                                >
                                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16">
                            {/* LEFT: Calendar */}
                            <div className="w-full lg:w-5/12">
                                <ConfigProvider theme={{
                                    token: {
                                        colorPrimary: '#DB2727',
                                        fontFamily: 'Montserrat, sans-serif',
                                    },
                                }}>
                                    <Calendar
                                        value={selectedDate}
                                        onSelect={handleSelectDate}
                                        onPanelChange={(val) => {
                                            setCalendarMonth(val.format('YYYY-MM'));
                                            setSelectedDate(val);
                                        }}
                                        cellRender={dateCellRender}
                                        disabledDate={disabledDate}
                                        fullscreen={false}
                                        className="glass-calendar"
                                        headerRender={({value, onChange}) => {
                                            const current = value.clone();
                                            return (
                                                <div className="flex items-center justify-between mb-6 px-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {current.format('MMMM YYYY')}
                                                </span>
                                                    <div className="flex gap-4">
                                                        <button onClick={() => onChange(current.subtract(1, 'month'))}>
                                                            <Image src="/prev-arrow.svg" alt="prev" width={24}
                                                                   height={24} className="w-5 h-5"/>
                                                        </button>
                                                        <button onClick={() => onChange(current.add(1, 'month'))}>
                                                            <Image src="/next-arrow.svg" alt="next" width={24}
                                                                   height={24} className="w-5 h-5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </ConfigProvider>

                            {/* Legend */}
                            <div className="flex gap-6 mt-8 pl-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#DB2727]"></span>
                                    <span className="text-sm font-medium text-gray-600">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF961B]"></span>
                                    <span className="text-sm font-medium text-gray-600">Pending</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#039855]"></span>
                                    <span className="text-sm font-medium text-gray-600">Available</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Time Slots (Figma Accurate) */}
                        <div className="w-full lg:w-7/12 relative">
                            {/* Timeline Decoration Line */}
                            <div className="absolute left-[60px] top-0 bottom-0 w-[1px] bg-gray-200 hidden md:block"></div>

                                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                    {loadingSlots ? (
                                        <div className="flex justify-center py-20"><Spin size="large"/></div>
                                    ) : (
                                        TIME_SLOTS.map((slot) => {
                                            const {status, data} = getSlotStatus(slot.start);

                                            // Dynamic Styling based on Status
                                            let cardBg = "bg-[#D1FADF]"; // Green (Available)
                                            let badgeBg = "bg-[#A6F4C5]";
                                            let badgeText = "Available";
                                            let badgeTextColor = "text-[#027A48]";
                                            let iconColorClass = "bg-[#12B76A]"; // Green icon

                                            if (status === 'booked') {
                                                cardBg = "bg-[#FFD8D8]"; // Red (Booked)
                                                badgeBg = "bg-[#FFBABA]";
                                                badgeText = "Booked";
                                                badgeTextColor = "text-[#7F1D1D]";
                                                iconColorClass = "bg-[#F04438]"; // Red icon
                                            } else if (status === 'pending') {
                                                cardBg = "bg-[#FFECD1]"; // Orange (Pending/Selected)
                                                badgeBg = "bg-[#FFD8A8]";
                                                badgeText = "Pending";
                                                badgeTextColor = "text-[#7C2D12]";
                                                iconColorClass = "bg-[#F79009]"; // Orange icon
                                            }

                                            return (
                                                <div key={slot.start}
                                                     className="flex items-center gap-6 relative group">
                                                    {/* Time Label (Left) */}
                                                    <div
                                                        className="w-[60px] text-right font-medium text-gray-500 text-lg">
                                                        {slot.start}
                                                    </div>

                                                    {/* Card */}
                                                    <div
                                                        onClick={() => toggleSlot(slot.start)}
                                                        className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 ${cardBg} ${status !== 'booked' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-90'}`}
                                                    >
                                                        {/* Left Content */}
                                                        <div className="flex items-center gap-4">
                                                            {/* Circle Icon */}
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-lg ${iconColorClass}`}>
                                                                {status === 'available' ? '+' : (data ? dayjs(data.booking_date).date() : selectedDate.date())}
                                                            </div>

                                                            {/* Text Info */}
                                                            <div>
                                                                <h4 className="font-bold text-lg text-gray-900">
                                                                    {status === 'booked'
                                                                        ? `${(data as any)?.vehicle_no || 'Unknown'}`
                                                                        : status === 'pending'
                                                                            ? `${bookingState.vehicleData?.vehicle_no || 'You'}`
                                                                            : 'Available'}
                                                                </h4>
                                                                <p className="text-gray-600 text-sm font-medium">{slot.label}</p>
                                                            </div>
                                                        </div>

                                                        {/* Right Badge */}
                                                        <div
                                                            className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${badgeBg} ${badgeTextColor}`}>
                                                            {badgeText}
                                                            {/*<Image src="/chevron-down-mini.svg" alt="v" width={10} height={10} className="opacity-60" />*/}
                                                            <svg className="" width="10" height="6"
                                                                 viewBox="0 0 10 6" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                                    fill="#575757"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer Action */}

                            </div>
                        </div>
                    </section>
                </main>

            </div>

            {isConfirmModalOpen && (
                <Modal
                    title="Confirm Booking Details"
                    onClose={() => setIsConfirmModalOpen(false)}
                    actionButton={{
                        label: bookingMutation.isPending ? "Booking..." : "Submit",
                        onClick: handleSubmitBooking,
                        disabled: bookingMutation.isPending,
                    }}
                >
                    <div className="space-y-8 px-2">
                        {/* 1. Header Info Grid */}
                        <div className="grid grid-cols-2 gap-8 border-b border-gray-200 pb-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Details</h3>
                                <p className="text-lg font-semibold text-gray-900">{bookingState.vehicleData?.owner_name || "N/A"}</p>
                                <p className="text-gray-600">{bookingState.vehicleData?.contact_no}</p>
                                <p className="text-gray-600">{bookingState.vehicleData?.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Vehicle Details</h3>
                                <div className="flex items-center gap-3">
                                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
                                        {bookingState.vehicleData?.vehicle_no}
                                    </span>
                                    <span className="text-gray-600">
                                        {bookingState.vehicleData?.vehicle_make} {bookingState.vehicleData?.vehicle_model}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">Mileage: {bookingState.vehicleData?.mileage || "N/A"}</p>
                            </div>
                        </div>

                        {/* 2. Booking Specifics */}
                        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                                <Image src="/calendar.svg" alt="calendar" width={20} height={20} /> {/* Ensure you have an icon or remove */}
                                Appointment Schedule
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Date</p>
                                    <p className="text-lg font-medium text-blue-900">{selectedDate.format('dddd, DD MMMM YYYY')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Location</p>
                                    <p className="text-lg font-medium text-blue-900">{branchName}</p>
                                    <p className="text-sm text-blue-700">{lineLabel}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-500 font-bold uppercase">Time Slots</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedSlots.sort().map(slot => (
                                            <span key={slot} className="bg-white text-blue-600 px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Financial Summary */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                {/* List of items */}
                                <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {bookingState.selectedServices?.map((item: any) => (
                                        <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                                            <span className="text-gray-700">{item.name}</span>
                                            <span className="font-medium text-gray-900">LKR {item.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-gray-300 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>LKR {bookingState.totals.subTotal.toLocaleString()}</span>
                                    </div>
                                    {bookingState.totals.discount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Discount</span>
                                            <span>- LKR {bookingState.totals.discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-[#DB2727] pt-2 mt-2 border-t border-gray-200">
                                        <span>Total Amount</span>
                                        <span>LKR {bookingState.totals.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}


            {/* Global Styles for AntD Calendar overrides */}
            <style jsx global>{`
                .glass-calendar .ant-picker-calendar-header {
                    padding-bottom: 20px;
                }

                .glass-calendar .ant-picker-panel {
                    background: transparent !important;
                }

                .glass-calendar .ant-picker-calendar-date {
                    height: 60px !important;
                    width: 60%;
                }

                /* Custom Select Dropdowns */
                .custom-select .ant-select-selector {
                    background-color: transparent !important;
                    border: none !important;
                    font-size: 20px !important;
                    font-weight: 600 !important;
                    color: #101828 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
}

export default ServiceParkBooking;