/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

// import React, {useState} from "react";
// import {useCustomerChat} from "@/hooks/useCustomerChat";
// import Image from "next/image";
//
// export default function ChatLauncher() {
//     const [open, setOpen] = useState(false);
//     const {
//         chatId,
//         startChatMutation,
//         messages,
//         sendMessage,
//         askForAgent,
//         typing,
//     } = useCustomerChat();
//
//     const [input, setInput] = useState("");
//
//     const handleOpen = () => {
//         setOpen(true);
//         if (!chatId) startChatMutation.mutate();
//     };
//
//     const handleSend = (e: any) => {
//         e.preventDefault();
//         if (!input.trim()) return;
//         sendMessage(input);
//         setInput("");
//     };
//
//     return (
//         <>
//             {!open && (
//                 <button
//                     onClick={handleOpen}
//                     style={{
//                         position: "fixed",
//                         bottom: "20px",
//                         right: "20px",
//                         width: "60px",
//                         height: "60px",
//                         borderRadius: "50%",
//                         backgroundColor: "#db2727",
//                         color: "#fff",
//                         border: "none",
//                         cursor: "pointer",
//                         zIndex: 9999
//                     }}
//                 >
//                     <Image src="/agent.png" alt="" width={20} height={20} className="w-10 h-10 m-auto"/>
//                 </button>
//             )}
//
//             {open && (
//                 <div
//                     style={{
//                         position: "fixed",
//                         bottom: "20px",
//                         right: "20px",
//                         width: "360px",
//                         height: "520px",
//                         background: "#fff",
//                         borderRadius: "12px",
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                         zIndex: 99999,
//                         display: "flex",
//                         flexDirection: "column",
//                         overflow: "hidden"
//                     }}
//                 >
//                     <div
//                         style={{
//                             background: "#db2727",
//                             color: "#fff",
//                             padding: "12px",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center"
//                         }}
//                     >
//                         Indra Assistant
//                         <button
//                             onClick={() => setOpen(false)}
//                             style={{
//                                 background: "transparent",
//                                 border: "none",
//                                 color: "#fff",
//                                 fontSize: "18px",
//                                 cursor: "pointer"
//                             }}
//                         >
//                             ×
//                         </button>
//                     </div>
//
//                     <div
//                         style={{
//                             flex: 1,
//                             padding: "10px",
//                             overflowY: "auto",
//                             fontSize: "14px",
//                             overflowX: "hidden"
//                         }}
//                     >
//                         {messages.length === 0 && (
//                             <p style={{color: "#db2727"}}>
//                                 Hello! How can I help you?
//                             </p>
//                         )}
//
//                         {messages.map((m: any, i: number) => (
//                             <div
//                                 key={i}
//                                 style={{
//                                     textAlign: m.sender === "customer" ? "right" : "left",
//                                     marginBottom: "10px"
//                                 }}
//                             >
//                                 <span
//                                     style={{
//                                         display: "inline-block",
//                                         padding: "8px 12px",
//                                         background:
//                                             m.sender === "customer" ? "#c1b55e" : "#F1EDED",
//                                         borderRadius: "6px",
//                                         maxWidth: "260px"
//                                     }}
//                                 >
//                                     {m.message}
//                                     <span className="block text-xs text-[#7C7C7C] text-right mt-1">
//                                         {new Date(m.createdAt).toLocaleTimeString([], {timeStyle: 'short'})}
//                                     </span>
//                                 </span>
//                             </div>
//                         ))}
//
//                         {typing && (
//                             <p style={{color: "#db2727", opacity: 0.7}}>Agent typing...</p>
//                         )}
//                     </div>
//
//                     <button
//                         onClick={() => askForAgent()}
//                         style={{
//                             background: "#db2727",
//                             color: "#fff",
//                             padding: "10px",
//                             margin: "10px",
//                             borderRadius: "8px",
//                             border: "none",
//                             cursor: "pointer",
//                             fontWeight: "bold"
//                         }}
//                     >
//                         Talk to a Live Agent
//                     </button>
//
//                     <form
//                         onSubmit={handleSend}
//                         style={{
//                             padding: "10px",
//                             borderTop: "1px solid #ddd",
//                             display: "flex",
//                             gap: "5px"
//                         }}
//                     >
//
//                         <input
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             type="text"
//                             placeholder="Type a message..."
//                             style={{
//                                 flex: 1,
//                                 borderRadius: "8px",
//                                 border: "1px solid #ccc",
//                                 padding: "8px"
//                             }}
//                         />
//
//                         <button
//                             type="submit"
//                             style={{
//                                 background: "#db2727",
//                                 color: "#fff",
//                                 padding: "8px 14px",
//                                 borderRadius: "8px",
//                                 border: "none",
//                                 cursor: "pointer"
//                             }}
//                         >
//                             Send
//                         </button>
//                     </form>
//                 </div>
//             )}
//         </>
//     );
// }

// import React, { useState, useRef, useEffect } from "react";
// import { useCustomerChat } from "@/hooks/useCustomerChat";
// import Image from "next/image";
//
// // Simple SVG Icons to avoid installing specific icon libraries
// const CloseIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
//         <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
//     </svg>
// );
//
// const SendIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
//         <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
//     </svg>
// );
//
// export default function ChatLauncher() {
//     const [open, setOpen] = useState(false);
//     const {
//         chatId,
//         startChatMutation,
//         messages,
//         sendMessage,
//         askForAgent,
//         typing,
//     } = useCustomerChat();
//
//     const [input, setInput] = useState("");
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//
//     // Auto-scroll to bottom when messages change
//     useEffect(() => {
//         if (open && messagesEndRef.current) {
//             messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [messages, open, typing]);
//
//     const handleOpen = () => {
//         setOpen(true);
//         if (!chatId) startChatMutation.mutate();
//     };
//
//     const handleSend = (e: any) => {
//         e.preventDefault();
//         if (!input.trim()) return;
//         sendMessage(input);
//         setInput("");
//     };
//
//     return (
//         <div style={{ fontFamily: '"Poppins", sans-serif' }}>
//             {/* Launcher Button */}
//             {!open && (
//                 <button
//                     onClick={handleOpen}
//                     style={styles.launcherButton}
//                 >
//                     {/* Assuming you have agent.png in public folder */}
//                     <Image src="/agent.png" alt="Chat" width={30} height={30} style={{ margin: 'auto' }} />
//                     <span style={styles.statusBadge}></span>
//                 </button>
//             )}
//
//             {/* Chat Window */}
//             {open && (
//                 <div style={styles.chatWindow}>
//                     {/* Header */}
//                     <div style={styles.header}>
//                         <div style={styles.headerInfo}>
//                             <div style={styles.agentImageContainer}>
//                                 <Image src="/agent.png" alt="Agent" width={45} height={45} />
//                                 <span style={styles.onlineIndicator}></span>
//                             </div>
//                             <div style={styles.headerText}>
//                                 <p style={styles.headerTitle}>Indra Assistant</p>
//                                 <span style={styles.headerSubtitle}>Online</span>
//                             </div>
//                         </div>
//                         <button onClick={() => setOpen(false)} style={styles.closeButton}>
//                             <CloseIcon />
//                         </button>
//                     </div>
//
//                     {/* Messages Body */}
//                     <div style={styles.body}>
//                         {messages.length === 0 && (
//                             <div style={styles.botMessageContainer}>
//                                 <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
//                                 <div style={styles.messageWrapper}>
//                                     <span style={styles.botName}>Indra Assistant</span>
//                                     <div style={styles.botBubble}>
//                                         Hello! Welcome. How can I help you today?
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {messages.map((m: any, i: number) => (
//                             <div key={i} style={{
//                                 display: 'flex',
//                                 flexDirection: m.sender === "customer" ? 'row-reverse' : 'row',
//                                 marginBottom: '15px',
//                                 alignItems: 'flex-end'
//                             }}>
//                                 {/* Bot Avatar (Only show if sender is bot) */}
//                                 {m.sender !== "customer" && (
//                                     <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
//                                 )}
//
//                                 <div style={m.sender === "customer" ? styles.userMessageWrapper : styles.messageWrapper}>
//                                     {/* Bot Name Label */}
//                                     {m.sender !== "customer" && (
//                                         <span style={styles.botName}>Indra Assistant</span>
//                                     )}
//
//                                     {/* The Message Bubble */}
//                                     <div style={m.sender === "customer" ? styles.userBubble : styles.botBubble}>
//                                         {m.message}
//                                         <div style={{
//                                             ...styles.timestamp,
//                                             textAlign: m.sender === "customer" ? 'right' : 'left',
//                                             color: m.sender === "customer" ? '#888' : 'rgba(255,255,255,0.8)'
//                                         }}>
//                                             {new Date(m.createdAt).toLocaleTimeString([], { timeStyle: 'short' })}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//
//                         {typing && (
//                             <div style={styles.botMessageContainer}>
//                                 <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
//                                 <div style={styles.messageWrapper}>
//                                     <div style={{...styles.botBubble, fontStyle: 'italic'}}>
//                                         Typing...
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         <div ref={messagesEndRef} />
//                     </div>
//
//                     {/* Live Agent Request Area */}
//                     <div style={{padding: '0 10px'}}>
//                         <button onClick={() => askForAgent()} style={styles.liveAgentButton}>
//                             Talk to a Live Agent
//                         </button>
//                     </div>
//
//                     {/* Footer / Input */}
//                     <form onSubmit={handleSend} style={styles.footer}>
//                         <input
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             type="text"
//                             placeholder="Write message here..."
//                             style={styles.input}
//                         />
//                         <button type="submit" style={styles.sendButton}>
//                             <SendIcon />
//                         </button>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// // Styles object to mimic the DFCC Bootstrap theme
// const styles: { [key: string]: React.CSSProperties } = {
//     launcherButton: {
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         width: "60px",
//         height: "60px",
//         borderRadius: "50%",
//         backgroundColor: "#fff", // White background like the example agent image
//         border: "2px solid #1C73D4",
//         cursor: "pointer",
//         zIndex: 9999,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
//     },
//     statusBadge: {
//         position: "absolute",
//         bottom: "0",
//         right: "0",
//         width: "14px",
//         height: "14px",
//         backgroundColor: "#05e905",
//         borderRadius: "50%",
//         border: "2px solid #fff"
//     },
//     chatWindow: {
//         position: "fixed",
//         bottom: "10px",
//         right: "10px", // Adjusted for mobile friendliness
//         width: "360px",
//         height: "550px",
//         background: "#fff",
//         borderRadius: "12px",
//         boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
//         zIndex: 99999,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         fontFamily: "'Poppins', sans-serif"
//     },
//     header: {
//         backgroundColor: "#1C73D4",
//         padding: "12px 15px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         borderTopLeftRadius: "12px",
//         borderTopRightRadius: "12px",
//     },
//     headerInfo: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '10px'
//     },
//     agentImageContainer: {
//         position: 'relative',
//         display: 'flex'
//     },
//     onlineIndicator: {
//         position: 'absolute',
//         bottom: '0',
//         right: '0',
//         width: '10px',
//         height: '10px',
//         backgroundColor: '#05e905',
//         borderRadius: '50%',
//         border: '1px solid #fff'
//     },
//     headerText: {
//         display: 'flex',
//         flexDirection: 'column',
//         lineHeight: '1.2'
//     },
//     headerTitle: {
//         margin: 0,
//         color: '#fff',
//         fontWeight: 600,
//         fontSize: '16px'
//     },
//     headerSubtitle: {
//         margin: 0,
//         color: '#fff',
//         fontWeight: 300,
//         fontSize: '11px'
//     },
//     closeButton: {
//         background: "transparent",
//         border: "none",
//         color: "#fff",
//         cursor: "pointer",
//         display: 'flex',
//         alignItems: 'center'
//     },
//     body: {
//         flex: 1,
//         padding: "15px",
//         overflowY: "auto",
//         backgroundColor: "#fff",
//         display: 'flex',
//         flexDirection: 'column'
//     },
//     // Bot Message Styles
//     botMessageContainer: {
//         display: 'flex',
//         alignItems: 'flex-end',
//         marginBottom: '15px'
//     },
//     botAvatar: {
//         borderRadius: '50%',
//         marginRight: '10px',
//         marginBottom: '5px'
//     },
//     messageWrapper: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'flex-start',
//         maxWidth: '75%'
//     },
//     botName: {
//         fontSize: '10px',
//         color: '#BFBFBF',
//         marginLeft: '2px',
//         marginBottom: '2px'
//     },
//     botBubble: {
//         backgroundColor: "#1C73D4",
//         color: "#fff",
//         padding: "10px 14px",
//         borderRadius: "12px",
//         borderTopLeftRadius: "0px",
//         fontSize: "12px",
//         lineHeight: "1.5"
//     },
//     // User Message Styles
//     userMessageWrapper: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'flex-end', // Aligns internal content to right
//         maxWidth: '75%'
//     },
//     userBubble: {
//         backgroundColor: "#F4F9FF", // The light blue/gray from reference
//         color: "#595E62",
//         padding: "10px 14px",
//         borderRadius: "12px",
//         borderBottomRightRadius: "0px",
//         fontSize: "12px",
//         textAlign: "left", // Text inside bubble reads left-to-right
//         lineHeight: "1.5"
//     },
//     timestamp: {
//         display: 'block',
//         fontSize: '9px',
//         marginTop: '4px'
//     },
//     liveAgentButton: {
//         width: '100%',
//         backgroundColor: '#fff',
//         border: '1px solid #1C73D4',
//         color: '#1C73D4',
//         padding: '8px',
//         borderRadius: '5px',
//         fontSize: '12px',
//         cursor: 'pointer',
//         marginBottom: '10px',
//         transition: 'all 0.2s'
//     },
//     footer: {
//         padding: "10px",
//         borderTop: "1px solid #e0e0e0",
//         display: "flex",
//         gap: "10px",
//         alignItems: "center",
//         backgroundColor: '#fff'
//     },
//     input: {
//         flex: 1,
//         border: "none",
//         outline: "none",
//         fontSize: "12px",
//         padding: "8px",
//         color: "#595E62",
//         fontFamily: "'Poppins', sans-serif"
//     },
//     sendButton: {
//         background: "transparent",
//         border: "1px solid #1C73D4",
//         color: "#1C73D4",
//         width: "35px",
//         height: "35px",
//         borderRadius: "50%",
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         cursor: "pointer"
//     }
// };


import React, { useState, useRef, useEffect } from "react";
import { useCustomerChat } from "@/hooks/useCustomerChat";
import Image from "next/image";

// ... (Keep your Icon components CloseIcon and SendIcon here) ...
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
    </svg>
);

export default function ChatLauncher() {
    const [open, setOpen] = useState(false);
    const {
        chatId,
        startChatMutation,
        messages,
        sendMessage,
        askForAgent,
        typing,
        isAgentActive,
    } = useCustomerChat();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open, typing]);

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
        <div style={{ fontFamily: '"Poppins", sans-serif' }}>
            {!open && (
                <button onClick={handleOpen} style={styles.launcherButton}>
                    <Image src="/agent.png" alt="Chat" width={30} height={30} style={{ margin: 'auto' }} />
                    <span style={styles.statusBadge}></span>
                </button>
            )}

            {open && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <div style={styles.headerInfo}>
                            <div style={styles.agentImageContainer}>
                                <Image src="/agent.png" alt="Agent" width={45} height={45} />
                                <span style={styles.onlineIndicator}></span>
                            </div>
                            <div style={styles.headerText}>
                                <p style={styles.headerTitle}>Indra Assistant</p>
                                <span style={styles.headerSubtitle}>
                                    {isAgentActive ? "Live Support" : "Online"}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} style={styles.closeButton}>
                            <CloseIcon />
                        </button>
                    </div>

                    <div style={styles.body}>
                        {messages.length === 0 && (
                            <div style={styles.botMessageContainer}>
                                <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
                                <div style={styles.messageWrapper}>
                                    <span style={styles.botName}>Indra Assistant</span>
                                    <div style={styles.botBubble}>
                                        Hello! Welcome. How can I help you today?
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((m: any, i: number) => {
                            // HANDLE SYSTEM MESSAGE (Agent Joined)
                            if (m.sender === "system") {
                                return (
                                    <div key={i} style={styles.systemMessageContainer}>
                                        <span style={styles.systemMessage}>
                                            {m.message}
                                        </span>
                                    </div>
                                )
                            }

                            // STANDARD MESSAGES
                            return (
                                <div key={i} style={{
                                    display: 'flex',
                                    flexDirection: m.sender === "customer" ? 'row-reverse' : 'row',
                                    marginBottom: '15px',
                                    alignItems: 'flex-end'
                                }}>
                                    {/* Only show Avatar for bot/agent, not customer */}
                                    {m.sender !== "customer" && (
                                        <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
                                    )}

                                    <div style={m.sender === "customer" ? styles.userMessageWrapper : styles.messageWrapper}>
                                        {m.sender !== "customer" && (
                                            <span style={styles.botName}>Indra Assistant</span>
                                        )}
                                        <div style={m.sender === "customer" ? styles.userBubble : styles.botBubble}>
                                            {m.message}
                                            <div style={{
                                                ...styles.timestamp,
                                                textAlign: m.sender === "customer" ? 'right' : 'left',
                                                color: m.sender === "customer" ? '#888' : 'rgba(255,255,255,0.8)'
                                            }}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { timeStyle: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {typing && (
                            <div style={styles.botMessageContainer}>
                                <Image src="/agent.png" width={30} height={30} alt="Bot" style={styles.botAvatar} />
                                <div style={styles.messageWrapper}>
                                    <div style={{...styles.botBubble, fontStyle: 'italic'}}>
                                        Typing...
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Live Agent Button - HIDDEN if isAgentActive is true */}
                    {!isAgentActive && (
                        <div style={{padding: '0 10px'}}>
                            <button onClick={() => askForAgent()} style={styles.liveAgentButton}>
                                Talk to a Live Agent
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} style={styles.footer}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            placeholder="Write message here..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendButton}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

// Styles Object
const styles: { [key: string]: React.CSSProperties } = {
    launcherButton: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "2px solid #DB2727",
        cursor: "pointer",
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    },
    statusBadge: {
        position: "absolute",
        bottom: "0",
        right: "0",
        width: "14px",
        height: "14px",
        backgroundColor: "#05e905",
        borderRadius: "50%",
        border: "2px solid #fff"
    },
    chatWindow: {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "360px",
        height: "550px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif"
    },
    header: {
        backgroundColor: "#DB2727",
        padding: "12px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    agentImageContainer: { position: 'relative', display: 'flex' },
    onlineIndicator: {
        position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px',
        backgroundColor: '#05e905', borderRadius: '50%', border: '1px solid #fff'
    },
    headerText: { display: 'flex', flexDirection: 'column', lineHeight: '1.2' },
    headerTitle: { margin: 0, color: '#fff', fontWeight: 600, fontSize: '16px' },
    headerSubtitle: { margin: 0, color: '#fff', fontWeight: 300, fontSize: '11px' },
    closeButton: {
        background: "transparent", border: "none", color: "#fff", cursor: "pointer", display: 'flex', alignItems: 'center'
    },
    body: {
        flex: 1, padding: "15px", overflowY: "auto", backgroundColor: "#fff", display: 'flex', flexDirection: 'column'
    },

    // --- NEW STYLES FOR SYSTEM MESSAGE ---
    systemMessageContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '15px',
        marginTop: '5px'
    },
    systemMessage: {
        backgroundColor: '#fff3cd', // Light yellow background like WhatsApp system msg
        color: '#856404',
        border: '1px solid #ffeeba',
        padding: '4px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        textAlign: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    // -------------------------------------

    botMessageContainer: { display: 'flex', alignItems: 'flex-end', marginBottom: '15px' },
    botAvatar: { borderRadius: '50%', marginRight: '10px', marginBottom: '5px' },
    messageWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '75%' },
    botName: { fontSize: '10px', color: '#BFBFBF', marginLeft: '2px', marginBottom: '2px' },
    botBubble: {
        backgroundColor: "#DB2727", color: "#fff", padding: "10px 14px", borderRadius: "12px",
        borderTopLeftRadius: "0px", fontSize: "12px", lineHeight: "1.5"
    },
    userMessageWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '75%' },
    userBubble: {
        backgroundColor: "#F4F9FF", color: "#595E62", padding: "10px 14px", borderRadius: "12px",
        borderBottomRightRadius: "0px", fontSize: "12px", textAlign: "left", lineHeight: "1.5"
    },
    timestamp: { display: 'block', fontSize: '9px', marginTop: '4px' },
    liveAgentButton: {
        width: '100%', backgroundColor: '#fff', border: '1px solid #DB2727', color: '#DB2727',
        padding: '8px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer',
        marginBottom: '10px', transition: 'all 0.2s'
    },
    footer: {
        padding: "10px", borderTop: "1px solid #e0e0e0", display: "flex", gap: "10px",
        alignItems: "center", backgroundColor: '#fff'
    },
    input: { flex: 1, border: "none", outline: "none", fontSize: "12px", padding: "8px", color: "#595E62", fontFamily: "'Poppins', sans-serif" },
    sendButton: {
        background: "transparent", border: "1px solid #DB2727", color: "#DB2727", width: "35px", height: "35px",
        borderRadius: "50%", display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: "pointer"
    }
};