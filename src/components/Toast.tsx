"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {createPortal} from "react-dom";

type ToastProps = {
    message: string;
    type?: "success" | "error";
    visible: boolean;
    onClose: () => void;
    duration?: number; // Duration in milliseconds
};

export default function Toast({ message, type = "success", visible, onClose, duration }: ToastProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!visible) return;
        

        const calculatedDuration = duration ?? Math.min(
            Math.max(3000, 3000 + (message.length - 50) * 50),
            10000
        );
        
        const timer = setTimeout(onClose, calculatedDuration);
        return () => clearTimeout(timer);
    }, [visible, onClose, message.length, duration]);

    if (!visible || !isMounted) return null;



    return createPortal (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]">
            <div
                className={`flex items-center gap-4 px-6 py-3 rounded-full text-white shadow-lg min-w-[300px]
          ${type === "success" ? "bg-[#039855]" : "bg-red-600"}
        `}
            >
                <Image
                    src={type === "success" ? "/check-circle.svg" : "/error-white.svg"}
                    width={20}
                    height={20}
                    alt="icon"
                />
                <span className="text-base font-medium">{message}</span>

                <button onClick={onClose} className="ml-auto text-white text-xl">
                    <Image
                        src="/x-close.svg"
                        width={20}
                        height={20}
                        alt="icon"
                    />
                </button>
            </div>
        </div>,
        document.body
    );
}
