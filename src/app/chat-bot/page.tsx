/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client"
// import React, {useState} from "react";
// import {useAgentChat} from "@/hooks/useChat";
//
// const ChatDashboard: React.FC = () => {
//     const agentId = 1;
//     const {
//         queue,
//         assigned,
//         selectedChatId,
//         selectChat,
//         messages,
//         acceptChat,
//         sendMessage,
//         closeChat,
//     } = useAgentChat(agentId);
//
//     const [inputText, setInputText] = useState("");
//     const [typing, setTyping] = useState(false);
//
//     const handleSend = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedChatId || !inputText.trim()) return;
//         sendMessage(selectedChatId, inputText);
//         setInputText("");
//     };
//
//     return (
//         <div className="relative h-screen montserrat">
//             <div className="pointer-events-none fixed inset-0 -z-10">
//                 <div
//                     style={{
//                         width: 705,
//                         height: 705,
//                         left: "calc(50% - 705px / 2 - 0.5px)",
//                         top: 309,
//                         backgroundColor: "#DB272799",
//                         filter: "blur(400px)",
//                     }}
//                     className="absolute rounded-full"
//                 />
//                 <div
//                     style={{
//                         width: 705,
//                         height: 705,
//                         left: "calc(50% - 705px / 2 + 771.5px)",
//                         top: 853,
//                         backgroundColor: "#DB272799",
//                         opacity: 0.4,
//                         filter: "blur(400px)",
//                     }}
//                     className="absolute rounded-full"
//                 />
//                 <div
//                     style={{
//                         width: 620,
//                         height: 620,
//                         left: "calc(50% - 620px / 2 - 720px)",
//                         top: 272,
//                         backgroundColor: "#DB272799",
//                         opacity: 0.3,
//                         filter: "blur(400px)",
//                     }}
//                     className="absolute rounded-full"
//                 />
//                 <div
//                     style={{
//                         width: 562,
//                         height: 562,
//                         left: "calc(50% - 562px / 2 + 440px)",
//                         top: 0,
//                         backgroundColor: "#D9D9D9",
//                         opacity: 0.4,
//                         filter: "blur(400px)",
//                     }}
//                     className="absolute rounded-full"
//                 />
//                 <div
//                     style={{
//                         width: 562,
//                         height: 562,
//                         left: "calc(50% - 562px / 2 - 439px)",
//                         top: 0,
//                         backgroundColor: "#D9D9D9",
//                         opacity: 0.4,
//                         filter: "blur(400px)",
//                     }}
//                     className="absolute rounded-full"
//                 />
//             </div>
//
//             <main className="pt-28 max-w-7xl mx-auto flex flex-col rounded-[45px] overflow-hidden">
//                 <h2 className="text-2xl font-bold mb-6">AI Bot Responses</h2>
//                 <div className="flex flex-row max-h-screen flex-wrap">
//
//                     <section className="w-3/10 bg-[#FFFFFF4D] py-9 rounded-l-[45px] overflow-y-auto max-h-full">
//                         <h3 className="text-[22px] font-semibold px-9 mb-4">Queue</h3>
//                         <ul>
//                             {queue.map((chat: any) => (
//                                 <li key={chat.chat_id}
//                                     className="relative bg-[#FFFFFF4D] border-b border-[#8E8E8E80] py-4 pr-4 pl-9 cursor-pointer hover:bg-gray-50">
//                                     <div className="flex justify-between items-center mb-1">
//                                         <span className="font-medium text-[15px] text-black">{chat.chat_id}</span>
//                                         <span
//                                             className="text-[10px] font-medium text-[#727272]">{new Date(chat.last_message_at).toLocaleTimeString([], {timeStyle: 'short'})}</span>
//                                     </div>
//                                     <p className="text-[#95999D] text-[10px] mb-1">{`Channel Type: ${chat.channel}`}</p>
//                                     <button
//                                         onClick={() => acceptChat(chat.chat_id)}
//                                         className="bg-[#db2727] text-white px-2 py-1 rounded">
//                                         Assign
//                                     </button>
//                                     {chat.unread_count > 0 && (
//                                         <span
//                                             className="absolute top-10 right-4 bg-[#DB2727] text-white text-[8px] rounded-full w-4 h-4 flex justify-center items-center">
//                                             {chat.unread_count}
//                                         </span>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                         <h3 className="text-[22px] font-semibold px-9 mb-4 mt-6">My Chats</h3>
//                         <ul>
//                             {assigned.map((chat: any) => (
//                                 <li key={chat.chat_id}
//                                     onClick={() => selectChat(chat.chat_id)}
//                                     className="relative bg-[#FFFFFF4D] border-b border-[#8E8E8E80] py-4 pr-4 pl-9 cursor-pointer hover:bg-gray-50">
//                                     <div className="flex justify-between items-center mb-1">
//                                         <span className="font-medium text-[15px] text-black">{chat.chat_id}</span>
//                                         <span
//                                             className="text-[10px] font-medium text-[#727272]">{new Date(chat.last_message_at).toLocaleTimeString([], {
//                                             timeStyle: "short",
//                                         })}</span>
//                                     </div>
//                                     <p className="text-[#95999D] text-[10px] mb-1">Channel
//                                         Type: {chat.channel || "Web"}</p>
//                                     {/*<p className="text-[#575757] text-[12px]">{getLastMessage(chat)}</p>*/}
//                                     {chat.unread_count > 0 && (
//                                         <span
//                                             className="absolute top-10 right-4 bg-[#DB2727] text-white text-[8px] rounded-full w-4 h-4 flex justify-center items-center">
//                                             {chat.unread_count}
//                                         </span>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     </section>
//
//                     <section className="w-7/10 bg-[#FFFFFF]/50 rounded-r-[45px] flex flex-col">
//                         {selectedChatId ? (
//                             <>
//                                 <div
//                                     className="flex bg-[#FFFFFF] p-6 rounded-tr-[45px] items-center justify-between border-b border-gray-200 pb-4 mb-4">
//                                     <div>
//                                         <h4 className="font-semibold text-black text-[15px]">
//                                             {selectedChatId}
//                                         </h4>
//                                         <p className="text-[10px] text-[#95999D]">
//                                             Channel Type: Web {/* Fetch from selected chat */}
//                                         </p>
//                                     </div>
//                                     <button onClick={() => closeChat(selectedChatId)}
//                                             className="bg-[#DB2727] text-white px-4 py-2 rounded-full text-[15px] font-semibold hover:bg-red-800 transition">
//                                         End Chat
//                                     </button>
//                                 </div>
//
//                                 <div className="flex-1 py-6 overflow-y-auto max-h-[20rem] space-y-6 px-8">
//                                     {messages.map((msg: any) => (
//                                         <div key={msg.id}
//                                              className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
//                                             <div
//                                                 className={`max-w-[65%] rounded-md p-3 text-sm leading-6 ${msg.sender === "agent" ? "bg-white text-black rounded-r-lg rounded-tl-lg" : "bg-[#F1EDED] text-black rounded-l-lg rounded-tr-lg"}`}>
//                                                 <p className="text-sm font-normal montserrat">{msg.message}</p>
//                                                 <span className="block text-xs text-[#7C7C7C] text-right mt-1">
//                                                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                                                         timeStyle: "short",
//                                                     })}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     {typing && (
//                                         <p className="text-[#7C7C7C] text-sm">
//                                             Customer is typing...
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <form onSubmit={handleSend}
//                                       className="mt-4 flex m-6 items-center bg-white rounded-full border border-[#F1ECEC] px-6 py-3 max-w-full">
//                                     <button type="button" aria-label="Attach File" className="mr-4">
//                                         <svg className="w-6 h-6 text-gray-500" width="13" height="26"
//                                              viewBox="0 0 13 26"
//                                              fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path
//                                                 d="M5.0077 18.9119L4.94461 6.84666C4.95949 6.42979 5.1341 6.03461 5.4323 5.74293C5.7305 5.45125 6.12945 5.28542 6.54654 5.27976C6.96364 5.2741 7.36693 5.42906 7.67293 5.71254C7.97893 5.99603 8.1642 6.38633 8.19038 6.80264L8.28463 21.1658C8.25488 21.9995 7.90565 22.7899 7.30925 23.3732C6.71285 23.9566 5.91496 24.2883 5.08077 24.2996C4.24658 24.3109 3.43999 24.001 2.82799 23.434C2.21599 22.8671 1.84545 22.0864 1.7931 21.2538L1.69885 6.89068C1.68134 5.59943 2.17749 4.35412 3.07815 3.42869C3.97882 2.50325 5.21022 1.97351 6.50147 1.956C7.79271 1.93849 9.03803 2.43464 9.96346 3.3353C10.8889 4.23597 11.4186 5.46737 11.4361 6.75862L11.6102 18.5351"
//                                                 stroke="#78787C" strokeWidth="2" strokeLinecap="round"
//                                                 strokeLinejoin="round"/>
//                                         </svg>
//                                     </button>
//                                     <input type="text" placeholder="Message" value={inputText}
//                                            onChange={(e) => setInputText(e.target.value)}
//                                            className="flex-1 outline-none text-gray-700 text-[15px] placeholder-[#ABABAB]"/>
//                                     <button type="submit" aria-label="Send Message"
//                                             className="ml-4 text-red-700 hover:text-red-800 transition">
//                                         <svg className="w-6 h-6" width="22" height="24" viewBox="0 0 22 24" fill="none"
//                                              xmlns="http://www.w3.org/2000/svg">
//                                             <path fillRule="evenodd" clipRule="evenodd"
//                                                   d="M2.17514 3.40767L3.2083 10.7813H9.58305C10.1253 10.7813 10.565 11.3269 10.565 12C10.565 12.6731 10.1253 13.2188 9.58305 13.2188H3.2083L2.17514 20.5923L18.3277 12L2.17514 3.40767ZM1.38578 12L0.174671 3.35636C0.0767631 2.65759 0.258928 1.94339 0.662986 1.44186C1.17068 0.811719 1.93632 0.628695 2.59625 0.979744L20.1427 10.3135C20.6861 10.6027 21.0386 11.266 21.0386 12C21.0386 12.734 20.6861 13.3974 20.1427 13.6865L2.59625 23.0202C1.93632 23.3714 1.17068 23.1882 0.662986 22.5582C0.258928 22.0566 0.0767628 21.3424 0.174671 20.6436L1.38578 12Z"
//                                                   fill="#DB2727"/>
//                                         </svg>
//                                     </button>
//                                 </form>
//                             </>
//                         ) : (
//                             <div className="flex-1 flex items-center justify-center">
//                                 <p>Select a chat to view messages</p>
//                             </div>
//                         )}
//                     </section>
//                 </div>
//             </main>
//         </div>
//     );
// };
//
// export default ChatDashboard;

// "use client"
// import React, { useState, useEffect, useRef } from "react";
// import { useAgentChat } from "@/hooks/useChat";
//
// // --- Icons (Simple SVGs) ---
// const SendIcon = () => (
//     <svg className="w-6 h-6 text-[#DB2727]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
// );
// const AttachIcon = () => (
//     <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
// );
// const UserIcon = () => (
//     <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
// );
// const DoubleCheck = () => (
//     <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
// );
//
//
// const ChatDashboard: React.FC = () => {
//     const agentId = 1;
//     const {
//         queue,
//         assigned,
//         selectedChatId,
//         selectChat,
//         messages,
//         acceptChat,
//         sendMessage,
//         closeChat,
//         isCustomerTyping,
//         sendTyping,
//         sendStopTyping
//     } = useAgentChat(agentId);
//
//     const [inputText, setInputText] = useState("");
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//
//     // Auto-scroll to bottom
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages, isCustomerTyping]);
//
//     // Handle Input & Typing
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInputText(e.target.value);
//
//         // Emit typing event
//         sendTyping();
//
//         // Debounce stop typing
//         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//             sendStopTyping();
//         }, 1000);
//     };
//
//     const handleSend = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedChatId || !inputText.trim()) return;
//         sendMessage(inputText);
//         setInputText("");
//         sendStopTyping();
//     };
//
//     return (
//         <div className="flex h-screen w-full bg-[#F0F2F5] font-sans overflow-hidden">
//
//             {/* --- LEFT SIDEBAR (Lists) --- */}
//             <aside className="w-[350px] flex flex-col border-r border-gray-300 bg-white">
//
//                 {/* Header */}
//                 <div className="h-16 bg-[#F0F2F5] px-4 flex items-center justify-between border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
//                             <img src="/agent.png" alt="Agent" className="w-full h-full object-cover" />
//                         </div>
//                         <span className="font-semibold text-gray-700">My Dashboard</span>
//                     </div>
//                 </div>
//
//                 {/* Queue Section */}
//                 <div className="flex-1 overflow-y-auto">
//                     {queue.length > 0 && (
//                         <div className="mb-2">
//                             <div className="bg-[#DB2727] text-white text-xs font-bold px-4 py-2 uppercase tracking-wide sticky top-0 z-10">
//                                 Waiting Queue ({queue.length})
//                             </div>
//                             {queue.map((chat) => (
//                                 <div key={chat.chat_id} className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-default">
//                                     <div className="flex justify-between items-start">
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//                                                 <UserIcon />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm font-semibold text-gray-800">Guest User</p>
//                                                 <p className="text-xs text-gray-500">{chat.chat_id.substring(0,8)}...</p>
//                                             </div>
//                                         </div>
//                                         <button
//                                             onClick={(e) => { e.stopPropagation(); acceptChat(chat.chat_id); }}
//                                             className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full shadow-sm transition"
//                                         >
//                                             Accept
//                                         </button>
//                                     </div>
//                                     <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
//                                         <span>{new Date(chat.last_message_at).toLocaleTimeString([], {timeStyle: 'short'})}</span>
//                                         <span className="bg-gray-100 px-2 py-0.5 rounded">{chat.channel || 'Web'}</span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//
//                     {/* Assigned Chats Section */}
//                     <div>
//                         <div className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 uppercase tracking-wide sticky top-0 z-10">
//                             My Active Chats
//                         </div>
//                         {assigned.map((chat) => (
//                             <div
//                                 key={chat.chat_id}
//                                 onClick={() => selectChat(chat.chat_id)}
//                                 className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition relative
//                                     ${selectedChatId === chat.chat_id ? 'bg-[#F0F2F5]' : 'hover:bg-gray-50'}
//                                 `}
//                             >
//                                 <div className="flex justify-between items-start mb-1">
//                                     <div className="flex gap-3 overflow-hidden">
//                                         <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
//                                             <UserIcon />
//                                         </div>
//                                         <div className="flex flex-col justify-center min-w-0">
//                                             <h4 className="text-sm font-semibold text-gray-900 truncate">Guest {chat.chat_id.substring(0,4)}</h4>
//                                             <p className="text-sm text-gray-500 truncate">
//                                                 {/* Last Message Preview would go here if available in 'chat' object */}
//                                                 Click to view conversation
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex flex-col items-end gap-1">
//                                         <span className={`text-xs ${chat.unread_count > 0 ? 'text-[#DB2727] font-bold' : 'text-gray-400'}`}>
//                                             {new Date(chat.last_message_at).toLocaleTimeString([], {timeStyle: 'short'})}
//                                         </span>
//                                         {chat.unread_count > 0 && (
//                                             <span className="bg-[#DB2727] text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full">
//                                                 {chat.unread_count}
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </aside>
//
//             {/* --- RIGHT SIDE (Chat Area) --- */}
//             <main className="flex-1 flex flex-col relative bg-[#EFE7DD] bg-opacity-30">
//                 {/* Background Pattern (WhatsApp style subtle pattern) */}
//                 <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>
//
//                 {selectedChatId ? (
//                     <>
//                         {/* Chat Header */}
//                         <header className="h-16 bg-[#F0F2F5] px-4 flex items-center justify-between border-b border-gray-300 z-10">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
//                                     <UserIcon />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-semibold text-gray-800">Guest Customer</h3>
//                                     <p className="text-xs text-gray-500">{selectedChatId}</p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => closeChat(selectedChatId)}
//                                 className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded border border-transparent hover:border-red-200 text-sm font-medium transition"
//                             >
//                                 End Chat
//                             </button>
//                         </header>
//
//                         {/* Messages Area */}
//                         <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-2 z-10">
//                             {messages.map((msg: any) => {
//                                 const isAgent = msg.sender === "agent";
//                                 return (
//                                     <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
//                                         <div
//                                             className={`
//                                                 max-w-[60%] rounded-lg px-3 py-2 text-sm shadow-sm relative
//                                                 ${isAgent ? "bg-[#DB2727] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}
//                                             `}
//                                         >
//                                             <p className="mb-1">{msg.message}</p>
//                                             <div className={`text-[10px] flex items-center justify-end gap-1 ${isAgent ? "text-red-100" : "text-gray-400"}`}>
//                                                 {new Date(msg.createdAt).toLocaleTimeString([], { timeStyle: "short" })}
//                                                 {isAgent && msg.viewed_by_customer && <DoubleCheck />}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//
//                             {isCustomerTyping && (
//                                 <div className="flex justify-start">
//                                     <div className="bg-white px-4 py-2 rounded-full rounded-tl-none shadow-sm">
//                                         <div className="flex space-x-1">
//                                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
//                                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                             <div ref={messagesEndRef} />
//                         </div>
//
//                         {/* Input Footer */}
//                         <footer className="bg-[#F0F2F5] px-4 py-3 z-10">
//                             <form onSubmit={handleSend} className="flex items-center gap-2">
//                                 <button type="button" className="p-2 hover:bg-gray-200 rounded-full transition">
//                                     <AttachIcon />
//                                 </button>
//                                 <div className="flex-1 bg-white rounded-lg overflow-hidden flex items-center border border-gray-300 focus-within:ring-1 focus-within:ring-red-500">
//                                     <input
//                                         type="text"
//                                         className="w-full px-4 py-3 outline-none text-gray-700 text-sm"
//                                         placeholder="Type a message"
//                                         value={inputText}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>
//                                 <button
//                                     type="submit"
//                                     className={`p-3 rounded-full shadow-md transition transform active:scale-95 ${inputText.trim() ? 'bg-[#DB2727] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
//                                     disabled={!inputText.trim()}
//                                 >
//                                     <SendIcon />
//                                 </button>
//                             </form>
//                         </footer>
//                     </>
//                 ) : (
//                     /* Empty State */
//                     <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] border-b-[6px] border-[#DB2727] z-10">
//                         <div className="w-64 h-64 relative mb-6">
//                             {/* Insert a placeholder illustration here */}
//                             <img src="/agent.png" className="opacity-20 grayscale" alt="Welcome" />
//                         </div>
//                         <h2 className="text-3xl font-light text-gray-600 mb-4">DFCC Agent Dashboard</h2>
//                         <p className="text-gray-500 text-sm">Select a chat from the queue to start messaging.</p>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default ChatDashboard;


"use client"
import React, {useState, useEffect, useRef} from "react";
import {useAgentChat} from "@/hooks/useChat";
import Image from "next/image";
// import {useCurrentUser} from "@/utils/auth";


const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
    </svg>
);

const AttachIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
);
const UserIcon = () => (
    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
    </svg>
);
const DoubleCheck = () => (
    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
    </svg>
);


const ChatDashboard: React.FC = () => {

    // const user = useCurrentUser();
    // console.log("--------------- :", user);

    const agentId = 1;

    const {
        queue,
        assigned,
        selectedChatId,
        selectChat,
        messages,
        acceptChat,
        sendMessage,
        closeChat,
        isCustomerTyping,
        sendTyping,
        sendStopTyping
    } = useAgentChat(agentId);

    const [inputText, setInputText] = useState("");

    const [acceptingChatId, setAcceptingChatId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setAcceptingChatId(null);
    }, [queue]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, isCustomerTyping]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        sendTyping();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            sendStopTyping();
        }, 1000);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChatId || !inputText.trim()) return;
        sendMessage(inputText);
        setInputText("");
        sendStopTyping();
    };

    if (!agentId) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-[#e0e0e0] p-6">
                Loading Agent Dashboard...
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#e0e0e0] p-6">

            {/* --- Main Card Container (Resized) --- */}
            <div
                className="flex w-full max-w-6xl h-[75vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

                {/* --- LEFT SIDEBAR (Lists) --- */}
                <aside className="w-[320px] flex flex-col border-r border-gray-200 bg-white">

                    {/* Header */}
                    <div className="h-16 bg-[#F0F2F5] px-4 flex items-center gap-3 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-gray-300">
                            <Image src="/agent.png" width={32} height={32} alt="Agent"
                                   className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">Agent Dashboard</span>
                    </div>

                    {/* Queue Section */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Queue List */}
                        {queue.length > 0 && (
                            <div className="mb-2">
                                <div
                                    className="bg-[#DB2727] text-white text-[11px] font-bold px-4 py-2 uppercase tracking-wide sticky top-0 z-10">
                                    Waiting Queue ({queue.length})
                                </div>
                                {queue.map((chat) => (
                                    <div key={chat.chat_id}
                                         className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-default">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <UserIcon/>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">Guest User</p>
                                                    <p className="text-[10px] text-gray-500">{chat.chat_id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                            <button
                                                disabled={acceptingChatId === chat.chat_id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAcceptingChatId(chat.chat_id);
                                                    acceptChat(chat.chat_id);
                                                }}
                                                className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-sm transition"
                                            >
                                                {acceptingChatId === chat.chat_id ? 'Accepting...' : 'Accept'}
                                            </button>
                                        </div>
                                        <div
                                            className="mt-1 flex justify-between items-center text-[10px] text-gray-400">
                                            <span>{new Date(chat.last_message_at).toLocaleTimeString([], {timeStyle: 'short'})}</span>
                                            <span className="bg-gray-100 px-2 rounded">{chat.channel || 'Web'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Assigned Chats List */}
                        <div>
                            <div
                                className="bg-gray-100 text-gray-500 text-[11px] font-bold px-4 py-2 uppercase tracking-wide sticky top-0 z-10">
                                My Active Chats
                            </div>
                            {assigned.map((chat) => (
                                <div
                                    key={chat.chat_id}
                                    onClick={() => selectChat(chat.chat_id)}
                                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition relative
                                        ${selectedChatId === chat.chat_id ? 'bg-[#F0F2F5]' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3 overflow-hidden">
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                                <UserIcon/>
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">{chat.chat_id}</h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    View conversation
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span
                                                className={`text-[10px] ${chat.unread_count > 0 ? 'text-[#DB2727] font-bold' : 'text-gray-400'}`}>
                                                {new Date(chat.last_message_at).toLocaleTimeString([], {timeStyle: 'short'})}
                                            </span>
                                            {chat.unread_count > 0 && (
                                                <span
                                                    className="bg-[#DB2727] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full">
                                                    {chat.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- RIGHT SIDE (Chat Area) --- */}
                <main className="flex-1 flex flex-col relative bg-[#EFE7DD] bg-opacity-40">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                         style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}></div>

                    {selectedChatId ? (
                        <>
                            {/* Chat Header */}
                            <header
                                className="h-16 bg-[#F0F2F5] px-6 flex items-center justify-between border-b border-gray-300 z-10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                        <UserIcon/>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800 text-sm">Guest Customer</h3>
                                        <p className="text-[10px] text-gray-500">{selectedChatId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => closeChat(selectedChatId)}
                                    className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded border border-transparent hover:border-red-200 text-xs font-medium transition"
                                >
                                    End Chat
                                </button>
                            </header>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-3 z-10 custom-scrollbar">
                                {messages.map((msg: any) => {
                                    const isAgent = msg.sender === "agent";
                                    return (
                                        <div key={msg.id}
                                             className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`
                                                    max-w-[65%] rounded-lg px-3 py-2 text-sm shadow-sm relative
                                                    ${isAgent ? "bg-[#DB2727] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}
                                                `}
                                            >
                                                <p className="mb-1 leading-relaxed text-[13px]">{msg.message}</p>
                                                <div
                                                    className={`text-[9px] flex items-center justify-end gap-1 ${isAgent ? "text-red-100" : "text-gray-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {timeStyle: "short"})}
                                                    {/*{isAgent && msg.viewed_by_customer && <DoubleCheck/>}*/}
                                                    {isAgent && <DoubleCheck/>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {isCustomerTyping && (
                                    <div className="flex justify-start animate-fadeIn">
                                        <div
                                            className="bg-white px-4 py-2.5 rounded-full rounded-tl-none shadow-sm flex space-x-1 items-center">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div
                                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef}/>
                            </div>

                            {/* Input Footer */}
                            <footer className="bg-[#F0F2F5] px-4 py-3 z-10">
                                <form onSubmit={handleSend} className="flex items-center gap-2">
                                    <button type="button"
                                            className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                                        <AttachIcon/>
                                    </button>
                                    <div
                                        className="flex-1 bg-white rounded-lg overflow-hidden flex items-center border border-gray-300 focus-within:ring-1 focus-within:ring-red-500 transition-shadow">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 outline-none text-gray-700 text-sm"
                                            placeholder="Type a message"
                                            value={inputText}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`p-2.5 rounded-full shadow-md transition transform active:scale-95 ${inputText.trim() ? 'bg-[#DB2727] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                        disabled={!inputText.trim()}
                                    >
                                        <SendIcon/>
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        /* Empty State */
                        <div
                            className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] border-b-[6px] border-[#DB2727] z-10">
                            <div className="w-40 h-40 relative mb-4 opacity-60">
                                <Image src="/agent.png" width={98} height={98}
                                       className="grayscale w-full h-full object-contain" alt="Welcome"/>
                            </div>
                            <h2 className="text-2xl font-light text-gray-600 mb-2">Agent Workspace</h2>
                            <p className="text-gray-400 text-sm">Select a conversation to start messaging</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ChatDashboard;
