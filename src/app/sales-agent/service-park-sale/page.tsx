/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from "next/image";
import {Key, useState} from "react";
import {Badge, Calendar} from "antd";
import dayjs from "dayjs";


interface ScheduleSlot {
    time: string;
    type: string;
    cab: string | number | bigint | boolean;
    duration: string | number | bigint | boolean;
    status: string;
}

interface Schedules {
    [date: string]: ScheduleSlot[];
}

interface DotsData {
    [date: string]: string[];
}


const ServiceParkSale = () => {

    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs('2025-03-05'));
    const [calendarValue, setCalendarValue] = useState<dayjs.Dayjs>(dayjs('2025-03-05'));

    const dotsData: DotsData = {
        '2025-03-05': ['green'],
        '2025-03-06': ['red'],
        '2025-03-07': ['green', 'orange'],
        '2025-03-08': ['green'],
        '2025-03-09': ['red'],
        '2025-03-10': ['green'],
        '2025-03-11': ['orange'],
        '2025-03-13': ['green'],
        '2025-03-14': ['red'],
        '2025-03-15': ['green', 'orange'],
        '2025-03-16': ['green'],
        '2025-03-18': ['green', 'orange'],
        '2025-03-19': ['green', 'orange'],
        '2025-03-20': ['green'],
        '2025-03-21': ['green', 'orange'],
        '2025-03-22': ['green', 'orange'],
        '2025-03-23': ['green'],
        '2025-03-24': ['red'],
        '2025-03-25': ['green', 'orange'],
        '2025-03-26': ['green', 'orange'],
        '2025-03-27': ['red'],
        '2025-03-28': ['green', 'orange'],
        '2025-03-29': ['red'],
        '2025-03-30': ['green'],
        '2025-03-31': ['red'],
    };


    const schedules: Schedules = {
        '2025-03-05': [
            {time: '8:00', type: 'booked', cab: 'CAB - 5482', duration: '8:00 - 8:30', status: 'Booked'},
            {time: '8:30', type: 'available', cab: 'Available', duration: '8:30 - 9:00', status: 'Available'},
            {time: '9:00', type: 'booked', cab: 'CAB - 7824', duration: '9:00 - 9:30', status: 'Booked'},
            {time: '9:30', type: 'pending', cab: 'CAB - 4862', duration: '9:30 - 10:00', status: 'Pending'},
            {time: '10:00', type: 'available', cab: 'Available', duration: '10:00 - 10:30', status: 'Available'},
            {time: '10:30', type: 'available', cab: 'Available', duration: '10:30 - 11:00', status: 'Available'},
        ],
    };

    const getDotBadges = (dateStr: string) => {
        const dots = dotsData[dateStr] || [];
        return dots.map((color: string, index: Key | null | undefined) => (
            <Badge
                key={index}
                color={color === 'green' ? '#039855' : color === 'red' ? '#DB2727' : '#FF961B'}
                style={{width: 8, height: 8, marginRight: 2}}
            />
        ));
    };

    const dateCellRender = (date: dayjs.Dayjs) => {
        const dateStr = date.format('YYYY-MM-DD');
        const isSelected = date.isSame(selectedDate, 'day');
        const dots = getDotBadges(dateStr);

        return (
            <div
                className={`relative h-full flex flex-col justify-between p-1`}
            >
                {dots.length > 0 && (
                    <div className="flex justify-start mt-auto pb-4 overflow-hidden">
                        {dots}
                    </div>
                )}
            </div>
        );
    };

    const onSelect = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
    };

    const getScheduleForDate = (date: dayjs.Dayjs) => {
        return schedules[date.format("YYYY-MM-DD")] || [];
    };

    const handlePrevMonth = () => {
        setCalendarValue((prev) => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCalendarValue((prev) => prev.add(1, 'month'));
    };

    return (
        <div
            className="relative min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">

            <div className="max-w-[1800px] mx-auto container">

                <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                    <h1 className="text-2xl font-extrabold mb-4">Indra Service Park Sales Dashboard</h1>

                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="font-semibold text-[22px] mb-6">Vehicle History</h2>
                                <div>
                                    <button
                                        id="applyBtn"
                                        className="ml-auto mt-8 md:mt-0 bg-[#DB2727] text-white text-base font-medium rounded-full px-9 py-2 hover:bg-red-600 transition">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <VerificationDropdown label="Vehicle No" placeholder="Select Vehicle No" isIcon={true}/>
                                <div>
                                    <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Odometer</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="245,000km"
                                                className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                            />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Last Owner Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Owner Name</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Jenny Wilson"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <VerificationDropdown label="Contact No" placeholder="077 5848725"
                                                          isIcon={false}/>
                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Email Address</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Jenny@info.com"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Address</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="No.45, Malabe Rd, Malabe"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 mt-10">
                                <div className="flex flex-row items-center justify-between">
                                    <h2 className="font-semibold text-[19px] mb-6">Last Service Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Mileage</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="200,000km"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Oil Type</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="5W-30 Synthetic"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Service Center</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Bambalapitiya"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="flex flex-col space-y-2 font-medium text-gray-900">
                                    <span
                                        className="text-[#1D1D1D] font-medium text-[17px] montserrat">Service Advisor</span>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className={`w-full px-4 py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    <section
                        className="relative bg-[#FFFFFF4D] bg-opacity-30 rounded-[45px] px-14 py-10 flex justify-between items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-row items-center gap-10">
                                <h2 className="font-semibold text-[22px]">Service Schedule</h2>
                                <div className="flex flex-row gap-12 mt-1">
                                    <div
                                        className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">
                                        <h3>Kandy</h3>
                                        <svg className="" width="10" height="6"
                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                  fill="#575757"/>
                                        </svg>
                                    </div>

                                    <div
                                        className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">
                                        <h3>Repair</h3>
                                        <svg className="" width="10" height="6"
                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z"
                                                  fill="#575757"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-8 mt-12">
                                <div className="w-1/2">
                                    <div className="bg-white rounded-2xl overflow-hidden">
                                        <Calendar
                                            value={calendarValue}
                                            onSelect={onSelect}
                                            cellRender={dateCellRender}
                                            mode="month"
                                            className="custom-calendar"
                                            headerRender={({value, type, onTypeChange}) => (
                                                <div className="px-6 py-4 flex justify-between items-center">
                                                    <div className="text-sm font-bold flex flex-row gap-2 items-center">
                                                        {value.format('MMMM YYYY')} <span><Image src="/next-arrow.svg"
                                                                                                 alt="prev arrow"
                                                                                                 width={32} height={32}
                                                                                                 className="w-5 h-5"/></span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handlePrevMonth}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <Image src="/prev-arrow.svg" alt="prev arrow" width={32}
                                                                   height={32} className="w-5 h-5"/>
                                                        </button>
                                                        <button
                                                            onClick={handleNextMonth}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <Image src="/next-arrow.svg" alt="prev arrow" width={32}
                                                                   height={32} className="w-5 h-5"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-row items-center gap-8 mt-8 justify-center">
                                        <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
                                            <span className="bg-[#DB2727] w-2 h-2 rounded-full"></span> Booked
                                        </h3>
                                        <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
                                            <span className="bg-[#FF961B] w-2 h-2 rounded-full"></span> Pending
                                        </h3>
                                        <h3 className="text-[#1D1D1D] text-[12px] font-medium flex gap-2 items-center">
                                            <span className="bg-[#039855] w-2 h-2 rounded-full"></span> Available
                                        </h3>
                                    </div>
                                </div>

                                {/* Schedule Section */}
                                <div className="w-1/2 flex flex-col gap-2">
                                    {getScheduleForDate(selectedDate).map((slot: {
                                        type: string;
                                        time: string;
                                        cab: string | number | bigint | boolean;
                                        duration: string | number | bigint | boolean;
                                    }, index: Key | null | undefined) => (
                                        <div
                                            key={index}
                                            className={`flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-[20] ${
                                                slot.type === 'booked'
                                                    ? 'bg-[#FFA7A7]/50'
                                                    : slot.type === 'available'
                                                        ? 'bg-[#A7FFA7]/50'
                                                        : 'bg-[#FFCBA7]/50'
                                            }`}
                                        >
                                            <div className="flex flex-row gap-6 items-center">
                                                <div
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black font-bold">
                                                    {slot.type === 'available' ? '+' : slot.time.slice(0, -3)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span
                                                        className="text-base text-[#1D1D1D] font-semibold">{slot.cab}</span>
                                                    <span className="text-sm text-[#1D1D1D]">{slot.duration}</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 rounded-full px-3 py-1 shadow-md ${
                                                slot.type === 'booked'
                                                    ? 'bg-[#FFA7A7]'
                                                    : slot.type === 'available'
                                                        ? 'bg-[#A7FFA7]'
                                                        : 'bg-[#FFCBA7]'
                                            }`}>
                                                <span className="text-[#1D1D1D] text-[10px]">{slot.type}</span>
                                                <svg className="w-4 h-4 text-[#1D1D1D]" fill="none"
                                                     stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 9l-7 7-7-7"/>
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    </section>


                </main>
            </div>
        </div>
    );
}

type VerificationDropdownProps = {
    label: string;
    placeholder: string;
    isIcon: boolean;
};

function VerificationDropdown({label, placeholder, isIcon}: VerificationDropdownProps) {
    return (
        <label className="flex flex-col space-y-2 font-medium text-gray-900">
            <span className="text-[#1D1D1D] font-medium text-[17px] montserrat">{label}</span>
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`w-full ${isIcon ? "px-10" : "px-4"} py-4 rounded-3xl bg-white/80 backdrop-blur text-sm placeholder-[#575757] focus:outline-none focus:ring-2 focus:ring-red-700`}
                />

                {
                    isIcon && (
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20"
                             viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.1935 13.5122L16.6532 15.9719M15.8762 9.1838C15.8762 10.7723 15.2451 12.2958 14.1219 13.419C12.9986 14.5422 11.4752 15.1733 9.88669 15.1733C8.29818 15.1733 6.77473 14.5422 5.65149 13.419C4.52825 12.2958 3.89722 10.7723 3.89722 9.1838C3.89722 7.5953 4.52825 6.07185 5.65149 4.94861C6.77473 3.82537 8.29818 3.19434 9.88669 3.19434C11.4752 3.19434 12.9986 3.82537 14.1219 4.94861C15.2451 6.07185 15.8762 7.5953 15.8762 9.1838Z"
                                stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )
                }

                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                </svg>
            </div>
        </label>
    );
}

export default ServiceParkSale;

