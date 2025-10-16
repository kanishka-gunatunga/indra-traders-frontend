import { FollowUp } from "@/types/followup.types";
import axiosInstance from "@/utils/axiosinstance";

export const FollowUpService = {
    getAll: async (): Promise<FollowUp[]> => {
        const res = await axiosInstance.get("/followups");
        return res.data;
    },

    getByComplaint: async (complaintId: number): Promise<FollowUp[]> => {
        const res = await axiosInstance.get(`/followups/complaint/${complaintId}`);
        return res.data;
    },

    create: async (data: Partial<FollowUp>) => {
        const res = await axiosInstance.post("/followups", data);
        return res.data;
    },

    update: async (id: number, data: Partial<FollowUp>) => {
        const res = await axiosInstance.put(`/followups/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/followups/${id}`);
        return res.data;
    },
};
