/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosinstance";

// export const fastTrackService = {
//
//     createDirectRequest: (data: any) =>
//         axiosInstance.post("/fast-track/direct-requests", data),
//
//     listSales: () =>
//         axiosInstance.get("/fast-track/sales"),
//
//     updateSaleStatus: (saleId: string, status: string) =>
//         axiosInstance.put(`/fast-track/sales/${saleId}/status`, { status }),
//
//     listDirectRequests: () =>
//         axiosInstance.get("/fast-track/direct-requests"),
//
//     createReminder: (data: any) =>
//         axiosInstance.post("/fast-track/reminders", data),
//
//     getRemindersByDirectRequest: (directRequestId: string) =>
//         axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/reminders`),
//
//     getRemindersBySale: (saleId: string) =>
//         axiosInstance.get(`/fast-track/sales/${saleId}/reminders`),
//
//     getBestMatches: (directRequestId: string) =>
//         axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/best-matches`),
//
//     getVehicleDetails: (vehicleId: string) =>
//         axiosInstance.get(`/fast-track/vehicles/${vehicleId}`),
//
//     assignSale: (directRequestId: string, vehicleId: string, data: any) =>
//         axiosInstance.post(`/fast-track/direct-requests/${directRequestId}/vehicles/${vehicleId}/assign`, data),
//
//     assignToMe: (saleId: string) =>
//         axiosInstance.put(`/fast-track/sales/${saleId}/assign-to-me`),
//
//     getSaleByTicket: (ticket: string) =>
//         axiosInstance.get(`/fast-track/sales/ticket/${ticket}`),
//
//     createFollowup: (data: any) =>
//         axiosInstance.post("/fast-track/followups", data),
//
//     getFollowupsBySale: (saleId: string) =>
//         axiosInstance.get(`/fast-track/sales/${saleId}/followups`),
//
//     getNearestReminders :(userId: number) =>
//         axiosInstance.get(`/service-park/sales-user/${userId}/reminders/nearest`),
// };

// export const FastTrackService = {
//
//     /* -------------------------- DIRECT REQUESTS -------------------------- */
//
//     createDirectRequest(payload: any) {
//         return axiosInstance.post("/fast-track/direct-requests", payload);
//     },
//
//     listDirectRequests : async () => {
//         const res = await axiosInstance.get("/fast-track/direct-requests");
//         return res.data;
//     },
//
//     addDirectRequestReminder(directRequestId: number, payload: any) {
//         return axiosInstance.post(`/fast-track/direct-requests/${directRequestId}/reminders`, payload);
//     },
//
//     getDirectReminders: async (directRequestId?: number) => {
//         const res = await axiosInstance.get(`/fast-track/direct-requests/${directRequestId}/reminders`);
//         return res.data;
//     },
//
//     buildBestMatches(directRequestId: number) {
//         return axiosInstance.post(`/fast-track/direct-requests/${directRequestId}/best-matches`);
//     },
//
//     /* ---------------------------- BEST MATCH ----------------------------- */
//
//     getVehicleDetails(vehicleId: number) {
//         return axiosInstance.get(`/fast-track/vehicles/${vehicleId}`);
//     },
//
//     assignBestMatchToSale(directRequestId: number, vehicleId: number, payload: any) {
//         return axiosInstance.post(
//             `/fast-track/direct-requests/${directRequestId}/best-matches/${vehicleId}/assign`,
//             payload
//         );
//     },
//
//     /* ------------------------------- SALES ------------------------------- */
//
//     listSales(params: any) {
//         return axiosInstance.get("/fast-track/sales", {params});
//     },
//
//     claimSaleLead(saleId: number, userId: number) {
//         return axiosInstance.post(`/fast-track/sales/${saleId}/claim`, {userId});
//     },
//
//     updateSaleStatus(saleId: number, status: string) {
//         return axiosInstance.patch(`/fast-track/sales/${saleId}/status`, {status});
//     },
//
//     updateSalePriority(saleId: number, priority: number) {
//         return axiosInstance.patch(`/fast-track/sales/${saleId}/priority`, {priority});
//     },
//
//     getSaleByTicket(ticket: string) {
//         return axiosInstance.get(`/fast-track/sales/by-ticket/${ticket}`);
//     },
//
//     createSaleFollowup(payload: any) {
//         return axiosInstance.post("/fast-track/sales/followups", payload);
//     },
//
//     getSaleFollowups(saleId: number) {
//         return axiosInstance.get(`/fast-track/sales/${saleId}/followups`);
//     },
//
//     createSaleReminder(payload: any) {
//         return axiosInstance.post("/fast-track/sales/reminders", payload);
//     },
//
//     getSaleReminders(saleId: number) {
//         return axiosInstance.get(`/fast-track/sales/${saleId}/reminders`);
//     }
// };

export const FastTrackService = {

    /* -------------------------- DIRECT REQUESTS -------------------------- */

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

    /* ---------------------------- BEST MATCHES ---------------------------- */

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
            `/fast-track/direct-requests/${directRequestId}/assign/${vehicleId}`, // FIXED: Match route
            payload
        );
    },

    /* ------------------------------- SALES ------------------------------- */

    listSales(params?: any) {
        return axiosInstance.get("/fast-track/sales", { params }).then(r => r.data);
    },

    claimSaleLead(saleId: number, userId: number) {
        return axiosInstance.post(`/fast-track/sales/${saleId}/claim`, { userId }).then(r => r.data);
    },

    updateSaleStatus(saleId: number, status: string) {
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
