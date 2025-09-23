"use client"
import Image from "next/image";
import {useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const ServiceParkSale = () => {

    const [selectedDate, setSelectedDate] = useState('2025-03-05');

    const dotsData = {
        '2025-02-24': ['green'], // Mon
        '2025-02-25': ['red'],    // Tue
        '2025-02-26': ['green', 'orange'], // Wed
        '2025-02-27': ['red'],    // Thu
        '2025-02-28': ['red'],    // Fri
        '2025-03-01': ['green', 'orange'], // Sat
        '2025-03-02': ['green'],  // Sun
        '2025-03-03': [],         // Mon 3, no dot in image approximation
        '2025-03-04': ['green'],  // Tue 4 -> green
        '2025-03-05': [],         // Wed 5, highlighted, no dot
        '2025-03-06': ['red'],    // Thu 6 -> red? Adjust based on image
        '2025-03-07': ['green', 'orange'], // Fri 7
        '2025-03-08': ['green'],  // Sat 8
        '2025-03-09': ['red'],    // Sun 9
        '2025-03-10': ['green'],  // Mon 10
        '2025-03-11': ['orange'], // Tue 11
        '2025-09-23': ['green'],  // etc., add more as needed
        // Add more dates if required
    };

    // Schedule data for selected date (hardcoded for March 5)
    const schedules = {
        '2025-03-05': [
            {
                time: '8:00',
                type: 'booked',
                cab: 'CAB - 5482',
                duration: '8:00 - 8:30',
                status: 'Booked',
            },
            {
                time: '8:30',
                type: 'available',
                cab: 'Available',
                duration: '8:30 - 9:00',
                status: 'Available',
            },
            {
                time: '9:00',
                type: 'booked',
                cab: 'CAB - 7824',
                duration: '9:00 - 9:30',
                status: 'Booked',
            },
            {
                time: '9:30',
                type: 'pending',
                cab: 'CAB - 4862',
                duration: '9:30 - 10:00',
                status: 'Pending',
            },
            {
                time: '10:00',
                type: 'available',
                cab: 'Available',
                duration: '10:00 - 10:30',
                status: 'Available',
            },
            {
                time: '10:30',
                type: 'available',
                cab: 'Available',
                duration: '10:30 - 11:00',
                status: 'Available',
            },
            // Add more slots as needed
        ],
    };

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
    };

    const dayCellDidMount = (info) => {
        const dateStr = info.date.toISOString().slice(0, 10);
        const dots = dotsData[dateStr] || [];

        if (dots.length > 0) {
            const dotContainer = document.createElement('div');
            dotContainer.className = 'flex justify-center gap-1 absolute bottom-1 left-0 right-0';
            dots.forEach((color) => {
                const dot = document.createElement('div');
                dot.className = `w-1.5 h-1.5 rounded-full ${
                    color === 'green' ? 'bg-green-600' : color === 'red' ? 'bg-red-600' : 'bg-orange-500'
                }`;
                dotContainer.appendChild(dot);
            });
            info.el.appendChild(dotContainer);
        }

        // Highlight selected day
        if (dateStr === selectedDate) {
            info.el.style.backgroundColor = '#FFE5E5';
        }
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
                                    <div className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">
                                        <h3>Kandy</h3>
                                        <svg className="" width="10" height="6"
                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                                        </svg>
                                    </div>

                                    <div className="font-medium text-[17px] text-[#1D1D1D] flex flex-row gap-3 items-center">
                                        <h3>Repair</h3>
                                        <svg className="" width="10" height="6"
                                             viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                                        </svg>
                                    </div>
                                </div>



                            </div>

                            <div className="flex gap-8 mt-12">
                                {/* Calendar Section */}
                                <div className="w-1/2 bg-white rounded-2xl shadow-md overflow-hidden">
                                    <FullCalendar
                                        plugins={[dayGridPlugin]}
                                        initialView="dayGridMonth"
                                        initialDate="2025-03-01"
                                        headerToolbar={{
                                            left: 'title',
                                            center: '',
                                            right: 'prev,next',
                                        }}
                                        titleFormat={{ year: 'numeric', month: 'long' }}
                                        height="auto"
                                        dateClick={handleDateClick}
                                        dayCellDidMount={dayCellDidMount}
                                        fixedWeekCount={false} // Show only necessary weeks
                                    />
                                </div>
                                {/* Schedule Section */}
                                <div className="w-1/2 flex flex-col gap-2">
                                    {(schedules[selectedDate] || []).map((slot, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-2 p-2 rounded-full ${
                                                slot.type === 'booked'
                                                    ? 'bg-pink-200'
                                                    : slot.type === 'available'
                                                        ? 'bg-green-200'
                                                        : 'bg-orange-200'
                                            }`}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black font-bold">
                                                {slot.type === 'available' ? '+' : slot.time.slice(0, -3)}
                                            </div>
                                            <span className="flex-1">{slot.cab}</span>
                                            <div className="flex items-center gap-2 bg-white/50 rounded-full px-3 py-1">
                                                <span>{slot.duration}</span>
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                {/*<FiSearch*/}
                {/*    size={18}*/}
                {/*    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"*/}
                {/*/>*/}
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

                {/*<BiChevronDown*/}
                {/*    size={18}*/}
                {/*    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"*/}
                {/*/>*/}
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6"
                     viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9142 0.58667L5.12263 5.37824L0.331055 0.58667H9.9142Z" fill="#575757"/>
                </svg>
            </div>
        </label>
    );
}

export default ServiceParkSale;
