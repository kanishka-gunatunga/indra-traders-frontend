import {Reminder} from "@/types/reminder.types";
import axiosInstance from "@/utils/axiosinstance";

export const ComplaintReminderService = {
    getAll: async (): Promise<Reminder[]> => {
        const res = await axiosInstance.get("/complaint-reminders");
        return res.data;
    },

    getByComplaint: async (complaintId: number): Promise<Reminder[]> => {
        const res = await axiosInstance.get(`/complaint-reminders/complaint/${complaintId}`);
        return res.data;
    },

    create: async (data: Partial<Reminder>) => {
        const res = await axiosInstance.post("/complaint-reminders", data);
        return res.data;
    },

    update: async (id: number, data: Partial<Reminder>) => {
        const res = await axiosInstance.put(`/complaint-reminders/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/complaint-reminders/${id}`);
        return res.data;
    },
};
