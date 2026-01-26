/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Badge, Calendar, ConfigProvider, Select } from "antd";
import dayjs from "dayjs";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { z } from "zod";
import { removeBookingItem } from "@/redux/slices/bookingSlice";
import {
    useBookingAvailability,
    useBranchDetails,
    useBranches,
    useDailyBookings,
    useRescheduleBooking,
    useServiceBooking
} from "@/hooks/useServicePark";
import FormField from "@/components/FormField";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";
import RedSpinner from "@/components/RedSpinner";


interface TimeSlot {
    start: string;
    end: string;
    label: string;
}

interface SlotStatus {
    status: 'available' | 'booked' | 'pending';
    data: any | null;
}

const vehicleHistorySchema = z.object({
    vehicle_no: z.string().min(1, "Vehicle number is required"),
    owner_name: z.string().min(1, "Owner name is required"),
    contact_no: z.string().min(1, "Contact number is required"),
    mileage: z.string().optional(),
    oil_type: z.string().optional(),
    service_center: z.string().optional(),
    service_advisor: z.string().optional()
});

const generateTimeSlots = (): TimeSlot[] => {
    const slots = [];
    let start = 8 * 60;
    const end = 17 * 60;

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

const getGroupKeyFromServiceType = (serviceType: string | null): string | null => {
    if (!serviceType) return null;
    const normalized = serviceType.toLowerCase();

    switch (normalized) {
        case 'repair':
            return 'repairs';
        case 'paint':
            return 'paints';
        case 'package':
            return 'packages';
        case 'maintenance':
            return 'maintenance';
        case 'addon':
            return 'addOns';
        default:
            return null;
    }
};




const ReschedulePage = () => {
    const { id } = useParams();
    const { toast, showToast, hideToast } = useToast();
    const dispatch = useDispatch();
    const bookingState = useSelector((state: any) => state.booking);

    // Fetch existing booking details
    const { data: booking, isLoading: loadingBooking } = useServiceBooking(Number(id));
    const rescheduleMutation = useRescheduleBooking();

    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
    const selectedDateString = selectedDate.format('YYYY-MM-DD');

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const isSlotSelectionEnabled = !!selectedBranchId && !!selectedServiceType && !!selectedLineId;

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
        dispatch(removeBookingItem({ id, type }));
        showToast("Item removed", "success");
    };

    const { register, setValue } = useForm({
        resolver: zodResolver(vehicleHistorySchema),
        defaultValues: {
            vehicle_no: "", owner_name: "", contact_no: "",
            mileage: "", oil_type: "", service_center: "", service_advisor: ""
        }
    });

    const { data: branches } = useBranches();
    const { data: branchDetails } = useBranchDetails(selectedBranchId!);

    // Populate state from existing booking
    useEffect(() => {
        if (booking) {
            setSelectedBranchId(booking.branch_id);
            setSelectedLineId(booking.service_line_id);

            if (booking.booking_date) {
                const bDate = dayjs(booking.booking_date);
                setSelectedDate(bDate);
                setCalendarMonth(bDate.format('YYYY-MM'));
            }

            if (booking.ServiceLine?.type) {
                setSelectedServiceType(booking.ServiceLine.type);
            }

            if (booking.related_slots && Array.isArray(booking.related_slots)) {
                const slots = booking.related_slots.map((t: string) => t.substring(0, 5));
                setSelectedSlots(slots);
            } else if (booking.start_time) {
                const startTime = booking.start_time.substring(0, 5);
                setSelectedSlots([startTime]);
            }

            // Populate Form / Vehicle Details
            setValue("vehicle_no", booking.vehicle_no || "");
            setValue("owner_name", booking.Customer?.customer_name || "");
            setValue("contact_no", booking.Customer?.phone_number || "");
            setValue("service_center", booking.Branch?.name || "");
            setValue("service_advisor", booking.ServiceLine?.advisor || "");
        }
    }, [booking, setValue]);

    const serviceTypes = React.useMemo(() => {
        if (!branchDetails?.serviceLines) return [];
        const types = new Set(branchDetails.serviceLines.map((l: any) => l.type));
        return Array.from(types).map(t => ({ value: t, label: t }));
    }, [branchDetails]);

    const serviceLines = React.useMemo(() => {
        if (!branchDetails?.serviceLines || !selectedServiceType) return [];
        return branchDetails.serviceLines
            .filter((l: any) => l.type === selectedServiceType && l.status === 'ACTIVE')
            .map((l: any) => ({ value: l.id, label: `${l.name} (${l.advisor})` }));
    }, [branchDetails, selectedServiceType]);

    const { data: availabilityData } = useBookingAvailability(selectedBranchId, selectedLineId, calendarMonth);
    const {
        data: dailyBookings,
        isLoading: loadingSlots
    } = useDailyBookings(selectedBranchId, selectedLineId, selectedDateString);


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
                {dotColors.slice(0, 3).map((color: string, i: number) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-[#039855]' : color === 'red' ? 'bg-[#DB2727]' : 'bg-[#FF961B]'
                        }`} />
                ))}
            </div>
        );
    };

    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
        setSelectedSlots([]);
    };

    const getSlotStatus = (slotStart: string): SlotStatus => {
        if (!dailyBookings) return { status: 'available', data: null };

        const slotBooking = dailyBookings.find((b: any) => b.start_time.substring(0, 5) === slotStart);

        if (slotBooking) {
            // Check if this slot belongs to the current "appointment" (group of slots being edited)
            const isCurrentBooking = booking?.related_ids?.includes(slotBooking.id) || slotBooking.id === Number(id);

            if (isCurrentBooking) {
                // fall through to check selectedSlots logic (pending)
            } else {
                return { status: 'booked', data: slotBooking };
            }
        }

        if (selectedSlots.includes(slotStart)) return { status: 'pending', data: null };
        return { status: 'available', data: null };
    };

    const toggleSlot = (start: string) => {
        if (!isSlotSelectionEnabled) return;

        const { status } = getSlotStatus(start);
        if (status === 'booked') return;
        setSelectedSlots(prev => prev.includes(start) ? prev.filter(s => s !== start) : [...prev, start]);
    };

    const router = useRouter();

    const handleSubmitBooking = () => {
        if (!selectedBranchId || !selectedLineId || selectedSlots.length === 0) {
            showToast("Please select slots", "error");
            return;
        }
        const slotsPayload = selectedSlots.map(start => {
            const slotObj = TIME_SLOTS.find(ts => ts.start === start);
            return { start: slotObj?.start, end: slotObj?.end };
        });

        rescheduleMutation.mutate({
            id: Number(id),
            data: {
                branch_id: selectedBranchId,
                service_line_id: selectedLineId,
                booking_date: selectedDateString,
                slots: slotsPayload,
            }
        }, {
            onSuccess: () => {
                showToast("Booking rescheduled successfully", "success");
                setSelectedSlots([]);
                setIsConfirmModalOpen(false);
                router.push("/call-agent/booking-schedule");
            },
            onError: (err: any) => showToast(err.response?.data?.message || "Failed", "error")
        });
    };

    console.log("customer ID: ", bookingState.vehicleData?.customer_id);

    const branchName = branches?.find((b: any) => b.id === selectedBranchId)?.name || "Unknown Branch";

    // const branchName = branches?.find((b: any) => b.id === selectedBranchId)?.name || "Unknown Branch";

    const selectedLineRaw = useMemo(() => {
        if (!branchDetails?.serviceLines || !selectedLineId) return null;
        return branchDetails.serviceLines.find((l: any) => l.id === selectedLineId);
    }, [branchDetails, selectedLineId]);

    const lineLabel = selectedLineRaw?.name || "Unknown Line";
    const advisorName = selectedLineRaw?.advisor || "Jane Cooper";

    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />

            <div className="max-w-[1800px] mx-auto container">

                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-8">Service Park - Service Schedule</h1>

                    <section className="bg-white/60 rounded-[45px] px-14 py-12 mb-8 border border-white shadow-sm">

                        <div className="flex items-center justify-between gap-[80px] mb-12">
                            <div className="flex flex-row items-center gap-[80px]">
                                <h2 className="font-semibold text-[22px] text-[#000000]">Service Schedule</h2>

                                <div className="flex gap-4">
                                    <Select
                                        className="w-30 h-10 custom-select"
                                        placeholder="Select Branch"
                                        bordered={false}
                                        suffixIcon={<svg className="" width="10" height="6"
                                            viewBox="0 0 10 6" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                fill="#575757" />
                                        </svg>}
                                        options={branches?.map((b: any) => ({ value: b.id, label: b.name }))}
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
                                            viewBox="0 0 10 6" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                fill="#575757" />
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
                                            viewBox="0 0 10 6" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                fill="#575757" />
                                        </svg>}
                                        options={serviceLines}
                                        value={selectedLineId}
                                        onChange={setSelectedLineId}
                                    />
                                </div>
                            </div>

                            <div className="justify-end">
                                <button
                                    onClick={handleConfirmClick}
                                    disabled={rescheduleMutation.isPending || selectedSlots.length === 0}
                                    className="bg-[#DB2727] text-white px-8 py-2 rounded-full font-medium text-base hover:bg-red-700 transition disabled:bg-gray-400 justify-end"
                                >
                                    {rescheduleMutation.isPending ? "Processing..." : "Save"}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16">
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
                                        headerRender={({ value, onChange }) => {
                                            const current = value.clone();
                                            return (
                                                <div className="flex items-center justify-between px-2 py-4">
                                                    <span className="text-[14px] font-bold text-[#1D1D1D]">
                                                        {current.format('MMMM YYYY')}
                                                    </span>
                                                    <div className="flex gap-4">
                                                        <button className="cursor-pointer"
                                                            onClick={() => onChange(current.subtract(1, 'month'))}>
                                                            <Image src="/prev-arrow.svg" alt="prev" width={24}
                                                                height={24} className="w-4 h-4" />
                                                        </button>
                                                        <button className="cursor-pointer"
                                                            onClick={() => onChange(current.add(1, 'month'))}>
                                                            <Image src="/next-arrow.svg" alt="next" width={24}
                                                                height={24} className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </ConfigProvider>

                                {/* Legend */}
                                <div className="flex gap-6 mt-8 pl-4 justify-center">
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

                            <div className="w-full lg:w-7/12 relative">
                                <div
                                    className="absolute left-[60px] top-0 bottom-0 w-[1px] bg-gray-200 hidden md:block"></div>

                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                    {/*{!isSlotSelectionEnabled ? (*/}
                                    {/*    <div*/}
                                    {/*        className="flex flex-col items-center justify-center h-[400px] text-gray-400">*/}
                                    {/*        /!* You can add a placeholder icon here *!/*/}
                                    {/*        <p className="text-lg font-medium text-center px-8">*/}
                                    {/*            Please select a Branch, Service Type, and Service Line to view available*/}
                                    {/*            time slots.*/}
                                    {/*        </p>*/}
                                    {/*    </div>*/}
                                    {/*) : (*/}
                                    {/*    loadingSlots ? (*/}
                                    {/*        <div className="flex justify-center py-20"><Spin size="large"/></div>*/}
                                    {/*    ) : (*/}
                                    {isSlotSelectionEnabled && loadingSlots ? (
                                        <RedSpinner />
                                    ) : (
                                        TIME_SLOTS.map((slot) => {
                                            const { status, data } = getSlotStatus(slot.start);

                                            let cardBg = "bg-[#A7FFA780]";
                                            let badgeBg = "bg-[#A7FFA7]";
                                            let badgeText = "Available";
                                            let badgeTextColor = "text-[#1D1D1D]";
                                            let iconColorClass = "bg-[#A7FFA7]";
                                            let isClickable = true;

                                            if (!isSlotSelectionEnabled) {
                                                // --- DISABLED STATE STYLING ---
                                                cardBg = "bg-gray-100 opacity-60 grayscale";
                                                badgeBg = "bg-gray-200";
                                                badgeText = "Locked";
                                                badgeTextColor = "text-gray-400";
                                                iconColorClass = "bg-gray-300 text-gray-100";
                                                isClickable = false;
                                            } else {
                                                // --- ENABLED STATE STYLING ---
                                                if (status === 'booked') {
                                                    cardBg = "bg-[#FFA7A780]";
                                                    badgeBg = "bg-[#FF9191]";
                                                    badgeText = "Booked";
                                                    badgeTextColor = "text-[#1D1D1D]";
                                                    iconColorClass = "bg-[#FF9191]";
                                                    isClickable = false;
                                                } else if (status === 'pending') {
                                                    cardBg = "bg-[#FFCBA780]";
                                                    badgeBg = "bg-[#FFCBA7]";
                                                    badgeText = "Pending";
                                                    badgeTextColor = "text-[#1D1D1D]";
                                                    iconColorClass = "bg-[#FFCBA7]";
                                                }
                                            }

                                            return (
                                                <div key={slot.start}
                                                    className={`flex items-center gap-6 relative group ${!isClickable ? 'cursor-not-allowed' : ''}`}>
                                                    <div
                                                        className={`w-[60px] text-right font-medium text-lg ${!isSlotSelectionEnabled ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {slot.start}
                                                    </div>

                                                    <div
                                                        onClick={() => isClickable && toggleSlot(slot.start)}
                                                        className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 ${cardBg} ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-lg ${iconColorClass}`}>
                                                                {!isSlotSelectionEnabled ? '-' : status === 'available' ? '+' : (data ? dayjs(data.booking_date).date() : selectedDate.date())}
                                                            </div>

                                                            {/*<div>*/}
                                                            {/*    <h4 className="font-semibold text-[16px] text-[#1D1D1D]">*/}
                                                            {/*        {status === 'booked'*/}
                                                            {/*            ? `${(data as any)?.vehicle_no || 'Unknown'}`*/}
                                                            {/*            : status === 'pending'*/}
                                                            {/*                ? `${bookingState.vehicleData?.vehicle_no || 'You'}`*/}
                                                            {/*                : 'Available'}*/}
                                                            {/*    </h4>*/}
                                                            {/*    <p className="text-gray-600 text-sm font-medium">{slot.label}</p>*/}
                                                            {/*</div>*/}

                                                            <div>
                                                                <h4 className={`font-semibold text-[16px] ${!isSlotSelectionEnabled ? 'text-gray-400' : 'text-[#1D1D1D]'}`}>
                                                                    {!isSlotSelectionEnabled
                                                                        ? 'Select Details'
                                                                        : status === 'booked'
                                                                            ? `${(data as any)?.vehicle_no || 'Unknown'}`
                                                                            : status === 'pending'
                                                                                ? `${bookingState.vehicleData?.vehicle_no || 'You'}`
                                                                                : 'Available'
                                                                    }
                                                                </h4>
                                                                <p className={`text-sm font-medium ${!isSlotSelectionEnabled ? 'text-gray-300' : 'text-gray-600'}`}>{slot.label}</p>
                                                            </div>

                                                        </div>

                                                        <div
                                                            className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${badgeBg} ${badgeTextColor}`}>
                                                            {badgeText}

                                                            {isSlotSelectionEnabled && (
                                                                <svg className="" width="10" height="6"
                                                                    viewBox="0 0 10 6" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                                        fill="#575757" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

            </div>

            {isConfirmModalOpen && (
                <Modal
                    title="Service Summary"
                    onClose={() => setIsConfirmModalOpen(false)}
                    actionButton={{
                        label: rescheduleMutation.isPending ? "Processing..." : "Confirm",
                        onClick: handleSubmitBooking,
                        disabled: rescheduleMutation.isPending,
                    }}
                >
                    <div className="w-[900px] rounded-[45px] border border-[#E7E7E7] px-8 relative box-border">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                            {/*<h2 className="font-semibold text-[22px] leading-[27px] text-black">Service Summary</h2>*/}

                            <div className="flex items-center gap-[10px]">
                                {/* Invoice Badge */}
                                {/*<div className="flex flex-row justify-center items-center px-[15px] py-[5px] gap-[13px] bg-[#DFDFDF] rounded-[20px] h-[28px]">*/}
                                {/*    <span className="font-medium text-[15px] leading-[18px] text-[#1D1D1D]">INV34556</span>*/}
                                {/*</div>*/}

                                {/* Date Badge */}
                                {/*<div className="flex flex-row justify-center items-center px-[15px] py-[5px] gap-[13px] bg-[#039855] rounded-[20px] h-[28px]">*/}
                                {/*    <span className="font-medium text-[15px] leading-[18px] text-white">*/}
                                {/*        {selectedDate.format('DD MMM YYYY')}*/}
                                {/*    </span>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        {/* Metadata Section (Advisor, Branch, Line) - Bullet list style */}
                        <div className="flex flex-col items-start gap-[10px] mb-8">
                            {/* Advisor */}
                            <div className="w-full flex items-center text-[18px] leading-[22px]">
                                <ul className="list-disc pl-5 marker:text-[#1D1D1D]">
                                    <li>
                                        <span className="font-medium text-[#1D1D1D] mr-2">Service Advisor:</span>
                                        <span className="font-medium text-[#575757]">{advisorName}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Branch */}
                            <div className="w-full flex items-center text-[18px] leading-[22px]">
                                <ul className="list-disc pl-5 marker:text-[#1D1D1D]">
                                    <li>
                                        <span className="font-medium text-[#1D1D1D] mr-2">Branch:</span>
                                        <span className="font-medium text-[#575757]">{branchName}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Line */}
                            <div className="w-full flex items-center text-[18px] leading-[22px]">
                                <ul className="list-disc pl-5 marker:text-[#1D1D1D]">
                                    <li>
                                        <span className="font-medium text-[#1D1D1D] mr-2">Line:</span>
                                        <span className="font-medium text-[#575757]">{lineLabel}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="flex flex-col items-start w-full mt-[30px]">
                            {/* Table Header */}
                            <div
                                className="flex flex-row items-center w-full px-[10px] pb-[20px] mb-[10px] border-b-[1.5px] border-[#CCCCCC]">
                                <span
                                    className="font-medium text-[18px] leading-[22px] text-[#575757] flex-grow">Repairs</span>
                                <div className="w-[233px] text-left">
                                    <span className="font-medium text-[18px] leading-[22px] text-[#575757]">Price</span>
                                </div>
                            </div>

                            {/* Table Body - Dynamic Items */}
                            <div className="flex flex-col w-full gap-0">
                                {bookingState.selectedServices?.map((item: any) => (
                                    <div key={`${item.type}-${item.id}`}
                                        className="flex flex-row items-center w-full px-[10px] h-[42px] mb-[10px]">
                                        <span
                                            className="font-medium text-[18px] leading-[22px] text-[#1D1D1D] flex-grow">
                                            {item.name}
                                        </span>
                                        <div className="w-[233px] text-left">
                                            <span className="font-medium text-[18px] leading-[22px] text-[#1D1D1D]">
                                                LKR {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Price Section */}
                            <div
                                className="flex flex-row items-center w-full px-[10px] h-[62px] border-y border-[#575757] mt-4">
                                <span className="font-bold text-[18px] leading-[22px] text-[#1D1D1D] flex-grow">
                                    Total Estimate Price
                                </span>
                                <div className="w-[233px] text-left">
                                    <span className="font-bold text-[18px] leading-[22px] text-[#1D1D1D]">
                                        LKR {bookingState.totals.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </Modal>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(29, 29, 29, 0.2);
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #DB2727;
                }

                /* Firefox support */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(29, 29, 29, 0.2) rgba(0, 0, 0, 0.05);
                }


                .glass-calendar .ant-picker-calendar-header {
                    padding-bottom: 20px;
                }

                .glass-calendar .ant-picker-panel {
                    background: transparent !important;
                }

                .glass-calendar .ant-picker-calendar-date {
                    height: 50px !important;
                    width: 60%;
                }

                .custom-select .ant-select-selector {
                    background-color: transparent !important;
                    border: none !important;
                    font-size: 17px !important;
                    font-weight: 500 !important;
                    color: #1D1D1D !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
            `}</style>
        </div>
    );
}

export default ReschedulePage;