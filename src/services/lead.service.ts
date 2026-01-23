/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosinstance";

export const LeadService = {
    getAllLeads: () => axiosInstance.get("/leads"),
    getEligibleAgents: (department?: string, branch?: string, level?: number) => axiosInstance.get("/leads/agents", { params: { department, branch, level } }),
    assignLead: (data: { leadType: string, leadId: number | string, salesUserId: number, adminId?: number }) => axiosInstance.post("/leads/assign", data),
};
