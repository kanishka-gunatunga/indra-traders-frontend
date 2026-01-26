/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosinstance";


export const createUnavailableVehicleSale = async (data: any) => {
    const res = await axiosInstance.post("/unavailable/vehicle-sales", data);
    return res.data;
};

export const fetchUnavailableVehicleSales = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get("/unavailable/vehicle-sales", {
        params: { page, limit }
    });
    return res.data;
};

export const fetchUnavailableVehicleSaleById = async (id: number | string) => {
    const res = await axiosInstance.get(`/unavailable/vehicle-sales/${id}`);
    return res.data;
};

export const createUnavailableService = async (data: any) => {
    const res = await axiosInstance.post("/unavailable/services", data);
    return res.data;
};

export const fetchUnavailableServices = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get("/unavailable/services", {
        params: { page, limit }
    });
    return res.data;
};

export const fetchUnavailableServiceById = async (id: number | string) => {
    const res = await axiosInstance.get(`/unavailable/services/${id}`);
    return res.data;
};

export const createUnavailableSparePart = async (data: any) => {
    const res = await axiosInstance.post("/unavailable/spare-parts", data);
    return res.data;
};

export const fetchUnavailableSpareParts = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get("/unavailable/spare-parts", {
        params: { page, limit }
    });
    return res.data;
};

export const fetchUnavailableSparePartById = async (id: number | string) => {
    const res = await axiosInstance.get(`/unavailable/spare-parts/${id}`);
    return res.data;
};