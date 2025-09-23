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
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">
          Permission restricted for this device
        </p>
      </div>
    );
  }

  return <>{children}</>
}
