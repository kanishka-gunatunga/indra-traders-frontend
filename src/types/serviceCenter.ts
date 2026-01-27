export type DatabaseStatus = "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";

export type CalendarDotColor = 'green' | 'red' | 'orange';

export interface SlotStatus {
    status: DatabaseStatus | null;  
    vehicleCode: string | null;  // vehicle_no from backend (e.g., "CAB - 5482")
    // Note: Badge shows day number from selectedDate, not vehicleNo
}

export interface BookingDetails {
    vehicleCode: string;  // vehicle_no from backend
    customerName: string;
    phoneNumber: string;
    vehicleModel: string;
    status: DatabaseStatus;  
}

export interface SelectedBooking {
    slotStart: string;
    slotEnd: string;
    slotLabel: string;
    vehicleCode: string;  // vehicle_no from backend
    status: DatabaseStatus | null;  
    bookingId?: number;  
}

export interface BookingFormData {
    vehicleCode: string;
    phoneNumber: string;
    customerName: string;
    vehicleModel: string;
}

export interface ServiceCenterBooking {
    id: number;
    date: string;           // YYYY-MM-DD
    start_time: string;     // "HH:mm"
    end_time: string;       // "HH:mm"
    vehicle_no: string | null;
    customer_name: string | null;
    phone_number: string | null;
    status: DatabaseStatus;
    line_id: number | null;
    service_type: string | null;  // "REPAIR" | "PAINT" | "ADDON"
}


export interface ServiceLine {
    id: number;
    name: string;
    type: string;  // "REPAIR" | "PAINT" | "ADDON"
    advisor: string;
}