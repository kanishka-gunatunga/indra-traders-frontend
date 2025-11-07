/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const handleServiceIntake = async (data: any) => {
    const res = await axiosInstance.post("/service-park/intake", data);
    return res.data;
};


export const createAssignToSale = async (data: any) => {
    const res = await axiosInstance.post("/service-park/assign-to-sales", data);
    return res.data;
};

export const listVehicleSales = async () => {
    const res = await axiosInstance.get("/service-park/sales");
    return res.data;
};

export const assignToSalesAgent = async (saleId: number, userId: number) => {
    const res = await axiosInstance.put(`/service-park/assign-to-sales/${saleId}/assign`, {userId});
    return res.data;
};

export const updateStatus = async (id: number, data: { status: "WON" | "LOST" }) => {
    const res = await axiosInstance.put(`/service-park/sales/${id}/status`, data);
    return res.data;
};

export const getSaleDetailsByTicket = async (ticketNumber: string) => {
    const res = await axiosInstance.get(`/service-park/sales/${ticketNumber}`);
    return res.data;
};

export const getSaleDetails = async (saleId: string) => {
    const res = await axiosInstance.get(`/service-park/sales/${saleId}`);
    return res.data;
};


export const getVehicleHistoryByNumber = async (vehicleNo: string) => {
    const res = await axiosInstance.get(`/service-park/vehicles/${vehicleNo}`);
    return res.data;
};


export const listVehicleHistories = async () => {
    const res = await axiosInstance.get("/service-park/vehicles");
    return res.data;
};


export const createFollowup = async (data: any) => {
    const res = await axiosInstance.post("/service-park/followups", data);
    return res.data;
};

export const createReminder = async (data: any) => {
    const res = await axiosInstance.post("/service-park/reminders", data);
    return res.data;
};


export const getNearestReminders = async (userId: number) => {
    const res = await axiosInstance.get(`/service-park/sales-user/${userId}/reminders/nearest`);
    return res.data;
};

export const updatePriority = async (id: number, data: { priority: number }) => {
    return await axiosInstance.put(`/service-park/priority/${id}`, data);
}
