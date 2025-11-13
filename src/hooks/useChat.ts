/* eslint-disable @typescript-eslint/no-explicit-any */


// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {ChatService} from "@/services/chatService";
//
// // GENERAL CHATS LIST
// export function useQueue() {
//     return useQuery({
//         queryKey: ["chat_queue"],
//         queryFn: ChatService.getQueue,
//     });
// }
//
// // AGENT'S ASSIGNED CHATS
// export function useAssignedChats(userId: number) {
//     return useQuery({
//         queryKey: ["assigned_chats", userId],
//         queryFn: () => ChatService.getAssigned(userId),
//         enabled: !!userId,
//     });
// }
//
// // CHAT MESSAGES
// export function useChatMessages(chatId: string | null) {
//     return useQuery({
//         queryKey: ["chat_messages", chatId],
//         queryFn: () => ChatService.getMessages(String(chatId)),
//         enabled: !!chatId,
//         refetchInterval: 2000, // optional polling if you want fallback
//     });
// }
//
// // START CHAT
// // export function useStartChat() {
// //     return useMutation({
// //         mutationFn: ChatService.startChat,
// //     });
// // }
//
// // REQUEST AGENT
// export function useRequestAgent() {
//     return useMutation({
//         mutationFn: ({ chat_id, priority }: { chat_id: string; priority: number }) =>
//             ChatService.requestAgent(chat_id, priority),
//     });
// }
//
// // ASSIGN CHAT
// export function useAssignChat() {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: ({ chat_id, user_id }: { chat_id: string; user_id: number }) =>
//             ChatService.assignChat(chat_id, user_id),
//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["assigned_chats"] });
//             qc.invalidateQueries({ queryKey: ["chat_queue"] });
//         },
//     });
// }
//
// // CLOSE CHAT
// export function useCloseChat() {
//     const qc = useQueryClient();
//     return useMutation({
//         mutationFn: (chat_id: string) => ChatService.closeChat(chat_id),
//         onSuccess: () => {
//             qc.invalidateQueries({ queryKey: ["assigned_chats"] });
//             qc.invalidateQueries({ queryKey: ["chat_queue"] });
//         },
//     });
// }

// import {useEffect, useRef, useState} from "react";
// import {io, Socket} from "socket.io-client";
// import {ChatService} from "@/services/chatService";
//
// export function useAgentChat(agentId: number) {
//     const socketRef = useRef<Socket | null>(null);
//
//     const [queue, setQueue] = useState<any[]>([]);
//     const [assigned, setAssigned] = useState<any[]>([]);
//     const [messages, setMessages] = useState<any[]>([]);
//     const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//
//     useEffect(() => {
//         if (!agentId) return;
//
//         const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
//             // path: "/node/socket.io/",
//             transports: ["websocket"],
//             query: {role: "agent", user_id: agentId}
//
//         });
//
//         socketRef.current = socket;
//
//         socket.on("message.new", (msg) => {
//             if (msg.chat_id === selectedChatId) {
//                 setMessages((prev) => [...prev, msg]);
//             }
//         });
//
//         // socket.on("message.new", (msg) => {
//         //     if (msg.chat_id === selectedChatId) {
//         //         setMessages((prev) => [...prev, msg]);
//         //     }
//         // });
//
//         socket.on("queue.updated", async () => {
//             const q = await ChatService.getQueue();
//             setQueue(q);
//         });
//
//
//         socket.on("chat.assigned", async () => {
//             const a = await ChatService.getAssigned(agentId);
//             setAssigned(a);
//         });
//
//         socket.on("agent.joined", async ({agent_id, chat_id}) => {
//             if (agent_id === agentId) {
//                 const msgs = await ChatService.getMessages(chat_id);
//                 setMessages(msgs);
//             }
//         });
//
//         socket.on("chat.closed", async () => {
//             const a = await ChatService.getAssigned(agentId);
//             setAssigned(a);
//         });
//
//         ChatService.getQueue().then(setQueue);
//         ChatService.getAssigned(agentId).then(setAssigned);
//
//         return () => {
//             socket.disconnect();
//         };
//     }, [agentId, selectedChatId]);
//
//     // const acceptChat = (chat_id: string) => {
//     //     socketRef.current?.emit("agent.accept", {chat_id, user_id: agentId});
//     // };
//
//     const acceptChat = (chat_id: string) => {
//         socketRef.current?.emit("agent.accept", { chat_id, user_id: agentId });
//
//         socketRef.current?.emit("join.chat", { chat_id });
//         setSelectedChatId(chat_id);
//     };
//
//     const sendMessage = (chat_id: string, text: string) => {
//         socketRef.current?.emit("message.agent", {chat_id, text, user_id: agentId});
//     };
//
//     const closeChat = (chat_id: string) => {
//         socketRef.current?.emit("chat.close", {chat_id});
//         setSelectedChatId(null);
//         setMessages([]);
//     };
//
//     const selectChat = async (chat_id: string) => {
//         setSelectedChatId(chat_id);
//         const msgs = await ChatService.getMessages(chat_id);
//         setMessages(msgs);
//
//         socketRef.current?.emit("join.chat", { chat_id });
//     };
//
//     return {
//         queue,
//         assigned,
//         selectedChatId,
//         selectChat,
//         messages,
//         acceptChat,
//         sendMessage,
//         closeChat
//     };
//
// }

// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import { ChatService } from "@/services/chatService";
//
// export function useAgentChat(agentId: number) {
//     const socketRef = useRef<Socket | null>(null);
//
//     const [queue, setQueue] = useState<any[]>([]);
//     const [assigned, setAssigned] = useState<any[]>([]);
//     const [messages, setMessages] = useState<any[]>([]);
//     const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//     const [isCustomerTyping, setIsCustomerTyping] = useState(false);
//
//     // 1. Initialize Socket Connection (Runs once when agentId is available)
//     useEffect(() => {
//         if (!agentId) return;
//
//         // Connect
//         const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
//             transports: ["websocket"],
//             query: { role: "agent", user_id: agentId },
//         });
//         socketRef.current = socket;
//
//         // --- Global Listeners (Queue & Assignments) ---
//
//         // Update Queue when a customer joins/leaves
//         socket.on("queue.updated", fetchQueue);
//
//         // Update Assigned list when chat status changes
//         socket.on("chat.assigned", fetchAssigned);
//         socket.on("chat.closed", fetchAssigned);
//
//         // Handle incoming messages (Global handler)
//         socket.on("message.new", (msg) => {
//             // If the message belongs to the currently open chat, append it
//             // We use a functional state update to access the *current* selectedChatId value inside the listener
//             setSelectedChatId((currentSelectedId) => {
//                 if (msg.chat_id === currentSelectedId) {
//                     setMessages((prev) => [...prev, msg]);
//                     // clear typing indicator on new message
//                     setIsCustomerTyping(false);
//                 }
//                 return currentSelectedId;
//             });
//
//             // Always refresh the assigned list to show the latest message snippet/time in the sidebar
//             fetchAssigned();
//         });
//
//         // Typing Indicators
//         socket.on("typing", ({ by }) => {
//             if (by === 'customer') setIsCustomerTyping(true);
//         });
//
//         socket.on("stop_typing", ({ by }) => {
//             if (by === 'customer') setIsCustomerTyping(false);
//         });
//
//         // Initial Data Fetch
//         fetchQueue();
//         fetchAssigned();
//
//         return () => {
//             socket.disconnect();
//         };
//     }, [agentId]);
//
//     // 2. Helper Functions
//     const fetchQueue = async () => {
//         const q = await ChatService.getQueue();
//         setQueue(q);
//     };
//
//     const fetchAssigned = async () => {
//         const a = await ChatService.getAssigned(agentId);
//         setAssigned(a);
//     };
//
//     // 3. User Actions
//     const selectChat = async (chat_id: string) => {
//         if (selectedChatId === chat_id) return;
//
//         setSelectedChatId(chat_id);
//         setMessages([]); // Clear previous messages immediately
//         setIsCustomerTyping(false);
//
//         try {
//             // Join the specific socket room for this chat
//             socketRef.current?.emit("join.chat", { chat_id });
//
//             // Fetch history
//             const msgs = await ChatService.getMessages(chat_id);
//             setMessages(msgs);
//         } catch (error) {
//             console.error("Failed to load chat", error);
//         }
//     };
//
//     const acceptChat = (chat_id: string) => {
//         socketRef.current?.emit("agent.accept", { chat_id, user_id: agentId });
//         // The socket event 'chat.assigned' will trigger, updating the lists automatically
//         // We can optionally select it immediately:
//         selectChat(chat_id);
//     };
//
//     const sendMessage = (text: string) => {
//         if (!selectedChatId) return;
//         socketRef.current?.emit("message.agent", { chat_id: selectedChatId, text, user_id: agentId });
//         // Note: The backend should emit 'message.new' back to us, which our listener will catch and append.
//     };
//
//     const closeChat = (chat_id: string) => {
//         socketRef.current?.emit("chat.close", { chat_id });
//         setSelectedChatId(null);
//         setMessages([]);
//     };
//
//     // Typing emitters
//     const sendTyping = () => {
//         if(selectedChatId) socketRef.current?.emit("typing", { chat_id: selectedChatId, by: 'agent' });
//     };
//
//     const sendStopTyping = () => {
//         if(selectedChatId) socketRef.current?.emit("stop_typing", { chat_id: selectedChatId, by: 'agent' });
//     };
//
//     return {
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
//     };
// }


import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatService } from "@/services/chatService";

export function useAgentChat(agentId: number) {
    const socketRef = useRef<Socket | null>(null);

    // We use a Ref for the selected ID so the socket listener
    // can read the current value without stale closures
    const selectedChatIdRef = useRef<string | null>(null);

    const [queue, setQueue] = useState<any[]>([]);
    const [assigned, setAssigned] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [isCustomerTyping, setIsCustomerTyping] = useState(false);

    // Update the Ref whenever state changes
    useEffect(() => {
        selectedChatIdRef.current = selectedChatId;
    }, [selectedChatId]);

    // Initialize Socket Connection
    useEffect(() => {
        if (!agentId) return;

        // Connect
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            transports: ["websocket"],
            query: { role: "agent", user_id: agentId },
        });
        socketRef.current = socket;

        // --- Listeners ---

        socket.on("queue.updated", fetchQueue);

        // Refresh assigned list when status changes
        socket.on("chat.assigned", fetchAssigned);
        socket.on("chat.closed", fetchAssigned);

        // Handle incoming messages
        socket.on("message.new", (msg) => {
            // Check if the incoming message belongs to the currently open chat
            if (selectedChatIdRef.current === msg.chat_id) {
                setMessages((prev) => {
                    // FIXED: Prevent Duplicates
                    // If message ID already exists, do not add it again
                    if (prev.some((m) => m.id === msg.id)) {
                        return prev;
                    }
                    return [...prev, msg];
                });

                // Clear typing indicator when a new message arrives
                setIsCustomerTyping(false);
            }

            // Always refresh assigned list to show new time/preview in sidebar
            fetchAssigned();
        });

        socket.on("typing", ({ by, chat_id }) => {
            if (by === 'customer' && chat_id === selectedChatIdRef.current) {
                setIsCustomerTyping(true);
            }
        });

        socket.on("stop_typing", ({ by, chat_id }) => {
            if (by === 'customer' && chat_id === selectedChatIdRef.current) {
                setIsCustomerTyping(false);
            }
        });

        // Initial Data Fetch
        fetchQueue();
        fetchAssigned();

        return () => {
            socket.disconnect();
        };
    }, [agentId]);

    // --- Helper Functions ---
    const fetchQueue = async () => {
        const q = await ChatService.getQueue();
        setQueue(q);
    };

    const fetchAssigned = async () => {
        const a = await ChatService.getAssigned(agentId);
        setAssigned(a);
    };

    // --- Actions ---
    const selectChat = async (chat_id: string) => {
        if (selectedChatId === chat_id) return;

        setSelectedChatId(chat_id); // Updates state
        // Ref will update via the useEffect above

        setMessages([]);
        setIsCustomerTyping(false);

        try {
            socketRef.current?.emit("join.chat", { chat_id });
            const msgs = await ChatService.getMessages(chat_id);
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to load chat", error);
        }
    };

    const acceptChat = (chat_id: string) => {
        socketRef.current?.emit("agent.accept", { chat_id, user_id: agentId });
        selectChat(chat_id);
    };

    const sendMessage = (text: string) => {
        if (!selectedChatId) return;
        // We do NOT manually add the message to 'messages' state here.
        // We wait for the server to emit 'message.new' to ensure consistency.
        socketRef.current?.emit("message.agent", { chat_id: selectedChatId, text, user_id: agentId });
    };

    const closeChat = (chat_id: string) => {
        socketRef.current?.emit("chat.close", { chat_id });
        setSelectedChatId(null);
        setMessages([]);
    };

    const sendTyping = () => {
        if(selectedChatId) socketRef.current?.emit("typing", { chat_id: selectedChatId, by: 'agent' });
    };

    const sendStopTyping = () => {
        if(selectedChatId) socketRef.current?.emit("stop_typing", { chat_id: selectedChatId, by: 'agent' });
    };

    return {
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
    };
}