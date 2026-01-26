/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosinstance";

export const BydSaleService = {
    create: (data: any) => axiosInstance.post("/byd-sales", data),

    getAll: (status?: string, userId?: number, userRole?: string, filters?: any) =>
        axiosInstance.get("/byd-sales", {
            params: {
                ...(status ? { status } : {}),
                ...(userId ? { userId } : {}),
                ...(userRole ? { userRole } : {}),
                ...filters
            },
        }),

    getById: (id: string | number) =>
        axiosInstance.get(`/byd-sales/${id}`),

    getByTicket: (ticketNumber: string) =>
        axiosInstance.get(`/byd-sales/ticket/${ticketNumber}`),

    updateStatus: (id: number, status: string) =>
        axiosInstance.put(`/byd-sales/${id}/status`, { status }),

    updatePriority: (id: number, priority: number) =>
        axiosInstance.put(`/byd-sales/${id}/priority`, { priority }),

    assign: (id: number, salesUserId: number) =>
        axiosInstance.put(`/byd-sales/${id}/assign`, { salesUserId }),

    promote: (id: number, userId: number) =>
        axiosInstance.put(`/byd-sales/${id}/promote`, { userId }),

    getHistory: (id: number) =>
        axiosInstance.get(`/byd-sales/${id}/history`),

    getNearestReminders: (userId: number) =>
        axiosInstance.get(`/byd-sales/sales-user/${userId}/reminders/nearest`),


    // Followups
    followUpCreate: (data: any) => axiosInstance.post("/byd-sales/followups", data),

    followUpGetBySaleId: (bydSaleId: number) =>
        axiosInstance.get(`/byd-sales/followups/sale/${bydSaleId}`),

    followUpDelete: (id: number) => axiosInstance.delete(`/byd-sales/followups/${id}`),


    // Reminders
    reminderCreate: (data: any) => axiosInstance.post("/byd-sales/reminders", data),

    reminderGetBySaleId: (bydSaleId: number) =>
        axiosInstance.get(`/byd-sales/reminders/sale/${bydSaleId}`),

    reminderDelete: (id: number) => axiosInstance.delete(`/byd-sales/reminders/${id}`),

    // Unavailable
    createUnavailable: (data: any) => axiosInstance.post("/byd-sales/unavailable", data),

    getUnavailable: (page = 1, limit = 10) => axiosInstance.get("/byd-sales/unavailable", {
        params: { page, limit }
    }),
};
