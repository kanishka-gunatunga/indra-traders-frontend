import axiosInstance from "@/utils/axiosinstance";
import { ScheduledServiceResponse } from "@/types/serviceBooking";

export const fetchScheduledServices = async (
    branchId: number, 
    date?: string
): Promise<ScheduledServiceResponse[]> => {
    const url = `/service-booking/scheduled-services`;
    const params = {
        branchId,  
        ...(date ? { date } : {}), 
    };

    try {
        const res = await axiosInstance.get(url, { params });
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: unknown 
            }; 
            config?: { 
                url?: string; 
                baseURL?: string; 
            } 
        };
        
        console.error('[ServiceBookingService] Failed to fetch scheduled services:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            url: axiosError.config?.url,
            baseURL: axiosError.config?.baseURL
        });
        
        throw error;
    }
};