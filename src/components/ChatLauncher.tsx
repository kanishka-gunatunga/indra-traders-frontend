/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, {useState} from "react";
import {useCustomerChat} from "@/hooks/useCustomerChat";
import Image from "next/image";

export default function ChatLauncher() {
    const [open, setOpen] = useState(false);
    const {
        chatId,
        startChatMutation,
        messages,
        sendMessage,
        askForAgent,
        typing,
    } = useCustomerChat();

    const [input, setInput] = useState("");

    const handleOpen = () => {
        setOpen(true);
        if (!chatId) startChatMutation.mutate();
    };

    const handleSend = (e: any) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <>
            {!open && (
                <button
                    onClick={handleOpen}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#db2727",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 9999
                    }}
                >
                    <Image src="/agent.png" alt="" width={20} height={20} className="w-10 h-10 m-auto"/>
                </button>
            )}

            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "360px",
                        height: "520px",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                        zIndex: 99999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            background: "#db2727",
                            color: "#fff",
                            padding: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        Indra Assistant
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "18px",
                                cursor: "pointer"
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            padding: "10px",
                            overflowY: "auto",
                            fontSize: "14px",
                            overflowX: "hidden"
                        }}
                    >
                        {messages.length === 0 && (
                            <p style={{color: "#db2727"}}>
                                Hello! How can I help you?
                            </p>
                        )}

                        {messages.map((m: any, i: number) => (
                            <div
                                key={i}
                                style={{
                                    textAlign: m.sender === "customer" ? "right" : "left",
                                    marginBottom: "10px"
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "8px 12px",
                                        background:
                                            m.sender === "customer" ? "#c1b55e" : "#F1EDED",
                                        borderRadius: "6px",
                                        maxWidth: "260px"
                                    }}
                                >
                                    {m.message}
                                    <span className="block text-xs text-[#7C7C7C] text-right mt-1">
                                        {new Date(m.createdAt).toLocaleTimeString([], {timeStyle: 'short'})}
                                    </span>
                                </span>
                            </div>
                        ))}

                        {typing && (
                            <p style={{color: "#db2727", opacity: 0.7}}>Agent typing...</p>
                        )}
                    </div>

                    <button
                        onClick={() => askForAgent()}
                        style={{
                            background: "#db2727",
                            color: "#fff",
                            padding: "10px",
                            margin: "10px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Talk to a Live Agent
                    </button>

                    <form
                        onSubmit={handleSend}
                        style={{
                            padding: "10px",
                            borderTop: "1px solid #ddd",
                            display: "flex",
                            gap: "5px"
                        }}
                    >

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                padding: "8px"
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                background: "#db2727",
                                color: "#fff",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
