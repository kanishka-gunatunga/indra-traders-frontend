import axiosInstance from "@/utils/axiosinstance";

export interface NotificationItem {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: "REMINDER" | "ASSIGNMENT" | "SYSTEM" | "ALERT";
    reference_id?: number;
    reference_module?: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationResponse {
    notifications: NotificationItem[];
    unreadCount: number;
}

export const notificationService = {
    getMyNotifications: async (userId: number) => {
        const { data } = await axiosInstance.get<NotificationResponse>(`/notification/${userId}`);
        return data;
    },

    markAsRead: async (notificationId: number, userId: number) => {
        const { data } = await axiosInstance.put(`/notification/${notificationId}/read/${userId}`);
        return data;
    }
};