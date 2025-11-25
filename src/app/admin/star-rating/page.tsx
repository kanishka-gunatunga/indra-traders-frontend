/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import Header from "@/components/Header";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {useChatHistory, useRatedSessions} from "@/hooks/useChat";
import Modal from "@/components/Modal";
import {FaStar} from "react-icons/fa";


const StarDisplay = ({count}: { count: number }) => (
    <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < count ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
        ))}
    </div>
);


const SessionHistoryView = ({session}: { session: any }) => {
    const {data: messages, isLoading} = useChatHistory(session?.chat_id);
    const scrollRef = useRef<HTMLDivElement>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const renderBold = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="w-full min-w-[800px] flex flex-col gap-4">

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1; /* slate-300 */
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8; /* slate-400 */
                }

                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                }
            `}</style>


            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="font-medium">{session.chat_id}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Handled By</p>
                    <p className="font-medium">{session.agent?.full_name || "Automated Bot"}</p>
                </div>
                <div className="text-right">
                    <div className="flex gap-1 text-yellow-400 justify-end">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < session.agent_rating ? "block" : "text-gray-300"}/>
                        ))}
                    </div>
                    <p className="text-sm italic text-gray-600 mt-1">
                        &#34;{session.rating_message || "No comment"}&#34;
                    </p>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="h-[500px] overflow-y-auto p-4 bg-[#F5F7FA] rounded-2xl border border-gray-200 flex flex-col gap-3 custom-scrollbar hide-scrollbar"
            >
                {isLoading ? (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DB2727]"></div>
                    </div>
                ) : messages && messages.length > 0 ? (
                    messages.map((msg: any) => {
                        const isCustomer = msg.sender === "customer";
                        const isSystem = msg.sender === "system";

                        if (isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-2">
                  <span
                      className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-200">
                    {msg.message}
                  </span>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={msg.id}
                                className={`flex w-full ${isCustomer ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm relative ${
                                        isCustomer
                                            ? "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                                            : "bg-[#DB2727] text-white rounded-tr-none"
                                    }`}
                                >
                                    {/* Attachment Rendering */}
                                    {msg.attachment_url && (
                                        <div className="mb-2 mt-1">
                                            {msg.attachment_type === 'image' ? (
                                                <img
                                                    src={msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_URL}${msg.attachment_url}`}
                                                    alt="Attachment"
                                                    className="rounded-lg max-w-full h-auto border border-white/20"
                                                />
                                            ) : (
                                                <a
                                                    href={msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_URL}${msg.attachment_url}`}
                                                    target="_blank"
                                                    className="flex items-center gap-2 underline"
                                                    style={{color: isCustomer ? '#DB2727' : 'white'}}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" viewBox="0 0 16 16">
                                                        <path
                                                            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                                    </svg>
                                                    {msg.file_name || "Document"}
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="whitespace-pre-wrap word-break-normal overflow-wrap-anywhere">
                                        {renderBold(msg.message)}
                                    </div>
                                    <span
                                        className={`text-[10px] block text-right mt-1 ${
                                            isCustomer ? "text-gray-400" : "text-red-100"
                                        }`}
                                    >
                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                            timeStyle: "short",
                                        })}
                                      </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        No messages found in this session.
                    </div>
                )}
            </div>
        </div>
    );
};

export default function StartRating() {

    const [page, setPage] = useState(1);
    const limit = 10;

    const {data, isLoading, isPlaceholderData} = useRatedSessions(page, limit);

    const sessions = data?.sessions || [];
    const totalPages = Math.max(1, data?.totalPages || 0);
    const totalItems = data?.totalItems || 0;

    console.log("----------  chats: ", sessions);

    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    const getPageNumbers = () => {
        if (totalPages <= 3) {
            return Array.from({length: totalPages}, (_, i) => i + 1);
        }
        if (page <= 1) return [1, 2, 3];
        if (page >= totalPages) return [totalPages - 2, totalPages - 1, totalPages];
        return [page - 1, page, page + 1];
    };

    const pageNumbers = getPageNumbers();

    return (
        <div
            className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8">
                <Header
                    name="Sophie Eleanor"
                    location="Bambalapitiya"
                    title="Customer’s Star Ratings"
                />

                {/* Star Ratings Section */}
                <section
                    className="relative mb-5 bg-[#FFFFFF4D] bg-opacity-30 border border-[#E0E0E0] rounded-[45px] px-9 py-10 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-between items-center">
                        <span className="font-semibold text-[22px]">Star Ratings</span>

                        <button className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                            <Image
                                src={"/images/admin/flowbite_filter-outline.svg"}
                                width={24}
                                height={24}
                                alt="Filter icon"
                            />
                        </button>
                    </div>
                    <div className="w-full mt-5 ">
                        <div className="h-[500px] overflow-x-auto overflow-y-hidden ">
                            <div className="min-w-[1000px] ">
                                {/* Table header */}
                                <div
                                    className="flex bg-gray-100 text-[#575757] font-normal text-lg montserrat border-b-2 mb-2 border-[#CCCCCC]">
                                    {/*<div className="w-1/5 px-3 py-2">Contact No.</div>*/}
                                    {/*  <div className="w-1/6 px-3 py-2">Customer</div>*/}
                                    {/*<div className="w-1/5 px-3 py-2">Channel</div>*/}
                                    {/*<div className="w-1/5 px-3 py-2">Star count</div>*/}
                                    {/*<div className="w-2/5 px-3 py-2">Feedback Message</div>*/}

                                    <div className="w-1/6 px-3 py-2">Date</div>
                                    <div className="w-1/6 px-3 py-2">Customer</div>
                                    <div className="w-1/6 px-3 py-2">Contact</div>
                                    <div className="w-1/6 px-3 py-2">Agent</div>
                                    <div className="w-1/6 px-3 py-2">Rating</div>
                                    <div className="w-1/6 px-3 py-2">Feedback Message</div>
                                    {/*<div className="w-1/7 px-3 py-2">Status</div>*/}
                                </div>

                                {/* Table body (scrollable vertically) */}
                                <div className="h-[360px] py-3 overflow-y-auto no-scrollbar">
                                    {isLoading ? (
                                        <div className="text-center py-10 text-gray-500">Loading ratings...</div>
                                    ) : sessions.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">No ratings found yet.</div>
                                    ) : (
                                        sessions.map((item: any) => (
                                            // {startRatingsData.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                className="flex text-lg mt-2 text-black hover:bg-gray-50 transition cursor-pointer"
                                                onClick={() => setSelectedSession(item)}
                                            >
                                                {/*<div className="w-1/5 px-3 py-2">{item.contactNo}</div>*/}
                                                <div className="w-1/6 px-3 py-2 text-sm text-gray-600">
                                                    {new Date(item.createdAt).toLocaleDateString()} <br/>
                                                    <span
                                                        className="text-xs">{new Date(item.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                </div>
                                                {/*<div className="w-1/5 px-3 py-2">{item.channel}</div>*/}
                                                <div className="w-1/6 px-3 py-2 text-sm font-medium truncate"
                                                     title={item.customer_name}>
                                                    {item.customer_name || "Guest"}
                                                </div>
                                                {/*<div className="w-1/5 px-3 py-2"><StarDisplay count={item.agent_rating} /></div>*/}
                                                <div className="w-1/6 px-3 py-2 text-sm truncate text-gray-600"
                                                     title={item.customer_contact || item.chat_id}>
                                                    {item.customer_contact || item.chat_id.substring(0, 12) + "..."}
                                                </div>
                                                {/*<div className="w-2/5 px-3 py-2 relative">*/}
                                                {/*    {item.rating_message || "-"}*/}
                                                {/*</div>*/}

                                                <div className="w-1/6 px-3 py-2 text-sm">
                                                    {item.agent?.full_name || "Unassigned"}
                                                </div>

                                                <div className="w-1/6 px-3 py-2">
                                                    {item.agent_rating ? <StarDisplay count={item.agent_rating}/> :
                                                        <span className="text-xs text-gray-400">-</span>}
                                                </div>

                                                <div className="w-1/6 px-3 py-2 text-sm">
                                                    {item.rating_message || "-"}
                                                </div>

                                                {/*<div className="w-1/7 px-3 py-2">*/}
                                                {/*    <span className={`text-xs px-2 py-1 rounded-full font-medium ${*/}
                                                {/*        item.status === 'closed' ? 'bg-gray-200 text-gray-600' :*/}
                                                {/*            item.status === 'assigned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'*/}
                                                {/*    }`}>*/}
                                                {/*        {item.status}*/}
                                                {/*    </span>*/}
                                                {/*</div>*/}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-200 flex justify-center w-full">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(old => Math.max(old - 1, 1))}
                                        disabled={page === 1}
                                        className="flex justify-center items-center h-8 px-4 rounded-md bg-white/30 text-gray-400 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
                                    >
                                        Prev
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        {pageNumbers.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 rounded-lg font-semibold transition ${
                                                    page === p
                                                        ? "bg-[#DB2727] text-white"
                                                        : "bg-white/30 text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!isPlaceholderData && page < totalPages) {
                                                setPage(old => old + 1);
                                            }
                                        }}
                                        disabled={isPlaceholderData || page >= totalPages}
                                        className="flex justify-center items-center h-8 px-4 rounded-md bg-white/30 text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {selectedSession && (
                <Modal
                    title="Chat History"
                    onClose={() => setSelectedSession(null)}
                >
                    <SessionHistoryView session={selectedSession}/>
                </Modal>
            )}
        </div>
    );
}
