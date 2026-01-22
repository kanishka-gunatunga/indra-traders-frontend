/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Users,
    CheckCircle2,
    Clock,
    LogOut,
    Sparkles,
    Info,
    Loader2,
    AlertCircle,
    Calendar
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useScheduledServices } from "@/hooks/useScheduledServices";

const AutoScrollColumn = ({ children }: { children: React.ReactNode }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let timeoutId: NodeJS.Timeout;
        const READ_TIME = 4000; // Time to pause and read (ms)

        const scrollStep = () => {
            if (!scrollContainer) return;

            const currentScroll = scrollContainer.scrollTop;
            const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;

            if (maxScroll <= 0) return;

           
            if (currentScroll >= maxScroll - 5) {
                
                timeoutId = setTimeout(() => {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    timeoutId = setTimeout(scrollStep, READ_TIME);
                }, READ_TIME);
                return;
            }

            const children = Array.from(scrollContainer.children) as HTMLElement[];
            const nextItem = children.find(child => child.offsetTop > currentScroll + 10);

            if (nextItem) {
                scrollContainer.scrollTo({
                    top: nextItem.offsetTop,
                    behavior: 'smooth'
                });
                timeoutId = setTimeout(scrollStep, READ_TIME);
            }
        };

        timeoutId = setTimeout(scrollStep, READ_TIME);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div ref={scrollRef} className="relative bg-[#FFFFFF66] p-5 rounded-[1.5rem] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] h-[calc(100vh-20rem)] overflow-y-auto no-scrollbar flex flex-col gap-3 backdrop-blur-sm">
            {children}
        </div>
    );
};

export default function ServiceBookingDashboard() {

    const { scheduledServices, availableSlots, stats, loading, error } = useScheduledServices();

    const { data: session } = useSession();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Route-specific scaling for 4K TV visibility
    useEffect(() => {
        const updateRootScale = () => {
            const width = window.innerWidth;
            let size = '16px';

            if (width >= 3500) {
                size = '36px'; // 2.25x scaling for true 4K TV experience
            } else if (width >= 2500) {
                size = '28px'; // 1.75x
            } else if (width >= 1600) {
                size = '22px'; // 1.375x (Starts earlier for better visibility)
            } else {
                size = '16px'; // Standard
            }

            document.documentElement.style.fontSize = size;
            document.body.style.fontSize = size; // Ensure consistency
        };
        updateRootScale();
        window.addEventListener('resize', updateRootScale);
        return () => {
            window.removeEventListener('resize', updateRootScale);
            document.documentElement.style.fontSize = '';
            document.body.style.fontSize = '';
        };
    }, []);


    const getThemeStyles = (theme: string) => {
        switch (theme) {
            case 'green': return "bg-[#A7FFA7] border-[#039855]"; // Completed
            case 'orange': return "bg-[#FFDAA3] border-[#FF961B]"; // In Progress
            case 'white': return "bg-[#FFFFFF99] border-[#999999]"; // Upcoming
            default: return "bg-[#FFFFFF99] border-[#999999]";
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'Completed') return <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full text-green-700 text-[0.75rem] font-bold shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</div>
        if (status === 'In Progress') return <div className="flex items-center gap-1 bg-white/60 px-3 py-1 rounded-full text-orange-700 text-[0.75rem] font-bold shadow-sm"><Clock className="w-3.5 h-3.5" /> In Progress</div>
        return <div className="flex items-center gap-1 text-gray-400 text-[0.75rem] font-semibold"><Calendar className="w-3.5 h-3.5" /> Upcoming</div>
    };

    // Transform stats object into array format for UI
    const statsDisplay = [
        {
            label: "Total Scheduled",
            count: stats.totalScheduled,
            icon: Users,
            badgeColor: "bg-[#FFD4D4] text-[#DB2727]",
            iconColor: "text-[#575757]"
        },
        {
            label: "In Progress",
            count: stats.inProgress,
            icon: Clock,
            badgeColor: "bg-[#FFE0B3] text-[#E67700]",
            iconColor: "text-[#FF961B]"
        },
        {
            label: "Upcoming",
            count: stats.upcoming,
            icon: Info,
            badgeColor: "bg-[#DB272733] text-[#DB2727]",
            iconColor: "text-[#DB2727]"
        },
        {
            label: "Available Slots",
            count: stats.availableSlots,
            icon: Sparkles,
            badgeColor: "bg-[#C3F3C8] text-[#1D7C3D]",
            iconColor: "text-[#039855]"
        }
    ];

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
        <div className="w-full h-screen bg-[#F0F2F5] overflow-hidden font-sans flex flex-col items-center">
            {/* 4K Scaling Wrapper - Removed to prevent overflow */}
            <div className="w-full">

                {/* Header */}
                <header className="w-full h-auto flex items-center justify-between bg-white px-12 py-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Image src="/indra-logo.png" alt="Logo" width={48} height={48} className="object-contain w-[3rem] h-[3rem]" />
                        <div>
                            {/* TODO: Program the service park name */}
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

                {/* Main Content Area */}
                <div className="px-12 py-8">

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {statsDisplay.map((stat, idx) => (
                            <div key={idx} className="bg-white rounded-[1.25rem] p-4 pr-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-start justify-between">
                                <div className="flex flex-col">
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor} mb-3`} />
                                    <span className="text-[0.9375rem] font-semibold text-[#1D1D1D] montserrat">{stat.label}</span>
                                </div>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${stat.badgeColor}`}>
                                    {stat.count}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column: Scheduled Services */}
                        <div>
                            <h2 className="text-lg font-bold text-[#1D1D1D] mb-4 montserrat">Scheduled Services</h2>
                            <AutoScrollColumn>
                                {scheduledServices.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-[1.25rem] p-5 shadow-sm border-2 ${getThemeStyles(item.theme)} transition-transform hover:scale-[1.01]`}
                                    >
                                        <div className="flex items-start justify-between">
                                            {/* Time Box */}
                                            <div className="bg-[#FFFFFF80] min-w-[6.25rem] h-auto rounded-[1rem] flex items-center justify-center backdrop-blur-sm montserrat px-3 py-1">
                                                <span className="text-lg font-bold text-[#1D1D1D]">{item.time}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 ml-5 montserrat">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-[0.938rem] font-extrabold text-[#1D1D1D] montserrat">{item.cab}</h3>
                                                        </div>
                                                        <p className="text-[0.75rem] montserrat font-semibold text-[#575757]">{item.customer}</p>
                                                    </div>
                                                    <span className="text-[0.625rem] montserrat font-semibold">{getStatusBadge(item.status)}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3">
                                                    <div>
                                                        <p className="text-[0.563rem] font-medium text-[#575757] tracking-wider mb-0.5">Service</p>
                                                        <p className="text-[0.688rem] font-semibold text-[#1D1D1D]">{item.service}</p>
                                                        <div className="mt-1 text-[0.625rem] font-semibold text-[#575757]">
                                                            <p className="text-[0.563rem] font-medium text-[#575757] tracking-wider mb-0.5">Bay</p>
                                                            <p className="text-[0.688rem] font-semibold text-[#1D1D1D]">{item.bay}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[0.563rem] font-medium text-[#575757] tracking-wider mb-0.5">Vehicle</p>
                                                        <p className="text-[0.688rem] font-semibold text-[#1D1D1D]">{item.vehicle}</p>
                                                        <div className="mt-1 text-[0.625rem] font-semibold text-[#575757]">
                                                            <p className="text-[0.563rem] font-medium text-[#575757] tracking-wider mb-0.5">Technician</p>
                                                            <p className="text-[0.688rem] font-semibold text-[#1D1D1D]">{item.technician}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </AutoScrollColumn>
                        </div>

                        {/* Right Column: Available Time Slots */}
                        <div>
                            <h2 className="text-lg font-bold text-[#1D1D1D] mb-4 montserrat">Available Time Slots</h2>
                            <AutoScrollColumn>
                                {availableSlots.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-[1.25rem] border-2 border-[#039855] flex items-center justify-between transition-transform hover:scale-[1.01] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A] h-auto py-[1.125rem] px-[1.125rem]"
                                        style={{ background: 'linear-gradient(180deg, #A7FFA7 0%, #7FFF7F 100%)' }}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="bg-[#FFFFFF80] w-auto h-auto py-3 px-4 rounded-[0.938rem] flex flex-col items-center justify-center backdrop-blur-sm">
                                                <span className="text-[1.375rem] font-extrabold montserrat text-[#1D1D1D]">{slot.time.split(' ')[0]}{slot.time.split(' ')[1]}</span>
                                                <span className="text-[0.625rem] montserrat text-[#575757]">{slot.duration}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sparkles className="w-4 h-4 text-[#1D7C3D]" />
                                                    <span className="text-[1.063rem] font-extrabold text-[#1D1D1D] tracking-wide montserrat">AVAILABLE</span>
                                                </div>
                                                <p className="text-[0.688rem] font-medium text-[#575757] montserrat">Service Bay</p>
                                                <p className="text-[0.875rem] font-semibold text-[#1D1D1D] mt-0.5 montserrat">{slot.bay}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </AutoScrollColumn>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
