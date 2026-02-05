import { AvailableSlot, DashboardStats, DisplayStatus, ProcessedScheduledService, ScheduledServiceResponse } from "@/types/serviceBooking";
import { timeToMinutes, minutesToTime, generateTimeSlotStrings } from "@/utils/timeSlotUtils";

const WORKING_HOURS = {
    START: "08:00",
    END: "16:30",
    SLOT_DURATION_MINUTES: 30,
}


export function determineStatus(service: ScheduledServiceResponse): DisplayStatus {
    const dbStatus = service.status;

    if (dbStatus === "COMPLETED") {
        return "Completed";
    }

    if (dbStatus === "PENDING") {
        return "Pending";
    }

    if (dbStatus === "BOOKED" || !dbStatus) {
        return getTimeBasedStatus(service);
    }

    return getTimeBasedStatus(service);
}

function getTimeBasedStatus(service: ScheduledServiceResponse): DisplayStatus {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // If booking is in the past date
    if (service.booking_date < today) {
        // Past date but still BOOKED = overdue, show as In Progress
        return "In Progress";
    }

    // If booking is in the future date
    if (service.booking_date > today) {
        return "Upcoming";
    }

    // If booking is today, check the time
    if (service.booking_date === today) {
        // If current time has passed the end time but still BOOKED = overdue
        if (currentTime >= service.end_time) {
            return "In Progress"; // Overdue - still show as In Progress
        }
        // If current time is between start and end time
        if (currentTime >= service.start_time && currentTime < service.end_time) {
            return "In Progress";
        }
        // If current time is before start time
        if (currentTime < service.start_time) {
            return "Upcoming";
        }
    }

    return "Upcoming";
}

export function getThemeFromStatus(status: DisplayStatus): "green" | "orange" | "white" | "yellow" {
    switch (status) {
        case "Completed":
            return "green";
        case "In Progress":
            return "orange";
        case "Pending":
            return "yellow"; // Yellow/amber for pending - needs attention
        case "Upcoming":
            return "white";
        default:
            return "white";
    }
}

export function calculateStats(services: ProcessedScheduledService[]): DashboardStats {
    const inProgress = services.filter(s => s.displayStatus === "In Progress").length;
    const upcoming = services.filter(s => s.displayStatus === "Upcoming").length;
    // Total scheduled = all active bookings (BOOKED + PENDING, excludes CANCELLED)
    const totalScheduled = services.length;
    const availableSlots = 0; //TODO: Implement this

    return {
        totalScheduled,
        inProgress,
        upcoming,
        availableSlots
    }
}

export function formatTime12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function calculateAvailableSlots(
    services: ProcessedScheduledService[],
    allBays: string[] = []
): AvailableSlot[] {
    // Get unique bays from services, or use all available bays if no services exist
    const uniqueBaysFromServices = [...new Set(services.map(s => s.bay))];
    const baysToProcess = uniqueBaysFromServices.length > 0 ? uniqueBaysFromServices : allBays;

    const allSlots = generateTimeSlotStrings(
        WORKING_HOURS.START,
        WORKING_HOURS.END,
        WORKING_HOURS.SLOT_DURATION_MINUTES
    );

    const availableSlots: AvailableSlot[] = [];
    for (const bay of baysToProcess) {
        // Filter out slots that are occupied by services for this bay
        const baySlots = allSlots.filter(slot => !services.some(s => s.bay === bay && s.start_time <= slot && s.end_time > slot));
        for (const slot of baySlots) {
            const slotEndTime = minutesToTime(timeToMinutes(slot) + WORKING_HOURS.SLOT_DURATION_MINUTES);
            availableSlots.push({
                time: formatTime12Hour(slot),  // Convert to 12-hour format
                duration: `${formatTime12Hour(slot)} - ${formatTime12Hour(slotEndTime)}`,
                bay: bay
            });
        }
    }

    return availableSlots;
}