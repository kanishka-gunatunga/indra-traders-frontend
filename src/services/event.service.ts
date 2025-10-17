import {Event} from "@/types/event.types";
import axiosInstance from "@/utils/axiosinstance";

export const EventService = {
    getAll: async (): Promise<Event[]> => {
        const res = await axiosInstance.get("/events");
        return res.data;
    },

    getById: async (id: number): Promise<Event> => {
        const res = await axiosInstance.get(`/events/${id}`);
        return res.data;
    },

    getByCustomer: async (customerId: string): Promise<Event[]> => {
        const res = await axiosInstance.get(`/events/customer/${customerId}`);
        return res.data;
    },

    create: async (data: Partial<Event>) => {
        const res = await axiosInstance.post("/events", data);
        return res.data;
    },

    update: async (id: number, data: Partial<Event>) => {
        const res = await axiosInstance.put(`/events/${id}`, data);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await axiosInstance.delete(`/events/${id}`);
        return res.data;
    },
};
