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

import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {ChatService} from "@/services/chatService";

export function useAgentChat(agentId: number) {
    const socketRef = useRef<Socket | null>(null);

    const [queue, setQueue] = useState<any[]>([]);
    const [assigned, setAssigned] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        if (!agentId) return;

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            transports: ["websocket"],
            query: {role: "agent", user_id: agentId}
        });

        socketRef.current = socket;

        socket.on("message.new", (msg) => {
            if (msg.chat_id === selectedChatId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // socket.on("message.new", (msg) => {
        //     if (msg.chat_id === selectedChatId) {
        //         setMessages((prev) => [...prev, msg]);
        //     }
        // });

        socket.on("queue.updated", async () => {
            const q = await ChatService.getQueue();
            setQueue(q);
        });


        socket.on("chat.assigned", async () => {
            const a = await ChatService.getAssigned(agentId);
            setAssigned(a);
        });

        socket.on("agent.joined", async ({agent_id, chat_id}) => {
            if (agent_id === agentId) {
                const msgs = await ChatService.getMessages(chat_id);
                setMessages(msgs);
            }
        });

        socket.on("chat.closed", async () => {
            const a = await ChatService.getAssigned(agentId);
            setAssigned(a);
        });

        ChatService.getQueue().then(setQueue);
        ChatService.getAssigned(agentId).then(setAssigned);

        return () => {
            socket.disconnect();
        };
    }, [agentId, selectedChatId]);

    // const acceptChat = (chat_id: string) => {
    //     socketRef.current?.emit("agent.accept", {chat_id, user_id: agentId});
    // };

    const acceptChat = (chat_id: string) => {
        socketRef.current?.emit("agent.accept", { chat_id, user_id: agentId });

        socketRef.current?.emit("join.chat", { chat_id });
        setSelectedChatId(chat_id);
    };

    const sendMessage = (chat_id: string, text: string) => {
        socketRef.current?.emit("message.agent", {chat_id, text, user_id: agentId});
    };

    const closeChat = (chat_id: string) => {
        socketRef.current?.emit("chat.close", {chat_id});
        setSelectedChatId(null);
        setMessages([]);
    };

    const selectChat = async (chat_id: string) => {
        setSelectedChatId(chat_id);
        const msgs = await ChatService.getMessages(chat_id);
        setMessages(msgs);

        socketRef.current?.emit("join.chat", { chat_id });
    };

    return {
        queue,
        assigned,
        selectedChatId,
        selectChat,
        messages,
        acceptChat,
        sendMessage,
        closeChat
    };

}