/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

export const FastTrackService = {

    createDirectRequest(payload: any) {
        return axiosInstance.post("/fast-track/direct-requests", payload).then(r => r.data);
    },

    listDirectRequests: async () => {
        return axiosInstance.get("/fast-track/direct-requests").then(r => r.data);
    },

    addDirectRequestReminder(directRequestId: number, payload: any) {
        return axiosInstance.post(
            `/fast-track/direct-requests/${directRequestId}/reminders`,
            payload
        ).then(r => r.data);
    },

    getDirectReminders: async (directRequestId?: number) => {
        return axiosInstance.get(
            `/fast-track/direct-requests/${directRequestId}/reminders`
        ).then(r => r.data);
    },

    getAllDirectReminders: async () => { // NEW: Get all
        const res = await axiosInstance.get("/fast-track/direct-requests/reminders");
        return res.data;
    },

    getBestMatches: async (directRequestId: number) => { // NEW: Get list with vehicles
        const res = await axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/best-matches`);
        return res.data;
    },

    buildBestMatches(directRequestId: number) {
        return axiosInstance.post(`/fast-track/direct-requests/${directRequestId}/best-matches/build`); // FIXED: Added /build
    },

    listBestMatches(directRequestId: number) {
        return axiosInstance.get(
            `/fast-track/direct-requests/${directRequestId}/best-matches`
        ).then(r => r.data);
    },

    getVehicleDetails(vehicleId: number) {
        return axiosInstance.get(
            `/fast-track/vehicles/${vehicleId}`
        ).then(r => r.data);
    },

    assignBestMatchToSale(directRequestId: number, vehicleId: number, payload: any) {
        return axiosInstance.post(
            `/fast-track/direct-requests/${directRequestId}/assign/${vehicleId}`,
            payload
        );
    },


    listSales(params?: any) {
        return axiosInstance.get("/fast-track/sales", { params }).then(r => r.data);
    },

    claimSaleLead(saleId: number, userId: number) {
        return axiosInstance.post(`/fast-track/sales/${saleId}/claim`, { userId }).then(r => r.data);
    },

    updateSaleStatus(saleId: string, status: string) {
        return axiosInstance.patch(`/fast-track/sales/${saleId}/status`, { status }).then(r => r.data);
    },

    updateSalePriority(saleId: number, priority: number) {
        return axiosInstance.patch(`/fast-track/sales/${saleId}/priority`, { priority }).then(r => r.data);
    },

    getSaleByTicket(ticket: string) {
        return axiosInstance.get(`/fast-track/sales/ticket/${ticket}`).then(r => r.data);
    },

    createSaleFollowup(payload: any) {
        return axiosInstance.post("/fast-track/sales/followups", payload).then(r => r.data);
    },

    getSaleFollowups(saleId: number) {
        return axiosInstance.get(`/fast-track/sales/${saleId}/followups`).then(r => r.data);
    },

    createSaleReminder(payload: any) {
        return axiosInstance.post("/fast-track/sales/reminders", payload).then(r => r.data);
    },

    getSaleReminders(saleId: number) {
        return axiosInstance.get(`/fast-track/sales/${saleId}/reminders`).then(r => r.data);
    }
};
