/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const ComplaintFollowupService = {
    getAll: async () => {
        const res = await axiosInstance.get("/complaint-followups");
        return res.data;
    },

    getByComplaint: async (complaintId: number) => {
        const res = await axiosInstance.get(`/complaint-followups/complaint/${complaintId}`);
        return res.data;
    },

    create: async (data:any) => {
        const res = await axiosInstance.post("/complaint-followups", data);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosInstance.put(`/complaint-followups/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/complaint-followups/${id}`);
        return res.data;
    },
};
