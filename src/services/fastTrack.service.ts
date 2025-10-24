import axiosInstance from "@/utils/axiosinstance";

export const fastTrackService = {

    createDirectRequest: (data: any) =>
        axiosInstance.post("/fast-track/direct-requests", data),

    listSales: () =>
        axiosInstance.get("/fast-track/sales"),

    updateSaleStatus: (saleId: string, status: string) =>
        axiosInstance.put(`/fast-track/sales/${saleId}/status`, { status }),

    listDirectRequests: () =>
        axiosInstance.get("/fast-track/direct-requests"),

    createReminder: (data: any) =>
        axiosInstance.post("/fast-track/reminders", data),

    getRemindersByDirectRequest: (directRequestId: string) =>
        axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/reminders`),

    getRemindersBySale: (saleId: string) =>
        axiosInstance.get(`/fast-track/sales/${saleId}/reminders`),

    getBestMatches: (directRequestId: string) =>
        axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/best-matches`),

    getVehicleDetails: (vehicleId: string) =>
        axiosInstance.get(`/fast-track/vehicles/${vehicleId}`),

    assignSale: (directRequestId: string, vehicleId: string, data: any) =>
        axiosInstance.post(`/fast-track/direct-requests/${directRequestId}/vehicles/${vehicleId}/assign`, data),

    assignToMe: (saleId: string) =>
        axiosInstance.put(`/fast-track/sales/${saleId}/assign-to-me`),

    getSaleByTicket: (ticket: string) =>
        axiosInstance.get(`/fast-track/sales/ticket/${ticket}`),

    createFollowup: (data: any) =>
        axiosInstance.post("/fast-track/followups", data),

    getFollowupsBySale: (saleId: string) =>
        axiosInstance.get(`/fast-track/sales/${saleId}/followups`),
};