import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { fetchScheduledServices } from "@/services/serviceBookingService";
import {
    determineStatus,
    getThemeFromStatus,
    calculateStats,
    calculateAvailableSlots
} from "@/utils/serviceBookingProcessor";
import {
    ProcessedScheduledService,
    AvailableSlot,
    DashboardStats
} from "@/types/serviceBooking";

export function useScheduledServices() {
    const { data: session } = useSession();
    const branchId = session?.user?.branchId ? Number(session.user.branchId) : null;

    const [scheduledServices, setScheduledServices] = useState<ProcessedScheduledService[]>([]);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalScheduled: 0,
        inProgress: 0,
        upcoming: 0,
        availableSlots: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (!branchId) {
            console.warn('[useScheduledServices] No branchId available in session');
            setLoading(false);
            return;
        }

        const fetchAndProcessData = async () => {
            try {
                if (isInitialLoad.current) {
                    setLoading(true);
                }
                setError(null);

                const today = new Date().toISOString().split('T')[0];
                const rawServices = await fetchScheduledServices(branchId, today);

                const processedServices: ProcessedScheduledService[] = rawServices.map(service => {
                    const status = determineStatus(service);
                    const theme = getThemeFromStatus(status);
                    return {
                        ...service,
                        status,
                        theme
                    };
                });

                const calculatedStats = calculateStats(processedServices);
                const calculatedSlots = calculateAvailableSlots(processedServices);
                calculatedStats.availableSlots = calculatedSlots.length;

                setScheduledServices(processedServices);
                setAvailableSlots(calculatedSlots);
                setStats(calculatedStats);
                
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setLoading(false);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to fetch scheduled services";
                console.error('[useScheduledServices] Error fetching scheduled services:', errorMessage);
                setError(errorMessage);
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setLoading(false);
                }
            }
        };

        isInitialLoad.current = true;
        fetchAndProcessData();

        const intervalId = setInterval(() => {
            fetchAndProcessData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [branchId, session]);

    return {
        scheduledServices,
        availableSlots,
        stats,
        loading,
        error
    };
}