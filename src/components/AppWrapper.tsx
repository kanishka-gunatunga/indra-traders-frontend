"use client";

import { useDeviceRestriction } from "@/hooks/useDeviceRestriction";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const restricted = useDeviceRestriction(1000);

  if (restricted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-[#FFA7A7] rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center max-w-md text-center animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Permission Restricted
          </h1>
          <p className="text-md text-red-800">
            Access to this device is restricted. Please contact support for
            assistance.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
