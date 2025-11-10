"use client"
import React, {useEffect, useRef, useState} from "react";
import {useAssignChat, useAssignedChats, useChatMessages, useCloseChat, useQueue} from "@/hooks/useChat";
import { io, Socket } from "socket.io-client";

interface Chat {
    id: string;
    channel: string;
    time: string;
    lastMessage: string;
    unreadCount?: number;
}

interface Message {
    id: number;
    sender: "customer" | "bot" | "agent";
    message: string;
    createdAt: string;
}

// const chats: Chat[] = [
//     {
//         id: "INDRA - 52837",
//         channel: "Web",
//         time: "12:35 PM",
//         lastMessage: "Lorem ipsum dolor sit amet consectetur.",
//     },
//     {
//         id: "INDRA - 52838",
//         channel: "WhatsApp",
//         time: "12:35 PM",
//         lastMessage: "Lorem ipsum dolor sit amet consectetur.",
//     },
//     {
//         id: "INDRA - 52839",
//         channel: "Web",
//         time: "12:35 PM",
//         lastMessage: "Lorem ipsum dolor sit amet consectetur.",
//         unreadCount: 3,
//     },
// ];
//
// const messages: Message[] = [
//     {
//         id: "1",
//         sender: "bot",
//         text:
//             "Lorem ipsum dolor sit amet consectetur. Euismod varius donec et proin odio egestas magna bibendum hendrerit. Scelerisque sit.",
//         time: "11:35 AM",
//     },
//     {
//         id: "2",
//         sender: "user",
//         text: "Lorem ipsum dolor sit amet consectetur",
//         time: "11:31 AM",
//     },
//     {
//         id: "3",
//         sender: "bot",
//         text:
//             "Lorem ipsum dolor sit amet consectetur. Euismod varius donec et proin odio egestas magna bibendum hendrerit. Scelerisque sit.",
//         time: "11:35 AM",
//     },
//     {
//         id: "4",
//         sender: "user",
//         text: "Lorem ipsum dolor sit",
//         time: "11:31 AM",
//     },
// ];

const ChatBot: React.FC = () => {

    const agentId = 1;
    const { data: queue = [] } = useQueue();
    const { data: assigned = [] } = useAssignedChats(agentId);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const { data: initialMessages = [] } = useChatMessages(selectedChatId);
    const assignChat = useAssignChat();
    const closeChat = useCloseChat();
    const [messages, setMessages] = useState<Message[]>([]);
    // const sendMessage = useSendMessage();
    const [inputText, setInputText] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            query: { role: "agent", user_id: agentId }
        });
        socketRef.current = socket;

        socket.on("message.new", (msg) => {
            if (msg.chat_id === selectedChatId) {
                setMessages((prev) => [...prev, {
                    id: Date.now(),
                    sender: msg.sender,
                    message: msg.text,
                    createdAt: new Date().toISOString()
                }]);
            }
        });

        socket.on("typing", ({ by }) => {
            if (by === "customer") {
                setTyping(true);
            }
        });

        socket.on("stop_typing", ({ by }) => {
            if (by === "customer") {
                setTyping(false);
            }
        });

        socket.on("chat.closed", () => {
            if (selectedChatId) setSelectedChatId(null);
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedChatId, agentId]);


    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);


    const handleAssign = (chatId: string) => {
        assignChat.mutate({ chat_id: chatId, user_id: agentId });
    };

    const handleClose = () => {
        if (selectedChatId) {
            closeChat.mutate(selectedChatId, {
                onSuccess: () => setSelectedChatId(null)
            });
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedChatId && inputText.trim()) {
            socketRef.current?.emit("message.agent", { chat_id: selectedChatId, text: inputText, user_id: agentId });
            setInputText("");
        }
    };

    const getLastMessage = (chat: any) => {
        return chat.last_message || "No messages yet";
    };

    return (
        <div className="relative h-screen montserrat">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div
                    style={{
                        width: 705,
                        height: 705,
                        left: "calc(50% - 705px / 2 - 0.5px)",
                        top: 309,
                        backgroundColor: "#DB272799",
                        filter: "blur(400px)",
                    }}
                    className="absolute rounded-full"
                />
                <div
                    style={{
                        width: 705,
                        height: 705,
                        left: "calc(50% - 705px / 2 + 771.5px)",
                        top: 853,
                        backgroundColor: "#DB272799",
                        opacity: 0.4,
                        filter: "blur(400px)",
                    }}
                    className="absolute rounded-full"
                />
                <div
                    style={{
                        width: 620,
                        height: 620,
                        left: "calc(50% - 620px / 2 - 720px)",
                        top: 272,
                        backgroundColor: "#DB272799",
                        opacity: 0.3,
                        filter: "blur(400px)",
                    }}
                    className="absolute rounded-full"
                />
                <div
                    style={{
                        width: 562,
                        height: 562,
                        left: "calc(50% - 562px / 2 + 440px)",
                        top: 0,
                        backgroundColor: "#D9D9D9",
                        opacity: 0.4,
                        filter: "blur(400px)",
                    }}
                    className="absolute rounded-full"
                />
                <div
                    style={{
                        width: 562,
                        height: 562,
                        left: "calc(50% - 562px / 2 - 439px)",
                        top: 0,
                        backgroundColor: "#D9D9D9",
                        opacity: 0.4,
                        filter: "blur(400px)",
                    }}
                    className="absolute rounded-full"
                />
            </div>

            <main className="pt-28 max-w-7xl mx-auto flex flex-col rounded-[45px] overflow-hidden">
                <h2 className="text-2xl font-bold mb-6">AI Bot Responses</h2>
                <div className="flex flex-row max-h-screen flex-wrap">
                    {/*<section className="w-3/10 bg-[#FFFFFF4D] py-9 rounded-l-[45px] overflow-y-auto max-h-full">*/}

                    {/*    <h3 className="text-[22px] font-semibold px-9 mb-4">Chats</h3>*/}
                    {/*    <ul>*/}
                    {/*        {chats.map(({id, channel, time, lastMessage, unreadCount}) => (*/}
                    {/*            <li*/}
                    {/*                key={id}*/}
                    {/*                className="relative bg-[#FFFFFF4D] border-b border-[#8E8E8E80] py-4 pr-4 pl-9 cursor-pointer hover:bg-gray-50"*/}
                    {/*            >*/}
                    {/*                <div className="flex justify-between items-center mb-1">*/}
                    {/*                    <span className="font-medium text-[15px] text-black">{id}</span>*/}
                    {/*                    <span className="text-[10px] font-medium text-[#727272]">{time}</span>*/}
                    {/*                </div>*/}
                    {/*                <p className="text-[#95999D] text-[10px] mb-1">{`Channel Type: ${channel}`}</p>*/}
                    {/*                <p className="text-[#575757] text-[12px]">{lastMessage}</p>*/}
                    {/*                {unreadCount && (*/}
                    {/*                    <span*/}
                    {/*                        className="absolute top-10 right-4 bg-[#DB2727] text-white text-[8px] rounded-full w-4 h-4 flex justify-center items-center">*/}
                    {/*                {unreadCount}*/}
                    {/*                    </span>*/}
                    {/*                )}*/}
                    {/*            </li>*/}
                    {/*        ))}*/}
                    {/*    </ul>*/}
                    {/*</section>*/}

                    <section className="w-3/10 bg-[#FFFFFF4D] py-9 rounded-l-[45px] overflow-y-auto max-h-full">
                        <h3 className="text-[22px] font-semibold px-9 mb-4">Queue</h3>
                        <ul>
                            {queue.map((chat: any) => (
                                <li key={chat.chat_id} className="relative bg-[#FFFFFF4D] border-b border-[#8E8E8E80] py-4 pr-4 pl-9 cursor-pointer hover:bg-gray-50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-[15px] text-black">{chat.chat_id}</span>
                                        <span className="text-[10px] font-medium text-[#727272]">{new Date(chat.last_message_at).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                                    </div>
                                    <p className="text-[#95999D] text-[10px] mb-1">{`Channel Type: ${chat.channel}`}</p>
                                    {/*<p className="text-[#575757] text-[12px]">{getLastMessage(chat)}</p>*/}
                                    <button onClick={() => handleAssign(chat.chat_id)} className="bg-[#db2727] text-white px-2 py-1 rounded">Assign</button>
                                    {chat.unread_count && (
                                        <span className="absolute top-10 right-4 bg-[#DB2727] text-white text-[8px] rounded-full w-4 h-4 flex justify-center items-center">
                                            {chat.unread_count}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <h3 className="text-[22px] font-semibold px-9 mb-4 mt-6">My Chats</h3>
                        <ul>
                            {assigned.map((chat: any) => (
                                <li key={chat.chat_id} onClick={() => setSelectedChatId(chat.chat_id)} className="relative bg-[#FFFFFF4D] border-b border-[#8E8E8E80] py-4 pr-4 pl-9 cursor-pointer hover:bg-gray-50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-[15px] text-black">{chat.chat_id}</span>
                                        <span className="text-[10px] font-medium text-[#727272]">{new Date(chat.last_message_at).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                                    </div>
                                    <p className="text-[#95999D] text-[10px] mb-1">{`Channel Type: ${chat.channel}`}</p>
                                    <p className="text-[#575757] text-[12px]">{getLastMessage(chat)}</p>
                                    {/*{chat.unread_count && (*/}
                                    {/*    <span className="absolute top-10 right-4 bg-[#DB2727] text-white text-[8px] rounded-full w-4 h-4 flex justify-center items-center">*/}
                                    {/*        {chat.unread_count}*/}
                                    {/*    </span>*/}
                                    {/*)}*/}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/*<section className="w-7/10 bg-[#FFFFFF]/50 rounded-r-[45px] flex flex-col">*/}
                    {/*    <div*/}
                    {/*        className="flex bg-[#FFFFFF] p-6 rounded-tr-[45px] items-center justify-between border-b border-gray-200 pb-4 mb-4">*/}
                    {/*        <div>*/}
                    {/*            <h4 className="font-semibold text-black text-[15px]">*/}
                    {/*                {chats[0].id}*/}
                    {/*            </h4>*/}
                    {/*            <p className="text-[10px] text-[#95999D]">*/}
                    {/*                Channel Type: {chats[0].channel}*/}
                    {/*            </p>*/}
                    {/*        </div>*/}
                    {/*        <button*/}
                    {/*            className="bg-[#DB2727] text-white px-4 py-2 rounded-full text-[15px] font-semibold hover:bg-red-800 transition">*/}
                    {/*            End Chat*/}
                    {/*        </button>*/}
                    {/*    </div>*/}

                    {/*    <div className="flex-1 py-6 overflow-y-auto space-y-6 px-8">*/}
                    {/*        {messages.map(({id, sender, text, time}) => (*/}
                    {/*            <div*/}
                    {/*                key={id}*/}
                    {/*                className={`flex ${*/}
                    {/*                    sender === "bot" ? "justify-start" : "justify-end"*/}
                    {/*                }`}*/}
                    {/*            >*/}
                    {/*                <div*/}
                    {/*                    className={`max-w-[65%] rounded-md p-3 text-sm leading-6 ${*/}
                    {/*                        sender === "bot"*/}
                    {/*                            ? "bg-[#F1EDED] text-black rounded-l-lg rounded-tr-lg"*/}
                    {/*                            : "bg-white text-black rounded-r-lg rounded-tl-lg"*/}
                    {/*                    }`}*/}
                    {/*                >*/}
                    {/*                    <p className="text-sm font-normal montserrat">{text}</p>*/}
                    {/*                    <span className="block text-xs text-[#7C7C7C] text-right mt-1">*/}
                    {/*                        {time}*/}
                    {/*                    </span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}

                    {/*    <form*/}
                    {/*        className="mt-4 flex m-6 items-center bg-white rounded-full border border-[#F1ECEC] px-6 py-3 max-w-full">*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            aria-label="Attach File"*/}
                    {/*            className="mr-4"*/}
                    {/*        >*/}
                    {/*            <svg className="w-6 h-6 text-gray-500" width="13" height="26" viewBox="0 0 13 26"*/}
                    {/*                 fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*                <path*/}
                    {/*                    d="M5.0077 18.9119L4.94461 6.84666C4.95949 6.42979 5.1341 6.03461 5.4323 5.74293C5.7305 5.45125 6.12945 5.28542 6.54654 5.27976C6.96364 5.2741 7.36693 5.42906 7.67293 5.71254C7.97893 5.99603 8.1642 6.38633 8.19038 6.80264L8.28463 21.1658C8.25488 21.9995 7.90565 22.7899 7.30925 23.3732C6.71285 23.9566 5.91496 24.2883 5.08077 24.2996C4.24658 24.3109 3.43999 24.001 2.82799 23.434C2.21599 22.8671 1.84545 22.0864 1.7931 21.2538L1.69885 6.89068C1.68134 5.59943 2.17749 4.35412 3.07815 3.42869C3.97882 2.50325 5.21022 1.97351 6.50147 1.956C7.79271 1.93849 9.03803 2.43464 9.96346 3.3353C10.8889 4.23597 11.4186 5.46737 11.4361 6.75862L11.6102 18.5351"*/}
                    {/*                    stroke="#78787C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*/}
                    {/*            </svg>*/}

                    {/*        </button>*/}

                    {/*        <input*/}
                    {/*            type="text"*/}
                    {/*            placeholder="Message"*/}
                    {/*            className="flex-1 outline-none text-gray-700 text-[15px] placeholder-[#ABABAB]"*/}
                    {/*        />*/}

                    {/*        <button*/}
                    {/*            type="submit"*/}
                    {/*            aria-label="Send Message"*/}
                    {/*            className="ml-4 text-red-700 hover:text-red-800 transition"*/}
                    {/*        >*/}
                    {/*            <svg className="w-6 h-6" width="22" height="24" viewBox="0 0 22 24" fill="none"*/}
                    {/*                 xmlns="http://www.w3.org/2000/svg">*/}
                    {/*                <path fillRule="evenodd" clipRule="evenodd"*/}
                    {/*                      d="M2.17514 3.40767L3.2083 10.7813H9.58305C10.1253 10.7813 10.565 11.3269 10.565 12C10.565 12.6731 10.1253 13.2188 9.58305 13.2188H3.2083L2.17514 20.5923L18.3277 12L2.17514 3.40767ZM1.38578 12L0.174671 3.35636C0.0767631 2.65759 0.258928 1.94339 0.662986 1.44186C1.17068 0.811719 1.93632 0.628695 2.59625 0.979744L20.1427 10.3135C20.6861 10.6027 21.0386 11.266 21.0386 12C21.0386 12.734 20.6861 13.3974 20.1427 13.6865L2.59625 23.0202C1.93632 23.3714 1.17068 23.1882 0.662986 22.5582C0.258928 22.0566 0.0767628 21.3424 0.174671 20.6436L1.38578 12Z"*/}
                    {/*                      fill="#DB2727"/>*/}
                    {/*            </svg>*/}

                    {/*        </button>*/}
                    {/*    </form>*/}
                    {/*</section>*/}

                    <section className="w-7/10 bg-[#FFFFFF]/50 rounded-r-[45px] flex flex-col">
                        {selectedChatId ? (
                            <>
                                <div className="flex bg-[#FFFFFF] p-6 rounded-tr-[45px] items-center justify-between border-b border-gray-200 pb-4 mb-4">
                                    <div>
                                        <h4 className="font-semibold text-black text-[15px]">
                                            {selectedChatId}
                                        </h4>
                                        <p className="text-[10px] text-[#95999D]">
                                            Channel Type: Web {/* Fetch from selected chat */}
                                        </p>
                                    </div>
                                    <button onClick={handleClose} className="bg-[#DB2727] text-white px-4 py-2 rounded-full text-[15px] font-semibold hover:bg-red-800 transition">
                                        End Chat
                                    </button>
                                </div>

                                <div className="flex-1 py-6 overflow-y-auto space-y-6 px-8">
                                    {messages.map((msg: any) => (
                                        <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[65%] rounded-md p-3 text-sm leading-6 ${msg.sender === "agent" ? "bg-white text-black rounded-r-lg rounded-tl-lg" : "bg-[#F1EDED] text-black rounded-l-lg rounded-tr-lg"}`}>
                                                <p className="text-sm font-normal montserrat">{msg.message}</p>
                                                <span className="block text-xs text-[#7C7C7C] text-right mt-1">
                                                   {new Date(msg.createdAt).toLocaleTimeString([], { timeStyle: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {typing && <p className="text-[#7C7C7C] text-sm">Customer is typing...</p>}
                                </div>

                                <form onSubmit={handleSend} className="mt-4 flex m-6 items-center bg-white rounded-full border border-[#F1ECEC] px-6 py-3 max-w-full">
                                    <button type="button" aria-label="Attach File" className="mr-4">
                                        <svg className="w-6 h-6 text-gray-500" width="13" height="26" viewBox="0 0 13 26"
                                             fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5.0077 18.9119L4.94461 6.84666C4.95949 6.42979 5.1341 6.03461 5.4323 5.74293C5.7305 5.45125 6.12945 5.28542 6.54654 5.27976C6.96364 5.2741 7.36693 5.42906 7.67293 5.71254C7.97893 5.99603 8.1642 6.38633 8.19038 6.80264L8.28463 21.1658C8.25488 21.9995 7.90565 22.7899 7.30925 23.3732C6.71285 23.9566 5.91496 24.2883 5.08077 24.2996C4.24658 24.3109 3.43999 24.001 2.82799 23.434C2.21599 22.8671 1.84545 22.0864 1.7931 21.2538L1.69885 6.89068C1.68134 5.59943 2.17749 4.35412 3.07815 3.42869C3.97882 2.50325 5.21022 1.97351 6.50147 1.956C7.79271 1.93849 9.03803 2.43464 9.96346 3.3353C10.8889 4.23597 11.4186 5.46737 11.4361 6.75862L11.6102 18.5351"
                                                stroke="#78787C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <input type="text" placeholder="Message" value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 outline-none text-gray-700 text-[15px] placeholder-[#ABABAB]" />
                                    <button type="submit" aria-label="Send Message" className="ml-4 text-red-700 hover:text-red-800 transition">
                                        <svg className="w-6 h-6" width="22" height="24" viewBox="0 0 22 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M2.17514 3.40767L3.2083 10.7813H9.58305C10.1253 10.7813 10.565 11.3269 10.565 12C10.565 12.6731 10.1253 13.2188 9.58305 13.2188H3.2083L2.17514 20.5923L18.3277 12L2.17514 3.40767ZM1.38578 12L0.174671 3.35636C0.0767631 2.65759 0.258928 1.94339 0.662986 1.44186C1.17068 0.811719 1.93632 0.628695 2.59625 0.979744L20.1427 10.3135C20.6861 10.6027 21.0386 11.266 21.0386 12C21.0386 12.734 20.6861 13.3974 20.1427 13.6865L2.59625 23.0202C1.93632 23.3714 1.17068 23.1882 0.662986 22.5582C0.258928 22.0566 0.0767628 21.3424 0.174671 20.6436L1.38578 12Z"
                                                  fill="#DB2727"/>
                                        </svg>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p>Select a chat to view messages</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ChatBot;
