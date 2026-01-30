import type { DatabaseStatus } from '@/types/serviceCenter';

export type DisplayStatus = "Completed" | "In Progress" | "Upcoming";

export interface BookingWithStatus {
    status: DatabaseStatus;
    date: string;  
    start_time: string;  
    end_time: string;  
}

export interface BookingStats {
    totalScheduled: number;
    inProgress: number;
    upcoming: number;
    availableSlots: number;
}

export function getDisplayStatus(booking: BookingWithStatus): DisplayStatus {

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
        return "Completed";
    }

    const now = new Date();

    const bookingDate = booking.date; 
    const startDateTime = new Date(`${bookingDate}T${booking.start_time}`);
    const endDateTime = new Date(`${bookingDate}T${booking.end_time}`);
    
    if (now > endDateTime) {
        return "Completed";
    }
    
    if (now >= startDateTime && now <= endDateTime) {
        return "In Progress";
    }
    
    return "Upcoming";
}

export function calculateBookingStats(
    bookings: BookingWithStatus[],
    totalTimeSlots: number
): BookingStats {
    const processedBookings = bookings.map(booking => ({
        ...booking,
        displayStatus: getDisplayStatus(booking)
    }));
    
    const inProgress = processedBookings.filter(
        b => b.displayStatus === "In Progress"
    ).length;
    
    const upcoming = processedBookings.filter(
        b => b.displayStatus === "Upcoming"
    ).length;
    
    const totalScheduled = bookings.filter(
        b => b.status !== 'CANCELLED'
    ).length;
    
    const bookedSlots = bookings.filter(
        b => b.status !== 'CANCELLED'
    ).length;
    
    const availableSlots = Math.max(0, totalTimeSlots - bookedSlots);
    
    return {
        totalScheduled,
        inProgress,
        upcoming,
        availableSlots
    };
}
