/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { SparePartSalesService } from "@/services/sparePartSalesService";

export const useSpareSales = (status?: string, userId?: number, userRole?: string, filters?: any) =>
    useQuery({
        queryKey: ["spareSales", status, userId, userRole, filters],
        queryFn: () => SparePartSalesService.listSales(status, userId, userRole, filters).then((res) => res.data),
        refetchInterval: 1000,
        placeholderData: keepPreviousData,
    });

export const useSpareCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: SparePartSalesService.createSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
        },
    });
};

export const useSpareSaleByTicket = (ticket: string) =>
    useQuery({
        queryKey: ["spareSale", ticket],
        queryFn: () => SparePartSalesService.getSaleByTicket(ticket).then((res) => res.data),
        enabled: !!ticket,
        refetchInterval: 1000,
    });

export const useAssignToSpareSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, salesUserId }: { id: number; salesUserId: number }) =>
            SparePartSalesService.assignToSales(id, { salesUserId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
        },
    });
};

export const useAssignToMe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            SparePartSalesService.assignToMe(id, { userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
        },
    });
};

export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: "WON" | "LOST" }) =>
            SparePartSalesService.updateStatus(id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
            queryClient.invalidateQueries({ queryKey: ["spareSale", variables.id] });
        },
    });
};


export const useCreateFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SparePartSalesService.createFollowup,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["spareFollowups", variables.spare_part_sale_id] });
        },
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SparePartSalesService.createReminder,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["spareReminders", variables.spare_part_sale_id] });
        },
    });
};

export const useFollowupsByTicket = (ticket: string) =>
    useQuery({
        queryKey: ["spareFollowups", ticket],
        queryFn: () => SparePartSalesService.getFollowupsByTicket(ticket).then((res) => res.data),
        enabled: !!ticket,
    });

export const useRemindersByTicket = (ticket: string) =>
    useQuery({
        queryKey: ["spareReminders", ticket],
        queryFn: () => SparePartSalesService.getRemindersByTicket(ticket).then((res) => res.data),
        enabled: !!ticket,
    });

export const useNearestReminders = (userId: number) =>
    useQuery({
        queryKey: ["spareSales", "reminders", userId],
        queryFn: async () => {
            const res = await SparePartSalesService.getNearestReminders(userId);
            return res.data ?? {};
        },
        enabled: !!userId,
    });

export const useUpdatePriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, priority }: { id: number; priority: number }) =>
            SparePartSalesService.updatePriority(id, { priority }),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
            queryClient.invalidateQueries({ queryKey: ["spareSale", variables.id] });
        },
    });
};


export const usePromoteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            SparePartSalesService.promote(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spareSales"] });
            queryClient.invalidateQueries({ queryKey: ["spareSale"] });
            queryClient.invalidateQueries({ queryKey: ["saleHistory"] });
        },
    });
};

export const useSaleHistory = (saleId: number) =>
    useQuery({
        queryKey: ["saleHistory", saleId],
        queryFn: () => SparePartSalesService.getHistory(saleId).then(res => res.data),
        enabled: !!saleId
    });

