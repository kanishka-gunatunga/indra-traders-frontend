"use client";
import React from "react";
import { Spin, Popconfirm } from "antd";
import { useRouter } from "next/navigation";
import { useScheduledServices, useCancelBooking } from "@/hooks/useServicePark";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";

const BookingSchedule = () => {
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();

    // Hooks - Fetch ALL bookings (no filters)
    const { data: bookings = [], isLoading: loadingBookings } = useScheduledServices();
    const cancelMutation = useCancelBooking();

    // Handlers
    const handleReschedule = (bookingId: number) => {
        router.push(`/call-agent/booking-schedule/${bookingId}`);
    };

    return (
        <div className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideToast} />

            <div className="max-w-[1800px] mx-auto container">
                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-extrabold">Service Park - Service Schedule</h1>
                    </div>

                    <section className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10">
                        {loadingBookings ? (
                            <div className="flex justify-center py-20"><Spin size="large" /></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-black">
                                    <thead>
                                        <tr className="border-b-2 border-[#CCCCCC] text-[#575757] font-medium text-lg">
                                            <th className="py-5 px-4 text-left">Service Type</th>
                                            <th className="py-5 px-4 text-left">Branch</th>
                                            <th className="py-5 px-4 text-left">Service Date</th>
                                            <th className="py-5 px-4 text-left">Time Range</th>
                                            <th className="py-5 px-4 text-left min-w-40">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map((item: any, idx: number) => (
                                                <tr key={idx} className="text-lg font-medium text-[#1D1D1D] hover:bg-white/40 transition-colors border-b border-gray-200 last:border-0">
                                                    <td className="py-4 px-4">{item.service_type}</td>
                                                    <td className="py-4 px-4">{item.branch_name}</td>
                                                    <td className="py-4 px-4">{item.booking_date}</td>
                                                    <td className="py-4 px-4">{item.time_range}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    if (item.id) handleReschedule(item.id);
                                                                    else showToast("Error: No Booking ID", "error");
                                                                }}
                                                                className="px-4 py-2 rounded-[20px] bg-[#DFDFDF] text-[#1D1D1D] hover:bg-gray-300 text-sm"
                                                            >
                                                                Reschedule
                                                            </button>

                                                            <Popconfirm
                                                                title="Cancel Booking"
                                                                description="Are you sure you want to cancel this booking?"
                                                                onConfirm={() => {
                                                                    if (item.id) {
                                                                        cancelMutation.mutate(item.id, {
                                                                            onSuccess: () => showToast("Booking cancelled", "success"),
                                                                            onError: () => showToast("Failed to cancel", "error")
                                                                        });
                                                                    } else {
                                                                        showToast("Error: No Booking ID", "error");
                                                                    }
                                                                }}
                                                                okText="Yes"
                                                                cancelText="No"
                                                                okButtonProps={{ danger: true }}
                                                            >
                                                                <button
                                                                    className="px-4 py-2 rounded-[20px] bg-[#DB2727] text-white hover:bg-red-700 text-sm shadow-md"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </Popconfirm>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-10 text-center text-gray-500">
                                                    No scheduled bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default BookingSchedule;