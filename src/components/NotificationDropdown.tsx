/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface NotificationDropdownProps {
    userId?: string;
}

export default function NotificationDropdown({ userId }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = Number(userId)

    // Use our custom hook
    const { data, markAsRead } = useNotifications(user);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (n: any) => {
        if (!n.is_read) {
            markAsRead(n.id);
        }
        // Optional: Navigate to reference (e.g. router.push(`/sales/${n.reference_id}`))
    };

    const unreadCount = data?.unreadCount || 0;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-12 h-12 bg-[#FFFFFFB2]/70 rounded-full flex items-center justify-center hover:bg-gray-100 transition active:scale-95"
            >
                {/* Bell Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M18.134 11C18.715 16.375 21 18 21 18H3C3 18 6 15.867 6 8.4C6 6.703 6.632 5.075 7.757 3.875C8.882 2.675 10.41 2 12 2C12.338 2 12.6713 2.03 13 2.09M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21M19 8C19.7956 8 20.5587 7.68393 21.1213 7.12132C21.6839 6.55871 22 5.79565 22 5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2C18.2044 2 17.4413 2.31607 16.8787 2.87868C16.3161 3.44129 16 4.20435 16 5C16 5.79565 16.3161 6.55871 16.8787 7.12132C17.4413 7.68393 18.2044 8 19 8Z"
                        stroke="#575757"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Red Badge */}
                {unreadCount > 0 && (
                    <span className="absolute right-2 flex h-3 w-3" style={{top: "10px"}}>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DB2727] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DB2727]"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 min-w-[300px] bg-white rounded-[25px] shadow-2xl border border-gray-100 origin-top-right overflow-hidden z-50">
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-[#DB2727]/10 text-[#DB2727] text-xs font-semibold px-2 py-1 rounded-full">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {data?.notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            data?.notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        !notif.is_read ? 'bg-blue-50/30' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                            {dayjs(notif.created_at).fromNow()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                        {notif.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                        <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition">
                            View All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}