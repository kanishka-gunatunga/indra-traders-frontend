/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const SparePartSalesService = {
    createSale: (data: any) => axiosInstance.post("/spare-part-sales", data),

    listSales: (status?: string, userId?: number, userRole?: string) =>
        axiosInstance.get("/spare-part-sales", {
            params: {
                ...(status ? { status } : {}),
                ...(userId ? { userId } : {}),
                ...(userRole ? { userRole } : {})
            },
        }),

    getSaleByTicket: (ticket: string) =>
        axiosInstance.get(`/spare-part-sales/ticket/${ticket}`),

    assignToSales: (id: number, data: { salesUserId: number }) =>
        axiosInstance.put(`/spare-part-sales/${id}/assign`, data),

    assignToMe: (id: number, data: { userId: number }) =>
        axiosInstance.put(`/spare-part-sales/${id}/claim`, data),

    updateStatus: (id: number, data: { status: "WON" | "LOST" }) =>
        axiosInstance.put(`/spare-part-sales/${id}/status`, data),

    createFollowup: (data: any) =>
        axiosInstance.post("/spare-part-sales/followups", data),

    createReminder: (data: any) =>
        axiosInstance.post("/spare-part-sales/reminders", data),

    getFollowupsByTicket: (ticket: string) =>
        axiosInstance.get(`/spare-part-sales/${ticket}/followups`),

    getRemindersByTicket: (ticket: string) =>
        axiosInstance.get(`/spare-part-sales/${ticket}/reminders`),

    getNearestReminders: (userId: number) =>
        axiosInstance.get(`/spare-part-sales/sales-user/${userId}/reminders/nearest`),

    updatePriority(id: number, data: { priority: number }) {
        return axiosInstance.put(`/spare-part-sales/priority/${id}`, data);
    },

    promote: (id: number, userId: number) =>
        axiosInstance.put(`/spare-part-sales/${id}/promote`, { userId }),

    getHistory: (id: number) =>
        axiosInstance.get(`/spare-part-sales/${id}/history`),
};
