/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosinstance";

export const VehicleSaleService = {
    create: (data: any) => axiosInstance.post("/vehicle-sales", data),

    getAll: (status?: string) =>
        axiosInstance.get("/vehicle-sales", {
            params: status ? {status} : {},
        }),

    getByStatus: (status: string) =>
        axiosInstance.get(`/vehicle-sales/status/${status}`),

    getByTicket: (ticketNumber: string) =>
        axiosInstance.get(`/vehicle-sales/ticket/${ticketNumber}`),

    assign: (id: number, salesUserId: number) =>
        axiosInstance.put(`/vehicle-sales/${id}/assign`, {salesUserId}),

    updateStatus: (id: number, status: string) =>
        axiosInstance.put(`/vehicle-sales/${id}/status`, {status}),

    delete: (id: number) => axiosInstance.delete(`/vehicle-sales/${id}`),


    followUpCreate: (data: any) => axiosInstance.post("/vehicle-sales-followups", data),

    followUpGetBySaleId: (vehicleSaleId: number) =>
        axiosInstance.get(`/vehicle-sales-followups/${vehicleSaleId}`),

    followUpGetByTicket: (ticketNumber: string) =>
        axiosInstance.get(`/vehicle-sales-followups/ticket/${ticketNumber}`),

    followUpDelete: (id: number) => axiosInstance.delete(`/vehicle-sales-followups/${id}`),


    reminderCreate: (data: any) => axiosInstance.post("/vehicle-sales-reminders", data),

    reminderGetBySaleId: (vehicleSaleId: number) =>
        axiosInstance.get(`/vehicle-sales-reminders/${vehicleSaleId}`),

    reminderGetByTicket: (ticketNumber: string) =>
        axiosInstance.get(`/vehicle-sales-reminders/ticket/${ticketNumber}`),

    reminderDelete: (id: number) => axiosInstance.delete(`/vehicle-sales-reminders/${id}`),

    getNearestReminders :(userId: number) =>
        axiosInstance.get(`/vehicle-sales/sales-user/${userId}/reminders/nearest`),

    updatePriority(id: number, data: { priority: number }) {
        return axiosInstance.put(`/vehicle-sales/priority/${id}`, data);
    }
};