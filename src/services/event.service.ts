/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const EventService = {
    getAll: async () => {
        const res = await axiosInstance.get("/events");
        return res.data;
    },

    getById: async (id: number)=> {
        const res = await axiosInstance.get(`/events/${id}`);
        return res.data;
    },

    getByCustomer: async (customerId: string)=> {
        const res = await axiosInstance.get(`/events/customer/${customerId}`);
        return res.data;
    },

    create: async (data: any) => {
        const res = await axiosInstance.post("/events", data);
        return res.data;
    },

    update: async (id: number, data:any) => {
        const res = await axiosInstance.put(`/events/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/events/${id}`);
        return res.data;
    },
};
