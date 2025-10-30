/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";


export const userService = {
    login: async (email: string, password: string) => {
        const res = await axiosInstance.post("/users/login", { email, password });
        return res.data;
    },

    getUsers: async (filters?: {
        user_role?: string;
        department?: string;
        branch?: string;
    }) => {
        const params = new URLSearchParams(filters as any).toString();
        const res = await axiosInstance.get(`/users${params ? `?${params}` : ""}`);
        return res.data;
    },

    getUserById: async (id: string) => {
        const res = await axiosInstance.get(`/users/${id}`);
        return res.data;
    },

    createUser: async (data: any) => {
        const res = await axiosInstance.post("/users", data);
        return res.data;
    },

    updateUser: async (id: string, data: any) => {
        const res = await axiosInstance.put(`/users/${id}`, data);
        return res.data;
    },

    deleteUser: async (id: string) => {
        const res = await axiosInstance.delete(`/users/${id}`);
        return res.data;
    },
};
