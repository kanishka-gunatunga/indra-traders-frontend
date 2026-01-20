import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BydSaleService } from "@/services/bydSaleService";

export const useBydSales = (status?: string, userId?: number, userRole?: string) => {
    return useQuery({
        queryKey: ["byd-sales", status, userId, userRole],
        queryFn: () => BydSaleService.getAll(status, userId, userRole).then((res) => res.data),
    });
};

export const useBydSaleById = (id: string) => {
    return useQuery({
        queryKey: ["byd-sale", id],
        queryFn: () => BydSaleService.getById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useBydSaleByTicket = (ticketNumber: string) => {
    return useQuery({
        queryKey: ["byd-sale", "ticket", ticketNumber],
        queryFn: () => BydSaleService.getByTicket(ticketNumber).then((res) => res.data),
        enabled: !!ticketNumber,
    });
};

export const useCreateBydSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: BydSaleService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["byd-sales"] });
        },
    });
};

export const useUpdateBydSaleStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            BydSaleService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["byd-sales"] });
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
        },
    });
};

export const useUpdateBydPriority = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, priority }: { id: number; priority: number }) =>
            BydSaleService.updatePriority(id, priority),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["byd-sales"] });
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
            queryClient.invalidateQueries({ queryKey: ["byd-sale", variables.id] });
        },
    });
};

export const useAssignBydSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, salesUserId }: { id: number; salesUserId: number }) =>
            BydSaleService.assign(id, salesUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["byd-sales"] });
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
        },
    });
};

export const usePromoteBydSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            BydSaleService.promote(id, userId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["byd-sales"] });
            queryClient.invalidateQueries({ queryKey: ["byd-sale", variables.id] }); // Invalidate specific sale
            queryClient.invalidateQueries({ queryKey: ["byd-sale-history", variables.id] });
        },
    });
};

export const useBydSaleHistory = (saleId: number) => {
    return useQuery({
        queryKey: ["byd-sale-history", saleId],
        queryFn: () => BydSaleService.getHistory(saleId).then((res) => res.data),
        enabled: !!saleId,
    });
};

export const useNearestBydReminders = (userId: number) => {
    return useQuery({
        queryKey: ["byd-sales", "reminders", userId],
        queryFn: () => BydSaleService.getNearestReminders(userId).then((res) => res.data ?? {}),
        enabled: !!userId,
    });
};

// Followups
export const useBydFollowupsBySaleId = (bydSaleId?: number) => {
    return useQuery({
        queryKey: ["byd-followups", bydSaleId],
        queryFn: () => BydSaleService.followUpGetBySaleId(bydSaleId!).then((res) => res.data),
        enabled: !!bydSaleId,
    });
};

export const useCreateBydFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: BydSaleService.followUpCreate,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] }); // Refresh the main sale query (often contains nested followups)
            if (variables.bydSaleId) {
                queryClient.invalidateQueries({ queryKey: ["byd-followups", variables.bydSaleId] });
            }
        },
    });
};

export const useDeleteBydFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => BydSaleService.followUpDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
            queryClient.invalidateQueries({ queryKey: ["byd-followups"] });
        },
    });
};

// Reminders
export const useBydRemindersBySaleId = (bydSaleId?: number) => {
    return useQuery({
        queryKey: ["byd-reminders", bydSaleId],
        queryFn: () => BydSaleService.reminderGetBySaleId(bydSaleId!).then((res) => res.data),
        enabled: !!bydSaleId,
    });
};

export const useCreateBydReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: BydSaleService.reminderCreate,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
            if (variables.bydSaleId) {
                queryClient.invalidateQueries({ queryKey: ["byd-reminders", variables.bydSaleId] });
            }
        },
    });
};

export const useDeleteBydReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => BydSaleService.reminderDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["byd-sale"] });
            queryClient.invalidateQueries({ queryKey: ["byd-reminders"] });
        },
    });
};
