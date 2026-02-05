/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

const API_URL = "/complaints";

export const complaintService = {
    create: async (data: any) => {
        const res = await axiosInstance.post(API_URL, data);
        return res.data;
    },

    getAll: async (filters?: any) => {
        const params = new URLSearchParams(filters).toString();
        const res = await axiosInstance.get(`${API_URL}${params ? `?${params}` : ""}`);
        return res.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        return res.data;
    },

    getByContact: async (phoneNumber: string) => {
        const res = await axiosInstance.get(`${API_URL}/customer/${phoneNumber}`);
        return res.data;
    },

    update: async (id: number, data: any) => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data);
        return res.data;
    },
};
