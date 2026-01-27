"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LogOut, Users, Clock, Info, Sparkles, X, Save, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Calendar, ConfigProvider, Select } from 'antd';
import dayjs from 'dayjs';
import { BookingDetails, BookingFormData, SelectedBooking, SlotStatus } from '@/types/serviceCenter';
import { useServiceCenterBookings } from '@/hooks/useServiceCenterBookings';
import { generateTimeSlots } from '@/utils/timeSlotUtils';


const COLORS = {
    primary: '#DB2727',
    primaryHover: '#C02020',
    success: '#039855',
    warning: '#FF961B',
    textPrimary: '#1D1D1D',
    textSecondary: '#575757',
    borderGray: '#9CA3AF',
    backgroundLight: '#F9FAFB',
    backgroundGray: '#F3F4F6',
} as const;

const FONT_FAMILY = 'Montserrat, sans-serif';

const DROPDOWN_ARROW_SVG = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.00244 10.207L11.8564 6.354L11.1494 5.646L8.00244 8.793L4.85644 5.646L4.14844 6.354L8.00244 10.207Z" fill="black" />
    </svg>
);

const STATUS_ARROW_SVG = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.00244 10.207L11.8564 6.354L11.1494 5.646L8.00244 8.793L4.85644 5.646L4.14844 6.354L8.00244 10.207Z" fill="#039855" />
    </svg>
);

const INPUT_STYLE = {
    height: '45px',
    borderRadius: '15px',
    paddingTop: '12px',
    paddingRight: '16px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    background: COLORS.backgroundLight,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: COLORS.borderGray,
    fontFamily: FONT_FAMILY,
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: COLORS.textPrimary,
} as const;

const LABEL_STYLE = {
    fontFamily: FONT_FAMILY,
    fontWeight: 500,
} as const;


export default function ServiceCenterDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null);
    const [bookingStatus, setBookingStatus] = useState<"PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED">('BOOKED');
    const [isAvailableSlot, setIsAvailableSlot] = useState(false);
    const [formData, setFormData] = useState<BookingFormData>({
        vehicleCode: '',
        phoneNumber: '',
        customerName: '',
    });

    const {
        serviceTypes,
        serviceLines,
        bookings,
        calendarDots,
        stats,
        loading,
        error,
        createBooking,
        updateBooking
    } = useServiceCenterBookings(
        selectedDate,
        selectedLineId,
        selectedServiceType
    );

    const TIME_SLOTS = generateTimeSlots();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);


    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
    };

    const dateCellRender = (date: dayjs.Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        
        const dotColors = calendarDots[dateStr] || [];
        
        return (
            <div className="flex justify-start items-end w-full gap-[4px]">
                {dotColors.slice(0, 3).map((color: string, i: number) => (
                    <span
                        key={i}
                        className={`w-[7px] h-[7px] rounded-full ${
                            color === 'green' ? 'bg-[#039855]' : 
                            color === 'red' ? 'bg-[#DB2727]' : 
                            'bg-[#FF961B]'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const getSlotStatus = (slotStart: string): SlotStatus => {
        const booking = bookings.find(b => b.start_time === slotStart);

        if(!booking) {
            return { status: null, vehicleCode: null }
        }
        
        return {
            status: booking.status,
            vehicleCode: booking.vehicle_no,
        }
    };

    const getBookingDetails = (slotStart: string): BookingDetails | null => {
        const booking = bookings.find(b => b.start_time === slotStart);

        if (!booking) {
            return null;
        }

        return {
            vehicleCode: booking.vehicle_no || '',
            customerName: booking.customer_name || '',
            phoneNumber: booking.phone_number || '',
            status: booking.status,
        };
    };

    const handleSlotClick = (slot: { start: string; end: string; label: string }) => {
        const slotStatus = getSlotStatus(slot.start);

        if (slotStatus.status === null) {
            setSelectedBooking({
                slotStart: slot.start,
                slotEnd: slot.end,
                slotLabel: slot.label,
                vehicleCode: '',
                status: null,
            });
            setBookingStatus('BOOKED');
            setIsAvailableSlot(true);
            setFormData({
                vehicleCode: '',
                phoneNumber: '',
                customerName: '',
            });
            setIsModalOpen(true);
        } else {
            const bookingDetails = getBookingDetails(slot.start);
            if (bookingDetails) {
                const booking = bookings.find(b => b.start_time === slot.start);
                setSelectedBooking({
                    slotStart: slot.start,
                    slotEnd: slot.end,
                    slotLabel: slot.label,
                    vehicleCode: bookingDetails.vehicleCode,
                    status: bookingDetails.status,
                    bookingId: booking?.id,
                });
                setBookingStatus(bookingDetails.status);
                setIsAvailableSlot(false);
                setFormData({
                    vehicleCode: bookingDetails.vehicleCode,
                    phoneNumber: bookingDetails.phoneNumber,
                    customerName: bookingDetails.customerName,
                });
                setIsModalOpen(true);
            }
        }
    };

    const handleSave = async () => {
        if (!selectedBooking || !selectedLineId) return;
        
        try {
            if (isAvailableSlot) {
                // Create new booking
                await createBooking({
                    line_id: Number(selectedLineId),
                    date: selectedDate.format('YYYY-MM-DD'),
                    start_time: selectedBooking.slotStart,
                    end_time: selectedBooking.slotEnd,
                    vehicle_no: formData.vehicleCode,
                    customer_name: formData.customerName,
                    phone_number: formData.phoneNumber,
                    status: 'BOOKED'
                });
            } else if (selectedBooking.bookingId) {
                // Update existing booking status
                await updateBooking(selectedBooking.bookingId, bookingStatus);
            }
            
            setIsModalOpen(false);
        } catch (err) {
            const error = err as { 
                response?: { 
                    status?: number; 
                    data?: { message?: string } 
                }; 
                message?: string 
            };
            if (error.response?.status === 409) {
                alert('This slot is already booked. Please choose another time.');
            } else {
                alert('Failed to save booking: ' + (error.response?.data?.message || error.message || 'Unknown error'));
            }
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking?.bookingId) return;
        
        try {
            await updateBooking(selectedBooking.bookingId, 'CANCELLED');
            setIsModalOpen(false);
        } catch (err) {
            const error = err as { 
                response?: { 
                    data?: { message?: string } 
                }; 
                message?: string 
            };
            alert('Failed to cancel booking: ' + (error.response?.data?.message || error.message || 'Unknown error'));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
        setIsAvailableSlot(false);
        setFormData({
            vehicleCode: '',
            phoneNumber: '',
            customerName: '',
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F0F2F5]">
                <div className="bg-white rounded-[2rem] p-12 shadow-lg flex flex-col items-center gap-6 min-w-[20rem]">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-[#DB2727] animate-spin" />
                        <div className="absolute inset-0 rounded-full border-4 border-[#DB2727]/20"></div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-[#1D1D1D] montserrat mb-2">Loading Services</h3>
                        <p className="text-sm text-[#575757] montserrat">Please wait while we fetch your data...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#F0F2F5] px-4">
                <div className="bg-white rounded-[2rem] p-12 shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
                    <div className="relative">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-[#DB2727]" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-[#1D1D1D] montserrat mb-2">Unable to Load Data</h3>
                        <p className="text-sm text-[#575757] montserrat mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-[#DB2727] text-white rounded-xl font-semibold montserrat hover:bg-[#C21F1F] transition-colors shadow-sm"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="w-full min-h-screen bg-[#F0F2F5] overflow-y-auto font-sans flex flex-col items-center">
                <div className="w-full">
                    <header className="w-full h-auto flex items-center justify-between bg-white px-12 py-5 shadow-sm sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            <Image src="/indra-logo.png" alt="Logo" width={48} height={48} className="object-contain w-12 h-12" />
                            <div>
                                <h1 className="text-xl font-bold text-[#1D1D1D] montserrat">Colombo Service Park</h1>
                                <p className="text-[0.8125rem] text-[#575757] montserrat font-medium">Today&#39;s Service Schedule</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-[#DB2727] montserrat">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                                <div className="text-[0.75rem] text-[#575757] montserrat font-medium">
                                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-3 px-5 py-2.5 bg-[#FFFFFF66] rounded-lg text-[#1D1D1D] hover:bg-gray-50 montserrat transition-colors shadow-sm font-semibold text-sm"
                            >
                                <LogOut className="w-4 h-4 text-[#DB2727]" />
                                Logout
                            </button>
                        </div>
                    </header>

                    <div className="px-12 py-8 space-y-8">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Users className="w-6 h-6 text-[#575757] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Total Scheduled</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#FFD4D4] text-[#DB2727]">{stats.totalScheduled}</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Clock className="w-6 h-6 text-[#FF961B] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">In Progress</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#FFE0B3] text-[#E67700]">{stats.inProgress}</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Info className="w-6 h-6 text-[#DB2727] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Upcoming</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#DB272733] text-[#DB2727]">{stats.upcoming}</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Sparkles className="w-6 h-6 text-[#039855] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Available Slots</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#C3F3C8] text-[#1D7C3D]">{stats.availableSlots}</div>
                            </div>
                        </div>

                        <section className="bg-[#FFFFFF4D] rounded-[45px] px-10 py-10 mb-8 border border-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-[80px] mb-12">
                                <div className="flex flex-row items-center gap-10">
                                    <h2
                                        className="font-semibold text-[22px] text-[#000000]"
                                        style={{
                                            fontFamily: FONT_FAMILY,
                                            fontWeight: 600,
                                            fontSize: '22px',
                                            lineHeight: '100%',
                                            color: '#000000',
                                        }}
                                    >
                                        Service Schedule
                                    </h2>
                                    <div className="flex gap-4">
                                        <Select
                                            className="custom-select"
                                            placeholder="Service Type"
                                            variant="borderless"
                                            suffixIcon={DROPDOWN_ARROW_SVG}
                                            options={serviceTypes.map(type => ({
                                                value: type,
                                                label: type.charAt(0) + type.slice(1).toLowerCase() // "REPAIR" -> "Repair"
                                            }))}
                                            value={selectedServiceType}
                                            onChange={(val) => {
                                                setSelectedServiceType(val);
                                                setSelectedLineId(null);
                                            }}
                                        />
                                        <Select
                                            className="custom-select"
                                            placeholder="Select Line"
                                            variant="borderless"
                                            suffixIcon={DROPDOWN_ARROW_SVG}
                                            options={serviceLines.map(line => ({
                                                value: line.id.toString(),
                                                label: line.name
                                            }))}
                                            value={selectedLineId?.toString()}
                                            onChange={(val) => setSelectedLineId(val ? Number(val) : null)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-16">
                                <div className="w-full lg:w-2/5">
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: COLORS.primary,
                                                fontFamily: FONT_FAMILY,
                                            },
                                        }}
                                    >
                                        <div className="ant-picker-calendar ant-picker-calendar-mini custom-calendar-table w-full" style={{ background: 'transparent' }}>
                                            <div className="flex items-center justify-between bg-transparent pt-[20.61px] pb-[20.61px] pl-0 pr-[13.61px] gap-[9.07px]">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="text-[20px] font-bold text-[#1D1D1D]"
                                                        style={{
                                                            fontFamily: FONT_FAMILY,
                                                            fontWeight: 700,
                                                            fontSize: '16px',
                                                            lineHeight: '100%',
                                                            color: COLORS.textPrimary,
                                                        }}
                                                    >
                                                        {selectedDate.format('MMMM YYYY')}
                                                    </span>
                                                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
                                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                                                    >
                                                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                                                            <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}
                                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                                                    >
                                                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <Calendar
                                                fullscreen={false}
                                                value={selectedDate}
                                                onSelect={handleSelectDate}
                                                onPanelChange={setSelectedDate}
                                                cellRender={dateCellRender}
                                                headerRender={() => null}
                                            />
                                        </div>
                                    </ConfigProvider>
                                </div>

                                <div className="w-full lg:w-3/5 relative">
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        {TIME_SLOTS.map((slot) => {
                                            const slotStatus = getSlotStatus(slot.start);
                                            const isAvailable = slotStatus.status === null;
                                            const isBooked = slotStatus.status === 'BOOKED';
                                            const isPending = slotStatus.status === 'PENDING';

                                            return (
                                                <div key={slot.start} className="flex items-center gap-6 relative group">
                                                    <div
                                                        className="w-[60px] text-right font-medium text-lg text-gray-500"
                                                        style={{ fontFamily: FONT_FAMILY, fontWeight: 500 }}
                                                    >
                                                        {slot.start}
                                                    </div>
                                                    <div
                                                        onClick={() => handleSlotClick(slot)}
                                                        className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 shadow-sm border-2 ${isAvailable
                                                                ? 'bg-[#D9FFD9] cursor-pointer hover:shadow-md border-[#A7FFA7]'
                                                                : isBooked
                                                                    ? 'bg-[#FFB3B3] border-[#FF9191] cursor-pointer hover:shadow-md'
                                                                    : isPending
                                                                        ? 'bg-[#FFD9B3] cursor-pointer hover:shadow-md border-[#FFDAA3]'
                                                                        : 'bg-[#A7FFA780] cursor-pointer hover:shadow-md'
                                                            }`}
                                                        style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)' }}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isAvailable
                                                                        ? 'bg-[#FFFFFF80] text-[#039855]'
                                                                        : isBooked
                                                                            ? 'bg-[#FFFFFF80] text-[#F52A2A]'
                                                                            : isPending
                                                                                ? 'bg-[#FFFFFF80] text-[#F52A2A]'
                                                                                : 'bg-[#A7FFA7] text-white'
                                                                    }`}
                                                                style={{
                                                                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.15)',
                                                                    fontFamily: FONT_FAMILY,
                                                                    fontWeight: !isAvailable ? 600 : 500,
                                                                    fontSize: isAvailable ? '23px' : '16px',
                                                                    lineHeight: '18px',
                                                                }}
                                                            >
                                                                {isAvailable ? '+' : selectedDate.date()}
                                                            </div>
                                                            <div>
                                                                <h4
                                                                    className="font-semibold text-[16px] text-[#1D1D1D]"
                                                                    style={{
                                                                        fontFamily: FONT_FAMILY,
                                                                        fontWeight: 600,
                                                                        fontSize: '16px',
                                                                        lineHeight: '24px',
                                                                    }}
                                                                >
                                                                    {isAvailable
                                                                        ? 'Available'
                                                                        : slotStatus.vehicleCode || 'N/A'}
                                                                </h4>
                                                                <p
                                                                    className="text-sm font-medium text-gray-600"
                                                                    style={{
                                                                        fontFamily: FONT_FAMILY,
                                                                        fontWeight: 400,
                                                                        fontSize: '14px',
                                                                        lineHeight: '21px',
                                                                    }}
                                                                >
                                                                    {slot.label}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`w-[95px] h-[30px] flex items-center justify-center rounded-full text-xs font-semibold gap-2 ${isAvailable
                                                                    ? 'bg-[#FFFFFF99] text-[#039855]'
                                                                    : isBooked
                                                                        ? 'bg-[#FFFFFF99] text-[#DB2727]'
                                                                        : isPending
                                                                            ? 'bg-[#FFFFFF99] text-[#FF961B]'
                                                                            : 'bg-[#A7FFA7] text-[#1D1D1D]'
                                                                }`}
                                                            style={{
                                                                fontFamily: FONT_FAMILY,
                                                                fontWeight: 600,
                                                                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                                                            }}
                                                        >
                                                            {isAvailable ? 'Available' : isBooked ? 'Booked' : isPending ? 'Pending' : 'Available'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleCloseModal}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative bg-white rounded-[20px] shadow-2xl p-8 max-w-[600px] w-full mx-4 z-10" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-6 right-6 text-black hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2
                            className="font-bold text-[#1D1D1D] mb-6"
                            style={{
                                fontFamily: FONT_FAMILY,
                                fontWeight: 700,
                                fontSize: '22px',
                            }}
                        >
                            {isAvailableSlot ? 'Create Booking' : 'Edit Booking'}
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#575757] mb-2" style={LABEL_STYLE}>
                                            Vehicle Number
                                        </label>
                                        {isAvailableSlot ? (
                                            <input
                                                type="text"
                                                value={formData.vehicleCode}
                                                onChange={(e) => setFormData({ ...formData, vehicleCode: e.target.value })}
                                                className="focus:outline-none focus:ring-2 focus:ring-[#DB2727] w-full modal-input"
                                                style={INPUT_STYLE}
                                                placeholder="Enter vehicle number"
                                            />
                                        ) : (
                                            <div
                                                className="bg-[#F9FAFB] text-sm font-semibold rounded-lg px-4 py-3 text-[#1D1D1D]"
                                                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
                                            >
                                                {selectedBooking.vehicleCode}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#575757] mb-2" style={LABEL_STYLE}>
                                            Phone Number
                                        </label>
                                        {isAvailableSlot ? (
                                            <input
                                                type="text"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                className="focus:outline-none focus:ring-2 focus:ring-[#DB2727] w-full modal-input"
                                                style={INPUT_STYLE}
                                                placeholder="Enter phone number"
                                            />
                                        ) : (
                                            <div
                                                className="bg-[#F9FAFB] text-sm font-semibold rounded-lg px-4 py-3 text-[#1D1D1D]"
                                                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
                                            >
                                                {getBookingDetails(selectedBooking.slotStart)?.phoneNumber || '077-1234567'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#575757] mb-2" style={LABEL_STYLE}>
                                            Customer Name
                                        </label>
                                        {isAvailableSlot ? (
                                            <input
                                                type="text"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="focus:outline-none focus:ring-2 focus:ring-[#DB2727] w-full modal-input"
                                                style={INPUT_STYLE}
                                                placeholder="Enter customer name"
                                            />
                                        ) : (
                                            <div
                                                className="bg-[#F9FAFB] text-sm font-semibold rounded-lg px-4 py-3 text-[#1D1D1D]"
                                                style={{ fontFamily: FONT_FAMILY, fontWeight: 600 }}
                                            >
                                                {getBookingDetails(selectedBooking.slotStart)?.customerName || 'Rajesh Kumar'}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#575757] mb-2" style={LABEL_STYLE}>
                                    Time Slot
                                </label>
                                <div
                                    className="bg-[#F3F4F6] rounded-[15px] text-sm px-4 py-3 text-[#1D1D1D80]"
                                    style={{ fontFamily: FONT_FAMILY, fontWeight: 400 }}
                                >
                                    {selectedBooking.slotLabel}
                                </div>
                            </div>

                            {!isAvailableSlot && (
                                <div>
                                    <label className="block text-sm font-medium text-[#575757] mb-2" style={LABEL_STYLE}>
                                        Status
                                    </label>
                                    <Select
                                        value={bookingStatus}
                                        onChange={setBookingStatus}
                                        className="status-select"
                                        style={{ width: '100%' }}
                                        suffixIcon={STATUS_ARROW_SVG}
                                        options={[
                                            { value: 'booked', label: 'Booked' },
                                            { value: 'pending', label: 'Pending' },
                                            { value: 'available', label: 'Available' },
                                        ]}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center gap-2 bg-[#DB2727] text-white rounded-[20px] font-semibold hover:bg-[#C02020] transition-colors flex-1"
                                style={{
                                    height: '48px',
                                    fontFamily: FONT_FAMILY,
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    textAlign: 'center',
                                }}
                            >
                                <Save size={20} />
                                Save
                            </button>

                            {!isAvailableSlot && (
                                <button
                                    onClick={handleCancelBooking}
                                    className="flex items-center justify-center gap-2 bg-[#E5E7EB] text-[#DB2727] rounded-[20px] font-semibold hover:bg-[#D1D5DB] transition-colors flex-1"
                                    style={{
                                        height: '48px',
                                        fontFamily: FONT_FAMILY,
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <XCircle size={24} />
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
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

                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(29, 29, 29, 0.2) rgba(0, 0, 0, 0.05);
                }

                .custom-calendar-table .ant-picker-calendar-header {
                    display: none !important;
                }

                .custom-calendar-table .ant-picker-panel {
                    background: transparent !important;
                    border: none !important;
                    border-radius: 0 !important;
                }

                .custom-calendar-table .ant-picker-calendar {
                    background: transparent !important;
                }

                .custom-calendar-table .ant-picker-body {
                    padding: 0 !important;
                    background: transparent !important;
                    border: none !important;
                    border-radius: 0 !important;
                }

                .custom-calendar-table .ant-picker-content {
                    background: transparent !important;
                }

                .custom-calendar-table .ant-picker-calendar-date {
                    height: 0 !important;
                    padding-bottom: 100% !important;
                    position: relative !important;
                }

                .custom-calendar-table .ant-picker-calendar-date-value {
                    text-align: left !important;
                    padding-left: 10px !important;
                    padding-top: 4px !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                }

                .custom-calendar-table .ant-picker-calendar-date-content {
                    position: absolute !important;
                    bottom: 4px !important;
                    left: 10px !important;
                    margin-top: 0 !important;
                    padding-bottom: 0 !important;
                }

                .custom-calendar-table .ant-picker-cell {
                    padding: 0 !important;
                    position: relative !important;
                    vertical-align: top !important;
                    width: 14.28% !important;
                }

                .custom-calendar-table .ant-picker-cell-inner {
                    border-top: none !important;
                    width: 100% !important;
                    height: 0 !important;
                    padding-bottom: 100% !important;
                    position: relative !important;
                    display: block !important;
                }

                .custom-calendar-table .ant-picker-content thead {
                    display: block !important;
                    margin-bottom: 16px !important;
                }

                .custom-calendar-table .ant-picker-content thead tr {
                    display: table !important;
                    width: 100% !important;
                    table-layout: fixed !important;
                }

                .custom-calendar-table .ant-picker-content thead th {
                    text-align: left !important;
                    padding-left: 10px !important;
                    padding-top: 8px !important;
                    padding-bottom: 8px !important;
                    border: 1px solid #E8E8E8 !important;
                    font-family: Inter, sans-serif !important;
                    font-weight: 500 !important;
                    font-style: normal !important;
                    line-height: 100% !important;
                    color: #969696 !important;
                    vertical-align: top !important;
                }

                .custom-calendar-table .ant-picker-content tbody {
                    display: block !important;
                }

                .custom-calendar-table .ant-picker-content tbody tr {
                    display: table !important;
                    width: 100% !important;
                    table-layout: fixed !important;
                }

                .custom-calendar-table .ant-picker-content tbody tr:first-child td {
                    padding-top: 0 !important;
                }

                .custom-calendar-table .ant-picker-content thead th:nth-child(1)::before {
                    content: 'SUN';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(2)::before {
                    content: 'MON';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(3)::before {
                    content: 'TUE';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(4)::before {
                    content: 'WED';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(5)::before {
                    content: 'THUR';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(6)::before {
                    content: 'FRI';
                }
                .custom-calendar-table .ant-picker-content thead th:nth-child(7)::before {
                    content: 'SAT';
                }

                .custom-calendar-table .ant-picker-content thead th {
                    font-size: 0 !important;
                    padding-bottom: 8px !important;
                }

                .custom-calendar-table .ant-picker-content thead th::before {
                    font-family: Inter, sans-serif !important;
                    font-weight: 500 !important;
                    font-style: normal !important;
                    line-height: 100% !important;
                    color: #969696 !important;
                    font-size: 12px !important;
                }

                .custom-calendar-table .ant-picker-content td {
                    border: 1px solid #E8E8E8 !important;
                    width: 14.28% !important;
                }

                .custom-calendar-table .ant-picker-content {
                    table-layout: fixed !important;
                    width: 100% !important;
                    border: none !important;
                }

                .custom-calendar-table .ant-picker-content table {
                    border: none !important;
                }

                .custom-calendar-table .ant-picker-panel {
                    border: none !important;
                }

                .custom-calendar-table .ant-picker-cell-out-range .ant-picker-calendar-date-value {
                    color: #000000 !important;
                    opacity: 1 !important;
                }

                .custom-calendar-table .ant-picker-content tbody tr:nth-child(6),
                .custom-calendar-table .ant-picker-content tbody tr:nth-child(7) {
                    display: none !important;
                }

                .custom-calendar-table .ant-picker-cell-selected .ant-picker-cell-inner {
                    background: rgba(219, 39, 39, 0.1) !important;
                }

                .custom-calendar-table .ant-picker-cell-selected .ant-picker-calendar-date-value {
                    color: #000000 !important;
                }

                .custom-calendar-table .ant-picker-calendar-date-today .ant-picker-cell-inner {
                    background: rgba(219, 39, 39, 0.1) !important;
                }

                .custom-calendar-table .ant-picker-calendar-date-today .ant-picker-calendar-date-value {
                    color: #000000 !important;
                }

                .custom-select {
                    min-width: 110px !important;
                }

                .custom-select .ant-select-selector {
                    background: #FFFFFF99 !important;
                    border: none !important;
                    border-radius: 15px !important;
                    height: 36px !important;
                    padding-left: 24px !important;
                    padding-right: 40px !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    box-shadow: 0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A !important;
                    position: relative !important;
                    display: flex !important;
                    align-items: center !important;
                }

                .custom-select .ant-select-selection-placeholder,
                .custom-select .ant-select-selection-item {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #1D1D1D !important;
                    display: flex !important;
                    align-items: center !important;
                    height: 100% !important;
                }

                .custom-select .ant-select-selection-search-input {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #1D1D1D !important;
                }

                .custom-select .ant-select-arrow {
                    position: absolute !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    right: 14px !important;
                    margin: auto 0 !important;
                    padding: 0 !important;
                    width: 16px !important;
                    height: 16px !important;
                    opacity: 1 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    line-height: 0 !important;
                }

                .custom-select .ant-select-arrow svg {
                    width: 16px !important;
                    height: 16px !important;
                    opacity: 1 !important;
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    vertical-align: middle !important;
                }

                .status-select {
                    height: 44px !important;
                }

                .status-select .ant-select-selector {
                    background: #D9FFD9 !important;
                    border: none !important;
                    border-radius: 15px !important;
                    height: 44px !important;
                    padding-left: 16px !important;
                    padding-right: 40px !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                }

                .status-select .ant-select-selection-placeholder,
                .status-select .ant-select-selection-item {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    line-height: 21px !important;
                    letter-spacing: 0px !important;
                    color: #039855 !important;
                    display: flex !important;
                    align-items: center !important;
                    height: 100% !important;
                }

                .status-select .ant-select-selection-search-input {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    line-height: 21px !important;
                    letter-spacing: 0px !important;
                    color: #039855 !important;
                }

                .status-select .ant-select-arrow {
                    position: absolute !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    right: 14px !important;
                    margin: auto 0 !important;
                    padding: 0 !important;
                    width: 16px !important;
                    height: 16px !important;
                    opacity: 1 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    line-height: 0 !important;
                }

                .status-select .ant-select-arrow svg {
                    width: 16px !important;
                    height: 16px !important;
                    opacity: 1 !important;
                    display: block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }

                .modal-input {
                    border: 1px solid #9CA3AF !important;
                }

                .modal-input:focus {
                    border: 1px solid #DB2727 !important;
                }

                .modal-input::placeholder {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 400 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #9CA3AF !important;
                }

                .modal-input::-webkit-input-placeholder {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 400 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #9CA3AF !important;
                }

                .modal-input::-moz-placeholder {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 400 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #9CA3AF !important;
                }

                .modal-input:-ms-input-placeholder {
                    font-family: Montserrat, sans-serif !important;
                    font-weight: 400 !important;
                    font-size: 14px !important;
                    line-height: 100% !important;
                    letter-spacing: 0px !important;
                    color: #9CA3AF !important;
                }
            `}</style>
        </div>
    );
}
