/* eslint-disable @typescript-eslint/no-explicit-any */

import {useEffect, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useMutation, useQuery} from "@tanstack/react-query";
import {ChatService} from "@/services/chatService";

export function useCustomerChat() {
    const socketRef = useRef<Socket | null>(null);

    const [chatId, setChatId] = useState<string | null>(
        typeof window !== "undefined" ? localStorage.getItem("chat_id") : null
    );

    const [messages, setMessages] = useState<any[]>([]);
    const [typing, setTyping] = useState(false);
    const [showRating, setShowRating] = useState(false);


    const startChatMutation = useMutation({
        mutationFn: () => ChatService.startChat("en", "Web"),
        onSuccess: (data) => {
            setChatId(data.chat_id);
            localStorage.setItem("chat_id", data.chat_id);
        },
    });

    // fetch messages
    const messagesQuery = useQuery({
        queryKey: ["chat-messages", chatId],
        queryFn: () => ChatService.getMessages(chatId!),
        enabled: !!chatId,
    });


    // socket connection
    useEffect(() => {
        if (!chatId) return;

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            transports: ["websocket"],
            query: {role: "customer", chat_id: chatId}
        });

        socketRef.current = socket;

        socket.on("message.new", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stop_typing", () => {
            setTyping(false);
        });

        socket.on("chat.closed", () => setShowRating(true));

        return () => {
            socket.disconnect()
        };
    }, [chatId]);


    useEffect(() => {
        if (messagesQuery.data) setMessages(messagesQuery.data);
    }, [messagesQuery.data]);


    const sendMessage = (text: string) => {
        socketRef.current?.emit("message.customer", {chat_id: chatId, text});
    };


    const askForAgent = () => {
        socketRef.current?.emit("request.agent", {chat_id: chatId, priority: 0});
    };

    const closeSession = () => {
        socketRef.current?.emit("chat.close", {chat_id: chatId});
    };

    const submitRating = async (rating: number, message?: string) => {
        if (!chatId) return;
        await ChatService.rateAgent(chatId, rating, message);
        setShowRating(false);
        localStorage.removeItem("chat_id");
        setChatId(null);
        setMessages([]);
    };

    return {
        chatId,
        startChatMutation,
        messages,
        sendMessage,
        askForAgent,
        typing,
        closeSession,
        showRating,
        submitRating,
    };
}
