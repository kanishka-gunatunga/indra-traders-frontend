// components/Modal.tsx
"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
}

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveLabel = "Save",
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    const el = document.createElement("div");
    containerRef.current = el;
    document.body.appendChild(el);

    const scrollY = window.scrollY || window.pageYOffset || 0;
    scrollYRef.current = scrollY;
    const bodyStyle = document.body.style;
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.overflow = "hidden";

    setMounted(true);

    return () => {
      // cleanup portal container
      if (containerRef.current && containerRef.current.parentNode === document.body) {
        document.body.removeChild(containerRef.current);
      }
      // restore body scroll
      bodyStyle.position = "";
      bodyStyle.top = "";
      bodyStyle.left = "";
      bodyStyle.right = "";
      bodyStyle.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
    
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus management: focus modal on open, restore on close is handled by browser when we return focus
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    return () => {
      try { prev?.focus?.(); } catch { /* ignore */ }
    };
  }, []);

  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative rounded-[45px] border border-[#E7E7E7]
                   bg-[#FFFFFF] backdrop-blur-[60px] shadow-2xl p-8 z-10
                   max-h-[90vh] w-[90vw] max-w-[1350px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 id="modal-title" className="absolute top-6 left-8 font-montserrat font-semibold text-[22px] leading-[100%]">
          {title}
        </h2>

        {/* Save button */}
        {onSave && (
          <button
            onClick={onSave}
            className="absolute top-6 right-8 w-[121px] h-[41px] rounded-[30px] bg-[#DB2727] text-white
                       flex items-center justify-center px-[18px] hover:bg-red-700"
            type="button"
          >
            {saveLabel}
          </button>
        )}

        {/* Content */}
        <div className="mt-16">{children}</div>
      </div>
    </div>,
    containerRef.current
  );
}
