import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { fetchScheduledServices, fetchServiceLines } from "@/services/serviceBookingService";
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
                
                // Fetch service lines (bays) and scheduled services in parallel
                const [rawServices, lines] = await Promise.all([
                    fetchScheduledServices(branchId, today),
                    fetchServiceLines(branchId)
                ]);

                // Extract bay names from service lines
                const bayNames = lines.map(line => line.name);

                const processedServices: ProcessedScheduledService[] = rawServices.map(service => {
                    const status = determineStatus(service);
                    const theme = getThemeFromStatus(status);
                    return {
                        ...service,
                        status,
                        theme
                    };
                });

                // Sort services: In Progress → Upcoming → Completed
                const statusOrder = { "In Progress": 0, "Upcoming": 1, "Completed": 2 };
                processedServices.sort((a, b) => {
                    const orderA = statusOrder[a.status] ?? 999;
                    const orderB = statusOrder[b.status] ?? 999;
                    return orderA - orderB;
                });

                const calculatedStats = calculateStats(processedServices);
                // Pass bay names to calculateAvailableSlots
                const calculatedSlots = calculateAvailableSlots(processedServices, bayNames);
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