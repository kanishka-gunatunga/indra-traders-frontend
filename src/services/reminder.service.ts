import { Reminder } from "@/types/reminder.types";
import axiosInstance from "@/utils/axiosinstance";

export const ReminderService = {
    getAll: async (): Promise<Reminder[]> => {
        const res = await axiosInstance.get("/reminders");
        return res.data;
    },

    getByComplaint: async (complaintId: number): Promise<Reminder[]> => {
        const res = await axiosInstance.get(`/reminders/complaint/${complaintId}`);
        return res.data;
    },

    create: async (data: Partial<Reminder>) => {
        const res = await axiosInstance.post("/reminders", data);
        return res.data;
    },

    update: async (id: number, data: Partial<Reminder>) => {
        const res = await axiosInstance.put(`/reminders/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/reminders/${id}`);
        return res.data;
    },
};
