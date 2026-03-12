import { useQuery } from "@tanstack/react-query";
import { historyService } from "@/services/history.service";

export const historyKeys = {
    all: ["history"] as const,
    customerInvoices: (phone: string) => [...historyKeys.all, "customerInvoices", phone] as const,
    vehicleJobs: (plate: string) => [...historyKeys.all, "vehicleJobs", plate] as const,
    jobDetails: (jobId: string) => [...historyKeys.all, "jobDetails", jobId] as const,
};

/**
 * Hook to fetch customer service/repair history via phone
 */
export const useCustomerInvoices = (phone: string) => {
    return useQuery({
        queryKey: historyKeys.customerInvoices(phone),
        queryFn: () => historyService.getCustomerInvoices(phone),
        enabled: !!phone,
    });
};

/**
 * Hook to fetch vehicle job history via plate number
 */
export const useVehicleJobs = (plate: string) => {
    return useQuery({
        queryKey: historyKeys.vehicleJobs(plate),
        queryFn: () => historyService.getVehicleJobs(plate),
        enabled: !!plate,
    });
};

/**
 * Hook to fetch specific job details by job ID
 */
export const useJobDetails = (jobId: string) => {
    return useQuery({
        queryKey: historyKeys.jobDetails(jobId),
        queryFn: () => historyService.getJobDetails(jobId),
        enabled: !!jobId,
    });
};
