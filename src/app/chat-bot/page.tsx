/* eslint-disable @typescript-eslint/no-explicit-any */

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


"use client"
import React, {useState, useEffect, useRef} from "react";
import {useAgentChat} from "@/hooks/useChat";
import Image from "next/image";
import {useCurrentUser} from "@/utils/auth";
import {ChatService} from "@/services/chatService";


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

// const DocumentIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-red-500"
//          viewBox="0 0 16 16">
//         <path
//             d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
//     </svg>
// );

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"
         stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
    </svg>
);

// const DocumentIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-red-500" viewBox="0 0 16 16">
//         <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
//     </svg>
// );

const ImageLightbox = ({src, onClose}: { src: string, onClose: () => void }) => {
    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4 animate-fadeIn">
            <button onClick={onClose}
                    className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition">
                <CloseIcon/>
            </button>
            <img src={src} alt="Full Preview" className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"/>
            <a
                href={src}
                download
                target="_blank"
                className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
                Download Original
            </a>
        </div>
    );
};


const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
        }
        return part;
    });
};

// Updated Component to handle both Text and Attachments
const ChatMessageContent = ({msg}: { msg: any }) => {
    const {message, attachment_url, attachment_type, file_name} = msg;

    return (
        <div className="flex flex-col gap-1">
            {/* Attachment Rendering */}
            {attachment_type === 'image' && attachment_url && (
                <div
                    className="mb-1 relative w-full max-w-[200px] h-auto rounded-lg overflow-hidden border border-gray-200">
                    <img
                        src={process.env.NEXT_PUBLIC_API_URL + attachment_url}
                        alt="attachment"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            {attachment_type === 'document' && attachment_url && (
                <a
                    href={process.env.NEXT_PUBLIC_API_URL + attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition mb-1 no-underline"
                >
                    <div className="w-8 h-8 bg-red-100 text-red-500 rounded flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             viewBox="0 0 16 16">
                            <path
                                d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span
                            className="text-xs font-medium truncate max-w-[150px] text-gray-700">{file_name || "Document"}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Download</span>
                    </div>
                </a>
            )}

            {/* Text Rendering */}
            {message && (
                <div className="whitespace-pre-wrap">
                    {renderBold(message)}
                </div>
            )}
        </div>
    );
};


const ChatDashboard: React.FC = () => {

    const user = useCurrentUser();

    const agentId = Number(user?.id || 1);

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
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedChatId) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Max size is 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload
            const data = await ChatService.uploadFile(file);

            // 2. Determine Type
            const type = file.type.startsWith("image/") ? "image" : "document";

            // 3. Send Message with Attachment
            // Note: Ensure your useAgentChat 'sendMessage' accepts this second argument
            sendMessage("", {
                url: data.url,
                type: type,
                name: data.filename
            });

        } catch (error) {
            console.error("Agent Upload Error:", error);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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
            {lightboxUrl && <ImageLightbox src={lightboxUrl} onClose={() => setLightboxUrl(null)}/>}

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

                <main className="flex-1 flex flex-col relative bg-[#EFE7DD] bg-opacity-40">
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

                            <div className="flex-1 overflow-y-auto p-6 space-y-3 z-10 custom-scrollbar">
                                {messages.map((msg: any, index: number) => {

                                    if (index > 0 && messages[index - 1].id === msg.id) return null;

                                    const isAgent = msg.sender === "agent";
                                    return (
                                        <div key={msg.id}
                                             className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`
                                                    max-w-[65%] rounded-lg px-3 py-2 text-sm shadow-sm relative
                                                    ${isAgent ? "bg-[#DB2727] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}
                                                `}
                                                style={{
                                                    wordBreak: "normal",
                                                    overflowWrap: "anywhere",
                                                    maxWidth: "100%"
                                                }}
                                            >

                                                {/*{msg.attachment_type === 'image' && msg.attachment_url && (*/}
                                                {/*    <div className="mb-2 mt-1">*/}
                                                {/*        /!* Using standard img for remote/dynamic URLs *!/*/}
                                                {/*        <img*/}
                                                {/*            src={msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_URL}${msg.attachment_url}`}*/}
                                                {/*            alt="attachment"*/}
                                                {/*            className="rounded-lg max-h-[250px] w-auto object-cover cursor-pointer hover:opacity-95"*/}
                                                {/*            onClick={() => window.open(msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_URL}${msg.attachment_url}`, '_blank')}*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*)}*/}

                                                {/*{msg.attachment_type === 'document' && msg.attachment_url && (*/}
                                                {/*    <a*/}
                                                {/*        href={msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_URL}${msg.attachment_url}`}*/}
                                                {/*        target="_blank" rel="noreferrer"*/}
                                                {/*        className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition no-underline*/}
                                                {/*            ${isAgent ? 'bg-red-800 bg-opacity-20 hover:bg-opacity-30' : 'bg-gray-100 hover:bg-gray-200'}*/}
                                                {/*        `}*/}
                                                {/*    >*/}
                                                {/*        <div className="p-2 bg-white rounded-full shadow-sm text-red-500">*/}
                                                {/*            <DocumentIcon />*/}
                                                {/*        </div>*/}
                                                {/*        <div className="flex flex-col overflow-hidden">*/}
                                                {/*            <span className={`text-xs font-medium truncate max-w-[150px] ${isAgent ? 'text-white' : 'text-gray-700'}`}>*/}
                                                {/*                {msg.file_name || "Document"}*/}
                                                {/*            </span>*/}
                                                {/*            <span className={`text-[9px] uppercase ${isAgent ? 'text-red-100' : 'text-gray-500'}`}>*/}
                                                {/*                Click to download*/}
                                                {/*            </span>*/}
                                                {/*        </div>*/}
                                                {/*    </a>*/}
                                                {/*)}*/}

                                                <ChatMessageContent msg={msg}/>


                                                {/*<p className="mb-1 leading-relaxed text-[13px]">{msg.message}</p>*/}

                                                {msg.message &&
                                                    <p className="mb-1 leading-relaxed text-[13px] whitespace-pre-wrap">{msg.message}</p>}

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

                            <footer className="bg-[#F0F2F5] px-4 py-3 z-10">
                                <form onSubmit={handleSend} className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{display: 'none'}}
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleAttachClick}
                                        disabled={isUploading}
                                        className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500 relative"
                                        title="Attach File"
                                    >
                                        {isUploading ? (
                                            <div
                                                className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                                        ) : (
                                            <AttachIcon/>
                                        )}
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
                                        className={`p-2.5 rounded-full shadow-md transition transform active:scale-95 
                                            ${(inputText.trim() || isUploading) ? 'bg-[#DB2727] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                        disabled={(!inputText.trim() && !isUploading)}
                                    >
                                        <SendIcon/>
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
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
