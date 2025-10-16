import axios from "axios";
import { Complaint, CreateComplaintInput, UpdateComplaintInput } from "@/types/complaint.types";
import axiosInstance from "@/utils/axiosinstance";

const API_URL = "/complaints";

export const complaintService = {
    create: async (data: CreateComplaintInput): Promise<Complaint> => {
        const res = await axiosInstance.post(API_URL, data);
        return res.data;
    },

    getAll: async (): Promise<Complaint[]> => {
        const res = await axiosInstance.get(API_URL);
        return res.data;
    },

    getById: async (id: number): Promise<Complaint> => {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        return res.data;
    },

    getByContact: async (phoneNumber: string): Promise<Complaint[]> => {
        const res = await axiosInstance.get(`${API_URL}/customer/${phoneNumber}`);
        return res.data;
    },

    update: async (id: number, data: UpdateComplaintInput): Promise<Complaint> => {
        const res = await axiosInstance.put(`${API_URL}/${id}`, data);
        return res.data;
    },
};
