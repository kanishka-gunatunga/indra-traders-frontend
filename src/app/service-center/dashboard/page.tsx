"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { LogOut, Users, Clock, Info, Sparkles } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Calendar, ConfigProvider, Select } from 'antd'
import dayjs from 'dayjs'

const generateTimeSlots = () => {
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

export default function ServiceCenterDashboard() {

    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSelectDate = (value: dayjs.Dayjs) => {
        setSelectedDate(value);
    };

    const dateCellRender = (date: dayjs.Dayjs) => {
        // Mock data for calendar dots - replace with actual data
        const mockDots: Record<string, string[]> = {
            '2025-12-30': ['green', 'orange'],
            '2026-01-03': ['green', 'orange'],
            '2026-01-04': ['red'],
            '2026-01-05': ['green'],
            '2026-01-06': ['green', 'orange'],
            '2026-01-07': ['red', 'orange'],
            '2026-01-08': ['red'],
            '2026-01-09': ['green', 'orange'],
            '2026-01-10': ['green'],
            '2026-01-12': ['red'],
            '2026-01-14': ['red', 'orange'],
            '2026-01-15': ['green', 'orange'],
            '2026-01-16': ['red'],
            '2026-01-18': ['green', 'orange'],
            '2026-01-20': ['red'],
            '2026-01-21': ['green', 'orange'],
            '2026-01-24': ['red'],
            '2026-01-25': ['green'],
            '2026-01-27': ['green', 'orange'],
            '2026-01-28': ['red'],
            '2026-01-30': ['green', 'orange'],
            '2026-02-03': ['green', 'orange'],
            '2026-02-04': ['red'],
            '2026-02-05': ['green'],
            '2026-02-06': ['green', 'orange'],
            '2026-02-07': ['red', 'orange'],
            '2026-02-08': ['red'],
        };
        const dateStr = date.format('YYYY-MM-DD');
        const dotColors = mockDots[dateStr] || [];
        return (
            <div className="flex justify-start items-end w-full gap-[4px]">
                {dotColors.slice(0, 3).map((color: string, i: number) => (
                    <span key={i} className={`w-[7px] h-[7px] rounded-full ${color === 'green' ? 'bg-[#039855]' : color === 'red' ? 'bg-[#DB2727]' : 'bg-[#FF961B]'
                        }`} />
                ))}
            </div>
        );
    };

    const getSlotStatus = (slotStart: string) => {
        // Mock data - replace with actual booking data
        if (slotStart === '08:00') {
            return { status: 'booked', vehicleCode: 'CAB - 5482', vehicleNo: '5' };
        }
        if (slotStart === '09:30') {
            return { status: 'pending', vehicleCode: 'CAB - 4862', vehicleNo: '5' };
        }
        return { status: 'available', vehicleCode: null, vehicleNo: null };
    };

    return (
        <div className="min-h-screen">
            <div className="w-full min-h-screen bg-[#F0F2F5] overflow-y-auto font-sans flex flex-col items-center">
                <div className="w-full">
                    {/* Header */}
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
                                onClick={() => {
                                    signOut({ callbackUrl: "/service-booking/login" })
                                }}
                                className="flex items-center gap-3 px-5 py-2.5 bg-[#FFFFFF66] rounded-lg text-[#1D1D1D] hover:bg-gray-50 montserrat transition-colors shadow-sm font-semibold text-sm"
                            >
                                <LogOut className="w-4 h-4 text-[#DB2727]" />
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="px-12 py-8 space-y-8">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Users className="w-6 h-6 text-[#575757] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Total Scheduled</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#FFD4D4] text-[#DB2727]">0</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Clock className="w-6 h-6 text-[#FF961B] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">In Progress</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#FFE0B3] text-[#E67700]">0</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Info className="w-6 h-6 text-[#DB2727] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Upcoming</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#DB272733] text-[#DB2727]">0</div>
                            </div>
                            <div className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <Sparkles className="w-6 h-6 text-[#039855] mb-3" />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">Available Slots</span>
                                </div>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-[#C3F3C8] text-[#1D7C3D]">0</div>
                            </div>
                        </div>

                        {/* Service Schedule Section */}
                        <section className="bg-[#FFFFFF4D] rounded-[45px] px-10 py-10 mb-8 border border-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-[80px] mb-12">
                                <div className="flex flex-row items-center gap-[80px]">
                                    <h2 className="font-semibold text-[22px] text-[#000000]" style={{
                                        fontFamily: 'Montserrat',
                                        fontWeight: 600,
                                        fontStyle: 'normal',
                                        fontSize: '22px',
                                        lineHeight: '100%',
                                        letterSpacing: '0%',
                                        color: '#000000'
                                    }}>Service Schedule</h2>
                                    <div className="flex gap-4">
                                        <Select
                                            className="w-32 h-10 custom-select"
                                            placeholder="Select Branch"
                                            bordered={false}
                                            suffixIcon={<svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757" />
                                            </svg>}
                                            options={[]}
                                            value={selectedBranchId}
                                            onChange={(val) => {
                                                setSelectedBranchId(val);
                                                setSelectedServiceType(null);
                                                setSelectedLineId(null);
                                            }}
                                        />
                                        <Select
                                            className="w-32 h-10 custom-select"
                                            placeholder="Service Type"
                                            bordered={false}
                                            disabled={!selectedBranchId}
                                            suffixIcon={<svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757" />
                                            </svg>}
                                            options={[]}
                                            value={selectedServiceType}
                                            onChange={(val) => {
                                                setSelectedServiceType(val);
                                                setSelectedLineId(null);
                                            }}
                                        />
                                        <Select
                                            className="w-32 h-10 custom-select"
                                            placeholder="Select Line"
                                            bordered={false}
                                            disabled={!selectedServiceType}
                                            suffixIcon={<svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757" />
                                            </svg>}
                                            options={[]}
                                            value={selectedLineId}
                                            onChange={setSelectedLineId}
                                        />
                                    </div>
                                </div>
                                <div className="justify-end">
                                    <button className="bg-[#DB2727] text-white px-8 py-2 rounded-full font-medium text-base hover:bg-red-700 transition disabled:bg-gray-400 justify-end">
                                        Confirm Booking
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-16">
                                {/* Calendar */}
                                <div className="w-full lg:w-1/2">
                                    <ConfigProvider theme={{
                                        token: {
                                            colorPrimary: '#DB2727',
                                            fontFamily: 'Montserrat, sans-serif',
                                        },
                                    }}>
                                        <div className="ant-picker-calendar ant-picker-calendar-mini custom-calendar-table w-full" style={{ background: 'transparent' }}>
                                            <div className="flex items-center justify-between bg-transparent pt-[20.61px] pb-[20.61px] pl-0 pr-[13.61px] gap-[9.07px]">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[20px] font-bold text-[#1D1D1D]" style={{
                                        fontFamily: 'Montserrat',
                                        fontWeight: 700,
                                        fontStyle: 'normal',
                                        fontSize: '16px',
                                        lineHeight: '100%',
                                        letterSpacing: '0%',
                                        color: '#1D1D1D'
                                    }}>{selectedDate.format('MMMM YYYY')}</span>
                                                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke="#DB2727" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => {
                                                            const newDate = selectedDate.subtract(1, 'month');
                                                            setSelectedDate(newDate);
                                                        }}
                                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                                                    >
                                                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                                                            <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke="#DB2727" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newDate = selectedDate.add(1, 'month');
                                                            setSelectedDate(newDate);
                                                        }}
                                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                                                    >
                                                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.5 14.5L8.5 8L1.5 1.5" stroke="#DB2727" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <Calendar
                                                fullscreen={false}
                                                value={selectedDate}
                                                onSelect={handleSelectDate}
                                                onPanelChange={(val) => {
                                                    setSelectedDate(val);
                                                }}
                                                cellRender={dateCellRender}
                                                headerRender={() => null}
                                            />
                                        </div>
                                    </ConfigProvider>
                                </div>

                                {/* Time Slots */}
                                <div className="w-full lg:w-1/2 relative">
                                    <div className="absolute left-[60px] top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
                                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        {TIME_SLOTS.map((slot) => {
                                            const slotStatus = getSlotStatus(slot.start);
                                            const isAvailable = slotStatus.status === 'available';
                                            const isBooked = slotStatus.status === 'booked';
                                            const isPending = slotStatus.status === 'pending';

                                            return (
                                                <div
                                                    key={slot.start}
                                                    className={`flex items-center gap-6 relative group ${isBooked ? 'cursor-not-allowed' : ''}`}
                                                >
                                                    <div className="w-[60px] text-right font-medium text-lg text-gray-500">{slot.start}</div>
                                                    <div
                                                        className={`flex-1 rounded-[20px] p-4 flex justify-between items-center transition-all duration-200 ${isAvailable ? 'bg-[#A7FFA780] cursor-pointer hover:shadow-md' :
                                                                isBooked ? 'bg-[#FFA7A780] cursor-not-allowed' :
                                                                    isPending ? 'bg-[#FFCBA780] cursor-pointer hover:shadow-md' :
                                                                        'bg-[#A7FFA780] cursor-pointer hover:shadow-md'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm font-bold text-lg ${isAvailable ? 'bg-[#A7FFA7] text-white' :
                                                                        isBooked ? 'bg-[#FFD1D1] text-[#1D1D1D]' :
                                                                            isPending ? 'bg-[#FFCBA7] text-[#1D1D1D]' :
                                                                                'bg-[#A7FFA7] text-white'
                                                                    }`}
                                                            >
                                                                {isAvailable ? '+' : slotStatus.vehicleNo || '5'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-[16px] text-[#1D1D1D]">
                                                                    {isAvailable ? 'Available' : isBooked ? slotStatus.vehicleCode || `CAB - ${slotStatus.vehicleNo}` : isPending ? slotStatus.vehicleCode || `CAB - ${slotStatus.vehicleNo}` : 'Available'}
                                                                </h4>
                                                                <p className="text-sm font-medium text-gray-600">{slot.label}</p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${isAvailable ? 'bg-[#A7FFA7] text-[#1D1D1D]' :
                                                                    isBooked ? 'bg-[#FF9191] text-[#1D1D1D]' :
                                                                        isPending ? 'bg-[#FFCBA7] text-[#1D1D1D]' :
                                                                            'bg-[#A7FFA7] text-[#1D1D1D]'
                                                                }`}
                                                        >
                                                            {isAvailable ? 'Available' : isBooked ? 'Booked' : isPending ? 'Pending' : 'Available'}
                                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                                <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757" />
                                                            </svg>
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
    )
}
