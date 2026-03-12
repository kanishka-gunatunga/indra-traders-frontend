/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosinstance";

export const historyService = {
    /**
     * Get customer repair/service history (invoices)
     */
    getCustomerInvoices: async (phone: string) => {
        const res = await axiosInstance.get(`/history/customers/${phone}/invoices`);
        return res.data;
    },

    /**
     * Get vegetable job history by plate number
     */
    getVehicleJobs: async (plate: string) => {
        const res = await axiosInstance.get(`/history/vehicles/${plate}/jobs`);
        return res.data;
    },

    /**
     * Get job details by job id
     */
    getJobDetails: async (jobId: string) => {
        const res = await axiosInstance.get(`/history/jobs/${jobId}`);
        return res.data;
    },
};
