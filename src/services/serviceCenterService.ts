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

// Get branch details by ID
export const getBranchById = async (branchId: number): Promise<{ id: number; name: string }> => {
    try {
        const res = await axiosInstance.get(`/service-park/branches/${branchId}`);
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
        console.error('[ServiceCenterService] Failed to fetch branch details:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch branch details');
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

/** Paginated bookings for reports. branchId optional = all branches. */
export interface BookingsForReportsParams {
    branchId?: number | null;
    startDate: string;
    endDate: string;
    lineId?: number | null;
    serviceType?: string | null;
    page: number;
    limit: number;
}

export interface BookingsForReportsResponse {
    data: ServiceCenterBooking[];
    total: number;
}

export const getBookingsForReports = async (
    params: BookingsForReportsParams
): Promise<BookingsForReportsResponse> => {
    try {
        const search = new URLSearchParams();
        search.set('startDate', params.startDate);
        search.set('endDate', params.endDate);
        search.set('page', params.page.toString());
        search.set('limit', params.limit.toString());
        if (params.branchId != null && params.branchId !== undefined) {
            search.set('branchId', params.branchId.toString());
        }
        if (params.lineId != null && params.lineId !== undefined) {
            search.set('lineId', params.lineId.toString());
        }
        if (params.serviceType != null && params.serviceType !== undefined && params.serviceType !== '') {
            search.set('serviceType', params.serviceType);
        }

        const res = await axiosInstance.get(`/service-center/bookings/reports?${search}`);

        if (Array.isArray(res.data)) {
            console.warn('[ServiceCenterService] Backend returned array instead of paginated object. Backend update needed for pagination.');
            return {
                data: res.data,
                total: res.data.length 
            };
        }
        
        return res.data;
    } catch (error) {
        const axiosError = error as {
            message?: string;
            response?: {
                status?: number;
                statusText?: string;
                data?: { message?: string } | string
            }
        };
        
        let errorMessage = 'Failed to fetch report bookings';
        const status = axiosError.response?.status;
        
        if (axiosError.response?.data) {
            if (typeof axiosError.response.data === 'string') {
                errorMessage = axiosError.response.data;
            } else if (typeof axiosError.response.data === 'object' && axiosError.response.data.message) {
                errorMessage = axiosError.response.data.message;
            } else if (typeof axiosError.response.data === 'object' && axiosError.response.data.error) {
                errorMessage = axiosError.response.data.error;
            }
        } else if (axiosError.message) {
            errorMessage = axiosError.message;
        }
        
        if (status === 403) {
            if (!errorMessage.toLowerCase().includes('access') && !errorMessage.toLowerCase().includes('permission')) {
                errorMessage = `Access denied: ${errorMessage}`;
            }
        } else if (status === 404) {
            errorMessage = 'Endpoint not found. Please ensure the backend route is implemented.';
        } else if (status === 400) {
            errorMessage = `Invalid request: ${errorMessage}`;
        }
        
        console.error('[ServiceCenterService] Failed to fetch report bookings:', {
            message: errorMessage,
            status: status,
            statusText: axiosError.response?.statusText,
            responseData: axiosError.response?.data
        });
        
        throw new Error(errorMessage);
    }
};

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
export const getBookingById = async (id: number): Promise<ServiceCenterBooking> => {
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
    email?: string;
    address?: string;
    vehicle_model?: string;
    odometer?: string;
    mileage?: string;
    oil_type?: string;
    service_advisor?: string;
    vehicle_make?: string;
    status?: string;
    service_center?: string; 
}): Promise<ServiceCenterBooking> => {
    try {
      
        console.log('[ServiceCenterService] Creating booking with data:', JSON.stringify(data, null, 2));

        const res = await axiosInstance.post('/service-center/bookings', data);
        console.log('[ServiceCenterService] Booking created, response:', res.data);
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