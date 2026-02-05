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
    email: string;
    address: string;
    vehicleModel: string;
    odometer: string;
    mileage: string;
    oilType: string;
    serviceAdvisor: string;
    vehicleMake: string;
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
    email: string;
    address: string;
    vehicleModel: string;
    odometer: string;
    mileage: string;
    oilType: string;
    serviceAdvisor: string;
    vehicleMake: string;
}

export interface ServiceCenterBooking {
    id: number;
    date: string;           // YYYY-MM-DD
    start_time: string;     // "HH:mm"
    end_time: string;       // "HH:mm"
    vehicle_no: string | null;
    customer_name: string | null;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    vehicle_model: string | null;
    odometer: string | null;
    mileage: string | null;
    oil_type: string | null;
    service_advisor: string | null;
    vehicle_make: string | null;
    status: DatabaseStatus;
    line_id: number | null;
    service_type: string | null;  // "REPAIR" | "PAINT" | "ADDON"
    branch_id?: number | null;
    branch_name?: string | null;
}


export interface ServiceLine {
    id: number;
    name: string;
    type: string;  // "REPAIR" | "PAINT" | "ADDON"
    advisor: string;
}

export interface CalendarDotBooking {
    date: string;           // YYYY-MM-DD
    status: DatabaseStatus;
}