'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/utils/auth";
import { ROLE_DASHBOARDS } from "@/utils/role-routes";

export default function Home() {
    const router = useRouter();
    const user = useCurrentUser();

    useEffect(() => {
        if (!user) {
            // Not logged in → redirect to login
            router.push("/login");
            return;
        }

        // Logged in → redirect to their dashboard
        const role = user.user_role as keyof typeof ROLE_DASHBOARDS;
        const destination = ROLE_DASHBOARDS[role];

        if (destination) {
            router.push(destination);
        } else {
            // Unknown role → redirect to login
            router.push("/login");
        }
    }, [user, router]);

    // Show loading state while redirecting
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DB2727] mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}