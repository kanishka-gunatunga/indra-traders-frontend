/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { LeadService } from "@/services/lead.service";
import { message } from "antd";

export const useLeads = (filters: any = {}) => {
    return useQuery({
        queryKey: ["all-leads", filters],
        queryFn: async () => {
            const response = await LeadService.getAllLeads(filters);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
};

export const useEligibleAgents = (department?: string, branch?: string, enabled: boolean = true, level?: number) => {
    return useQuery({
        queryKey: ["eligible-agents", department, branch, level],
        queryFn: async () => {
            const response = await LeadService.getEligibleAgents(department, branch, level);
            return response.data;
        },
        enabled: enabled,
    });
};

export const useAssignLead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { leadType: string, leadId: number | string, salesUserId: number, adminId?: number }) => LeadService.assignLead(data),
        onSuccess: () => {
            message.success("Lead assigned successfully");
            queryClient.invalidateQueries({ queryKey: ["all-leads"] });
            queryClient.invalidateQueries({ queryKey: ["vehicle-sale"] }); // Invalidate specific sale queries too if possible
            // We might need to invalidate specific sale queries, but "all-leads" is main one for admin.
            // For detail page, it uses "vehicle-sale" with ticket number usually.
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || "Failed to assign lead");
        },
    });
};
