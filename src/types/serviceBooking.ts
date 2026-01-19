export interface ScheduledServiceResponse{
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
}

export interface ProcessedScheduledService extends ScheduledServiceResponse{
    status: "Completed" | "In Progress" | "Upcoming";
    theme: "green" | "orange" | "white";
}

export interface AvailableSlot{
    time: string;
    duration: string;
    bay: string;
}

export interface DashboardStats{
    totalScheduled: number;
    inProgress: number;
    upcoming: number;
    availableSlots: number;
}