// Database status from the backend
export type DatabaseStatus = "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";

// Display status for the UI
export type DisplayStatus = "Completed" | "In Progress" | "Upcoming" | "Pending";

export interface ScheduledServiceResponse {
    time: string;
    cab: string;
    customer: string;
    service: string;
    bay: string;
    vehicle: string;
    technician: string;
    start_time: string;
    end_time: string;
    booking_date: string;
    status: DatabaseStatus; 
}

export interface ProcessedScheduledService extends ScheduledServiceResponse {
    displayStatus: DisplayStatus; 
    theme: "green" | "orange" | "white" | "yellow";
}

export interface AvailableSlot {
    time: string;
    duration: string;
    bay: string;
}

export interface DashboardStats {
    totalScheduled: number;
    inProgress: number;
    upcoming: number;
    availableSlots: number;
}