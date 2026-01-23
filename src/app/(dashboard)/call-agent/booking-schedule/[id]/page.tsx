"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Badge, Calendar, ConfigProvider, Spin } from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useServiceBooking, useBookingAvailability, useDailyBookings, useRescheduleBooking, useBranchDetails } from "@/hooks/useServicePark";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import Modal from "@/components/Modal";

// Helper for slots
interface TimeSlot {
    start: string;
    end: string;
    label: string;
}
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

const ReschedulePage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();
    const bookingId = Number(params.id);

    // State
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM'));
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Fetch existing booking
    const { data: booking, isLoading: loadingBooking } = useServiceBooking(bookingId);

    // Derived State
    const selectedDateString = selectedDate.format('YYYY-MM-DD');
    const branchId = booking?.branch_id;
    const lineId = booking?.service_line_id;

    // Fetch Availability
    const { data: availabilityData } = useBookingAvailability(branchId, lineId, calendarMonth);
    const { data: dailyBookings, isLoading: loadingSlots } = useDailyBookings(branchId, lineId, selectedDateString);
    const { data: branchDetails } = useBranchDetails(branchId);

    const rescheduleMutation = useRescheduleBooking();

    // Set initial date from booking
    useEffect(() => {
        if (booking) {
            setSelectedDate(dayjs(booking.booking_date));
            setCalendarMonth(dayjs(booking.booking_date).format('YYYY-MM'));
        }
    }, [booking]);

    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
        setSelectedSlots([]);
    };

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

    // Slot Logic
    const getSlotStatus = (slotStart: string) => {
        if (!dailyBookings) return { status: 'available', data: null };

        // If rescheduling, we should theoretically treat OUR booking's slot as available to us?
        // But the "dailyBookings" returns ALL booked slots. 
        // If we select the SAME DAY, our current booking will show as "booked".
        // We need to exclude our current booking from "booked" status so we can re-select it if we just want to change time on same day?
        // Actually, if we are rescheduling, we likely want to pick a NEW time. 
        // If we pick the SAME time, it's effectively a no-op, but fine.

        const existingBooking = dailyBookings.find((b: any) => b.start_time.substring(0, 5) === slotStart);

        // If existingBooking ID matches our booking ID, treat as "Mine" (Available to keep?)
        // Wait, dailyBookings from backend might not include ID. I need to check `getDailySlots` in `servicePark.controller.ts`.
        // It uses `ServiceParkBooking.findAll`. It SHOULD return IDs.

        if (existingBooking) {
            // If this slot belongs to the booking we are modifying, it's effectively "Available" for us to keep.
            // But if we select it, we add it to `selectedSlots`.
            if (existingBooking.id === bookingId) {
                return { status: 'available', data: null }; // Treat as available so we can select it (or re-select it)
            }
            return { status: 'booked', data: existingBooking };
        }

        if (selectedSlots.includes(slotStart)) return { status: 'pending', data: null };
        return { status: 'available', data: null };
    };

    const toggleSlot = (start: string) => {
        const { status } = getSlotStatus(start);
        if (status === 'booked') return;
        setSelectedSlots(prev => prev.includes(start) ? prev.filter(s => s !== start) : [...prev, start]);
    };

    const handleConfirm = () => {
        if (selectedSlots.length === 0) {
            showToast("Please select at least one slot", "error");
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleSubmitReschedule = () => {
        const slotsPayload = selectedSlots.map(start => {
            const slotObj = TIME_SLOTS.find(ts => ts.start === start);
            return { start: slotObj?.start, end: slotObj?.end };
        });

        rescheduleMutation.mutate({
            id: bookingId,
            data: {
                branch_id: branchId,
                service_line_id: lineId,
                booking_date: selectedDateString,
                slots: slotsPayload,
                customer_id: booking.customer_id,
                vehicle_no: booking.vehicle_no
            }
        }, {
            onSuccess: () => {
                showToast("Booking rescheduled successfully", "success");
                setTimeout(() => router.push('/call-agent/booking-schedule'), 1500);
            },
            onError: (err: any) => showToast(err.response?.data?.message || "Failed to reschedule", "error")
        });
    };

    if (loadingBooking) return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>;
    if (!booking) return <div className="text-center pt-20">Booking not found</div>;

    const branchName = branchDetails?.name || booking.Branch?.name || "Unknown Branch";
    const serviceName = booking.ServiceLine?.name || "Unknown Service";

    return (
        <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />

            <div className="max-w-[1800px] mx-auto container">
                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-8">Reschedule Booking #{bookingId}</h1>

                    {/* Info Card */}
                    <section className="bg-white/60 rounded-[45px] px-14 py-10 mb-8 border border-white shadow-sm">
                        <h2 className="font-semibold text-[22px] mb-4">Current Booking Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Customer</label>
                                <p className="text-lg font-medium">{booking.Customer?.customer_name || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Vehicle</label>
                                <p className="text-lg font-medium">{booking.vehicle_no || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Branch</label>
                                <p className="text-lg font-medium">{branchName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Service Line</label>
                                <p className="text-lg font-medium">{serviceName}</p>
                            </div>
                        </div>
                    </section>

                    {/* Calendar & Slots */}
                    <section className="bg-white/60 rounded-[45px] px-14 py-12 mb-8 border border-white shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-semibold text-[22px]">Select New Date & Time</h2>
                            <button
                                onClick={handleConfirm}
                                disabled={selectedSlots.length === 0 || rescheduleMutation.isPending}
                                className="bg-[#DB2727] text-white px-8 py-2 rounded-full font-medium hover:bg-red-700 transition disabled:bg-gray-400"
                            >
                                {rescheduleMutation.isPending ? "Processing..." : "Confirm Reschedule"}
                            </button>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-16">
                            <div className="w-full lg:w-5/12">
                                <ConfigProvider theme={{
                                    token: { colorPrimary: '#DB2727', fontFamily: 'Montserrat, sans-serif' },
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
                                                        <button onClick={() => onChange(current.subtract(1, 'month'))}>
                                                            <Image src="/prev-arrow.svg" alt="prev" width={24} height={24} className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => onChange(current.add(1, 'month'))}>
                                                            <Image src="/next-arrow.svg" alt="next" width={24} height={24} className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </ConfigProvider>
                            </div>

                            <div className="w-full lg:w-7/12 relative">
                                <div className="absolute left-[60px] top-0 bottom-0 w-[1px] bg-gray-200 hidden md:block"></div>
                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                    {loadingSlots ? <div className="flex justify-center py-20"><Spin /></div> : (
                                        TIME_SLOTS.map((slot) => {
                                            const { status, data } = getSlotStatus(slot.start);
                                            let cardBg = "bg-[#A7FFA780]";
                                            let badgeBg = "bg-[#A7FFA7]";
                                            let badgeText = "Available";
                                            let iconColorClass = "bg-[#A7FFA7]";

                                            if (status === 'booked') {
                                                cardBg = "bg-[#FFA7A780]";
                                                badgeBg = "bg-[#FF9191]";
                                                badgeText = "Booked";
                                                iconColorClass = "bg-[#FF9191]";
                                            } else if (status === 'pending') {
                                                cardBg = "bg-[#FFCBA780]";
                                                badgeBg = "bg-[#FFCBA7]";
                                                badgeText = "Pending";
                                                iconColorClass = "bg-[#FFCBA7]";
                                            }

                                            const isClickable = status !== 'booked';

                                            return (
                                                <div key={slot.start} className={`flex items-center gap-6 relative group ${!isClickable ? 'cursor-not-allowed' : ''}`}>
                                                    <div className="w-[60px] text-right font-medium text-lg text-gray-500">{slot.start}</div>
                                                    <div
                                                        onClick={() => isClickable && toggleSlot(slot.start)}
                                                        className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all ${cardBg} ${isClickable ? 'cursor-pointer hover:shadow-md' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-white font-bold text-lg ${iconColorClass}`}>
                                                                {status === 'available' ? '+' : (data ? dayjs(data.booking_date).date() : selectedDate.date())}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-[16px] text-[#1D1D1D]">
                                                                    {status === 'booked' ? 'Booked' : status === 'pending' ? 'Selected' : 'Available'}
                                                                </h4>
                                                                <p className="text-sm font-medium text-gray-600">{slot.label}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`px-4 py-1 rounded-full text-xs font-semibold ${badgeBg} text-[#1D1D1D]`}>
                                                            {badgeText}
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
                    title="Confirm Reschedule"
                    onClose={() => setIsConfirmModalOpen(false)}
                    actionButton={{
                        label: rescheduleMutation.isPending ? "Processing..." : "Confirm",
                        onClick: handleSubmitReschedule,
                        disabled: rescheduleMutation.isPending
                    }}
                >
                    <div className="p-4">
                        <p className="text-lg">Are you sure you want to reschedule this booking to <strong>{selectedDateString}</strong> at <strong>{selectedSlots.sort().join(", ")}</strong>?</p>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ReschedulePage;