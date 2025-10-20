import { FollowUp } from "@/types/followup.types";
import axiosInstance from "@/utils/axiosinstance";

export const ComplaintFollowupService = {
    getAll: async (): Promise<FollowUp[]> => {
        const res = await axiosInstance.get("/complaint-followups");
        return res.data;
    },

    getByComplaint: async (complaintId: number): Promise<FollowUp[]> => {
        const res = await axiosInstance.get(`/complaint-followups/complaint/${complaintId}`);
        return res.data;
    },

    create: async (data: Partial<FollowUp>) => {
        const res = await axiosInstance.post("/complaint-followups", data);
        return res.data;
    },

    update: async (id: number, data: Partial<FollowUp>) => {
        const res = await axiosInstance.put(`/complaint-followups/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/complaint-followups/${id}`);
        return res.data;
    },
};
