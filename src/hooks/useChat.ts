import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {ChatService} from "@/services/chatService";

// GENERAL CHATS LIST
export function useQueue() {
    return useQuery({
        queryKey: ["chat_queue"],
        queryFn: ChatService.getQueue,
    });
}

// AGENT'S ASSIGNED CHATS
export function useAssignedChats(userId: number) {
    return useQuery({
        queryKey: ["assigned_chats", userId],
        queryFn: () => ChatService.getAssigned(userId),
        enabled: !!userId,
    });
}

// CHAT MESSAGES
export function useChatMessages(chatId: string | null) {
    return useQuery({
        queryKey: ["chat_messages", chatId],
        queryFn: () => ChatService.getMessages(String(chatId)),
        enabled: !!chatId,
        refetchInterval: 2000, // optional polling if you want fallback
    });
}

// START CHAT
// export function useStartChat() {
//     return useMutation({
//         mutationFn: ChatService.startChat,
//     });
// }

// REQUEST AGENT
export function useRequestAgent() {
    return useMutation({
        mutationFn: ({ chat_id, priority }: { chat_id: string; priority: number }) =>
            ChatService.requestAgent(chat_id, priority),
    });
}

// ASSIGN CHAT
export function useAssignChat() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ chat_id, user_id }: { chat_id: string; user_id: number }) =>
            ChatService.assignChat(chat_id, user_id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["assigned_chats"] });
            qc.invalidateQueries({ queryKey: ["chat_queue"] });
        },
    });
}

// CLOSE CHAT
export function useCloseChat() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (chat_id: string) => ChatService.closeChat(chat_id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["assigned_chats"] });
            qc.invalidateQueries({ queryKey: ["chat_queue"] });
        },
    });
}
