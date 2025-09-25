
"use client";

import { X } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function DetailsModal({
  isOpen,
  onClose,
  title,
  children
}: DetailsModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Setup portal + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const el = document.createElement("div");
    containerRef.current = el;
    document.body.appendChild(el);

    // Lock scroll
    scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    const bodyStyle = document.body.style;
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollYRef.current}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.overflow = "hidden";

    setMounted(true);

    return () => {
      if (containerRef.current?.parentNode === document.body) {
        document.body.removeChild(containerRef.current);
      }
      // restore scroll
      bodyStyle.position = "";
      bodyStyle.top = "";
      bodyStyle.left = "";
      bodyStyle.right = "";
      bodyStyle.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || !containerRef.current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="relative max-w-[1400px] min-w-[756px] min-h-[274px] rounded-[45px] border border-[#E7E7E7] backdrop-blur-[60px] bg-white/70 shadow-lg px-8 py-6 z-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black"
        >
          <X size={28} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-black mb-4">
          {title}
        </h2>

        {/* Content */}
        <div className="text-lg mt-3 space-y-2">
          {children}
        </div>
      </div>
    </div>,
    containerRef.current
  );
}
