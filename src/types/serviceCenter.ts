export type BookingStatus = 'booked' | 'pending' | 'available';

export type CalendarDotColor = 'green' | 'red' | 'orange';

export interface SlotStatus {
    status: BookingStatus;
    vehicleCode: string | null;
    vehicleNo: string | null;
}

export interface BookingDetails {
    vehicleCode: string;
    vehicleNo: string;
    customerName: string;
    phoneNumber: string;
    vehicleModel: string;
    status: BookingStatus;
}

export interface SelectedBooking {
    slotStart: string;
    slotEnd: string;
    slotLabel: string;
    vehicleCode: string;
    vehicleNo: string;
    status: BookingStatus;
}

export interface BookingFormData {
    vehicleCode: string;
    phoneNumber: string;
    customerName: string;
    vehicleModel: string;
}