/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const ComplaintReminderService = {
    getAll: async () => {
        const res = await axiosInstance.get("/complaint-reminders");
        return res.data;
    },

    getByComplaint: async (complaintId: number) => {
        const res = await axiosInstance.get(`/complaint-reminders/complaint/${complaintId}`);
        return res.data;
    },

    getNearest: async () => {
        const res = await axiosInstance.get("/complaint-reminders/nearest");
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosInstance.post("/complaint-reminders", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosInstance.put(`/complaint-reminders/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/complaint-reminders/${id}`);
        return res.data;
    },
};
