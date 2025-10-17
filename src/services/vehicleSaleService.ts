import axiosInstance from "@/utils/axiosinstance";

export const vehicleSaleService = {
    createSale: async (data: any) => {
        const res = await axiosInstance.post(`/vehicle-sales`, data);
        return res.data;
    },

    getSales: async (status?: string) => {
        const res = await axiosInstance.get(`/vehicle-sales`, {
            params: status ? { status } : {},
        });
        return res.data;
    },

    assignSale: async (id: string, salesUserId: string) => {
        const res = await axiosInstance.put(`/vehicle-sales/${id}/assign`, { salesUserId });
        return res.data;
    },

    updateSaleStatus: async (id: string, status: string) => {
        const res = await axiosInstance.put(`/vehicle-sales/${id}/status`, { status });
        return res.data;
    },
};
