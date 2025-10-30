/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";


export const SparePartsService = {
    listParts: (params?: Record<string, any>) =>
        axiosInstance.get("/spare-parts", { params }),

    getStockAvailability: (sparePartId: number) =>
        axiosInstance.get(`/spare-parts/${sparePartId}/stocks`),

    getPromotions: (sparePartId: number) =>
        axiosInstance.get(`/spare-parts/${sparePartId}/promotions`),

    createSparePart: (data: any) => axiosInstance.post("/spare-parts", data),
};
