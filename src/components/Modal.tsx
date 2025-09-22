// components/Modal.tsx
"use client";

import Image from "next/image";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  isPriorityAvailable?: boolean;
  priority?: string;
  onPriorityChange?: (value: string) => void;
}

export default function Modal({
  title,
  children,
  onClose,
  onSave,
  saveLabel,
  isPriorityAvailable = false,
  priority,
  onPriorityChange,
}: ModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Portal setup
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
      if (containerRef.current && containerRef.current.parentNode === document.body) {
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
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus modal on mount
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    return () => {
      try {
        prev?.focus?.();
      } catch {}
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal box */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative rounded-[45px] border border-[#E7E7E7] bg-[#FFFFFF] backdrop-blur-[60px] shadow-2xl p-8 z-10 max-h-[90vh] w-[90vw] max-w-[1350px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row */}
        <div className="absolute top-6 left-8 flex items-center gap-4">
          <h2
            id="modal-title"
            className="font-montserrat font-semibold text-[22px] leading-[100%]"
          >
            {title}
          </h2>

          {/* Priority selector next to title */}
          {isPriorityAvailable && (
            <div className="relative w-[65px] h-[34px] rounded-[22.98px] bg-[#FFA7A7] flex items-center px-[10px] py-[5.74px]">
              <select
                value={priority}
                onChange={(e) => onPriorityChange?.(e.target.value)}
                className="w-full h-full bg-transparent border-none text-sm cursor-pointer focus:outline-none appearance-none pr-6 text-center"
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="P5">P5</option>
              </select>
              {/* Custom dropdown arrow */}
              <span className="absolute right-2 pointer-events-none">
                <Image
                  src="/images/sales/icon-park-solid_down-one.svg"
                  alt="Dropdown arrow"
                  width={19}
                  height={19}
                />
              </span>
            </div>
          )}
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={onSave}
            className="absolute top-6 right-8 w-[121px] h-[41px] rounded-[30px] bg-[#DB2727] text-white flex items-center justify-center px-[18px] hover:bg-red-700"
            type="button"
          >
            {saveLabel}
          </button>
        )}

        {/* Modal content */}
        <div className="mt-16">{children}</div>
      </div>
    </div>,
    containerRef.current
  );
}
