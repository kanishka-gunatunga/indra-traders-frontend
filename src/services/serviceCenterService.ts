import axiosInstance from "@/utils/axiosinstance";
import { ServiceCenterBooking, ServiceLine, CalendarDotBooking } from "@/types/serviceCenter";

// Get all service types (REPAIR, PAINT, ADDON)
export const getServiceTypes = async (): Promise<string[]> => {
    try {
        const res = await axiosInstance.get('/service-center/service-types');
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to fetch service types:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch service types');
    }
}

// Get service lines (bays) for a branch
export const getServiceLines = async (branchId: number): Promise<ServiceLine[]> => {
    try {
        const res = await axiosInstance.get(`/service-park/branches/${branchId}/lines`);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };

        console.error('[ServiceCenterService] Failed to fetch service lines:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch service lines');
    }
}

// Get bookings for a specific date | all bookings for a branch
export const getBookings = async (date: string, branchId: number, lineId?: number, serviceType?: string): Promise<ServiceCenterBooking[]> => {
    try {
        const params = new URLSearchParams({
            date,
            branchId: branchId.toString(),
        });

        if (lineId) params.append('lineId', lineId.toString());
        if (serviceType) params.append('serviceType', serviceType);

        const res = await axiosInstance.get(`/service-center/bookings?${params}`);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to fetch bookings:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch bookings');
    }
}

// Get calendar dots data (only date and status)
export const getCalendarDots = async (
    branchId: number,
    startDate?: string,
    endDate?: string,
    lineId?: number,
    serviceType?: string
): Promise<CalendarDotBooking[]> => {
    try {
        const params = new URLSearchParams({
            branchId: branchId.toString(),
        });

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (lineId) params.append('lineId', lineId.toString());
        if (serviceType) params.append('serviceType', serviceType);

        const res = await axiosInstance.get(`/service-center/bookings/calendar-dots?${params}`);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to fetch calendar dots:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch calendar dots');
    }
}

// Legacy function - kept for backward compatibility
export const getAllBookingsForCalendar = async (
    branchId: number,
    startDate?: string,
    endDate?: string,
    lineId?: number,
    serviceType?: string
): Promise<ServiceCenterBooking[]> => {
    try {
        const params = new URLSearchParams({
            branchId: branchId.toString(),
        });

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (lineId) params.append('lineId', lineId.toString());
        if (serviceType) params.append('serviceType', serviceType);

        const res = await axiosInstance.get(`/service-center/bookings/all?${params}`);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to fetch calendar bookings:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch calendar bookings');
    }
}

//  Get a single booking by ID
export const getBookingById = async (id: number): Promise<ServiceCenterBooking> =>{
    try {
        const res = await axiosInstance.get(`/service-center/bookings/${id}`);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to fetch booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch booking');
    }
}

// Create a new booking
export const createBooking = async (data: {
    branch_id: number;
    line_id: number;
    date: string;
    start_time: string;
    end_time: string;
    vehicle_no: string;
    customer_name: string;
    phone_number: string;
    status?: string;
}): Promise<ServiceCenterBooking> => {
    try {
        const res = await axiosInstance.post('/service-center/bookings', data);
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to create booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to create booking');
    }
}

// Update booking status
export const updateBookingStatus = async (
    id: number,
    status: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"
): Promise<ServiceCenterBooking> => {
    try {
        const res = await axiosInstance.put(`/service-center/bookings/${id}`, { status });
        return res.data;
    } catch (error) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        console.error('[ServiceCenterService] Failed to update booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to update booking');
    }
}