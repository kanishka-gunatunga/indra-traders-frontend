/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import axiosInstance from "@/utils/axiosinstance";

export interface ActivityLogItem {
    id: number;
    user_id: number;
    user_role: string;
    department: string | null;
    module: string;
    action_type: string;
    entity_id: number;
    description: string;
    changes: any;
    created_at: string;
    user?: {
        id: number;
        full_name: string;
        email: string;
    };
}

export interface ActivityLogFilters {
    startDate?: string;
    endDate?: string;
    module?: string;
    userRole?: string;
    userId?: number;
}

export const activityLogService = {
    getAll: async (filters: ActivityLogFilters = {}) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );

        const res = await axiosInstance.get<ActivityLogItem[]>("/admin/activity-logs", { params });
        return res.data;
    },
};