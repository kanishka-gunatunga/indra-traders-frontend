import { ServiceCenterBooking } from '@/types/serviceCenter';
import { 
    getDisplayStatus, 
    calculateBookingStats,
    type BookingWithStatus,
    type BookingStats 
} from './bookingStatsProcessor';

export type ServiceCenterStats = BookingStats;

function toBookingWithStatus(booking: ServiceCenterBooking): BookingWithStatus {
    return {
        status: booking.status,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
    };
}

export function determineServiceCenterStatus(booking: ServiceCenterBooking): "Completed" | "In Progress" | "Upcoming" {
    return getDisplayStatus(toBookingWithStatus(booking));
}

export function calculateServiceCenterStats(bookings: ServiceCenterBooking[], totalTimeSlots: number): BookingStats {
    const bookingsWithStatus: BookingWithStatus[] = bookings.map(toBookingWithStatus);

    return calculateBookingStats(bookingsWithStatus, totalTimeSlots);
}