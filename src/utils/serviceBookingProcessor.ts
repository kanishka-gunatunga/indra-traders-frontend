import { AvailableSlot, DashboardStats, ProcessedScheduledService, ScheduledServiceResponse } from "@/types/serviceBooking";

const WORKING_HOURS = {
    START: "08:00",
    END: "16:30",
    SLOT_DURATION_MINUTES: 30,
}

export function determineStatus(service: ScheduledServiceResponse): "Completed" | "In Progress" | "Upcoming" {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    // If booking is in the past, it's completed
    if (service.booking_date < today) {
        return "Completed";
    }
    
    // If booking is in the future, it's upcoming
    if (service.booking_date > today) {
        return "Upcoming";
    }

    // If booking is today, check the time
    if (service.booking_date === today) {
        // If current time has passed the end time, it's completed
        if (currentTime >= service.end_time) {
            return "Completed";
        }
        // If current time is between start and end time, it's in progress
        if (currentTime >= service.start_time && currentTime < service.end_time) {
            return "In Progress";
        }
        // If current time is before start time, it's upcoming
        if (currentTime < service.start_time) {
            return "Upcoming";
        }
    }

    return "Upcoming";
}

export function getThemeFromStatus(status: "Completed" | "In Progress" | "Upcoming"): "green" | "orange" | "white" {
    switch (status) {
        case "Completed":
            return "green";
        case "In Progress":
            return "orange";
        case "Upcoming":
            return "white";
        default:
            return "white";
    }
}

export function calculateStats(services: ProcessedScheduledService[]): DashboardStats{
    const inProgress = services.filter(s => s.status === "In Progress").length;
    const upcoming = services.filter(s => s.status === "Upcoming").length; 
    const totalScheduled = services.length;
    const availableSlots = 0; //TODO: Implement this

    return {
        totalScheduled,
        inProgress,
        upcoming,
        availableSlots
    }
}

export function timeToMinutes(time: string): number{
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string{
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}

export function formatTime12Hour(time: string): string{
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function generateTimeSlots(
    startTime: string,
    endTime: string,
    slotDurationMinutes: number
): string[] {
    
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    const slots: string[] = [];
    
    let currentMinutes = startMinutes;
    while (currentMinutes <= endMinutes){
        const slotTime = minutesToTime(currentMinutes);
        slots.push(slotTime);

        currentMinutes += slotDurationMinutes;
    }

    return slots;
}

export function calculateAvailableSlots(services: ProcessedScheduledService[]): AvailableSlot[] {
    const uniqueBays = [...new Set(services.map(s => s.bay))];

    const allSlots = generateTimeSlots(
        WORKING_HOURS.START,
        WORKING_HOURS.END,
        WORKING_HOURS.SLOT_DURATION_MINUTES
    );

    const availableSlots: AvailableSlot[] = [];
    for(const bay of uniqueBays){
        const baySlots = allSlots.filter(slot => !services.some(s => s.bay === bay && s.start_time <= slot && s.end_time > slot));
        for(const slot of baySlots){
            const slotEndTime = minutesToTime(timeToMinutes(slot) + WORKING_HOURS.SLOT_DURATION_MINUTES);
            availableSlots.push({
                time: formatTime12Hour(slot),  // Convert to 12-hour format
                duration: `${formatTime12Hour(slot)} - ${formatTime12Hour(slotEndTime)}`,  // Convert both to 12-hour format
                bay: bay
            });
        }
    }

    return availableSlots;  
}