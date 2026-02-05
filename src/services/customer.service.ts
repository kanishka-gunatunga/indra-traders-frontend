/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const fetchCustomers = async (page = 1, limit = 10, filters = {}) => {
    const res = await axiosInstance.get("/customers", {
        params: { page, limit, ...filters }
    });
    return res.data;
};

export const updateCustomer = async (id: string, data: any) => {
    const res = await axiosInstance.put(`/customers/${id}`, data);
    return res.data;
};
