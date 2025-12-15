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

export const listVehicleSales = async (status?: string, userId?: number, userRole?: string) => {
    const res = await axiosInstance.get("/service-park/sales", {
        params: {
            ...(status ? {status} : {}),
            ...(userId ? {userId} : {}),
            ...(userRole ? {userRole} : {})
        },
    });
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

export const promote = async (id: number, userId: number) => {
    return await axiosInstance.put(`/service-park/${id}/promote`, {userId});
}

export const getHistory = async (id: number) => {
    return await axiosInstance.get(`/service-park/${id}/history`);
}


// --- SERVICES (Admin) ---
export const createService = async (data: { name: string; type: string; description?: string; base_price: number }) => {
    const res = await axiosInstance.post("/service-park/services", data);
    return res.data;
};

export const getAllServices = async () => {
    const res = await axiosInstance.get("/service-park/services");
    return res.data;
};

// --- PACKAGES ---
export const createPackage = async (data: { name: string; description?: string; serviceIds: number[] }) => {
    const res = await axiosInstance.post("/service-park/packages", data);
    return res.data;
};

// --- BRANCHES ---
export const createBranch = async (data: {
    name: string;
    location_code: string;
    contact_number: string;
    address: string
}) => {
    const res = await axiosInstance.post("/service-park/branches", data);
    return res.data;
};

export const listBranches = async () => {
    const res = await axiosInstance.get("/service-park/branches");
    return res.data;
};

export const getBranchDetails = async (id: number) => {
    const res = await axiosInstance.get(`/service-park/branches/${id}`);
    return res.data;
};

// --- BRANCH SPECIFIC (PRICING & LINES) ---
export const addServiceToBranch = async (branchId: number, data: { service_id: number; custom_price: number }) => {
    const res = await axiosInstance.post(`/service-park/branches/${branchId}/services`, data);
    return res.data;
};

export const createServiceLine = async (branchId: number, data: { name: string; type: string; advisor: number }) => {
    const res = await axiosInstance.post(`/service-park/branches/${branchId}/lines`, data);
    return res.data;
};