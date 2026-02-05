/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { VehicleSaleService } from "@/services/vehicleSaleService";

export const useVehicleSales = (status?: string, userId?: number, userRole?: string, filters?: any) =>
    useQuery({
        queryKey: ["vehicleSales", status, userId, userRole, filters],
        queryFn: () => VehicleSaleService.getAll(status, userId, userRole, filters).then((res) => res.data),
        refetchInterval: 1000,
        placeholderData: keepPreviousData,
    });

export const useCreateVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VehicleSaleService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
        },
    });
};

export const useVehicleSaleByTicket = (ticketNumber?: string) =>
    useQuery({
        queryKey: ["vehicleSale", "ticket", ticketNumber],
        queryFn: () =>
            VehicleSaleService.getByTicket(ticketNumber!).then((res) => res.data),
        enabled: !!ticketNumber,
        refetchInterval: 1000,
    });

export const useVehicleSalesByStatus = (status: string) =>
    useQuery({
        queryKey: ["vehicleSalesByStatus", status],
        queryFn: () => VehicleSaleService.getByStatus(status).then((res) => res.data),
        enabled: !!status,
    });

export const useAssignVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, salesUserId }: { id: number; salesUserId: number }) =>
            VehicleSaleService.assign(id, salesUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
        },
    });
};

export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            VehicleSaleService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
        },
    });
};

export const useDeleteVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
        },
    });
};


export const useFollowupsBySaleId = (vehicleSaleId?: number) =>
    useQuery({
        queryKey: ["followups", vehicleSaleId],
        queryFn: () => VehicleSaleService.followUpGetBySaleId(vehicleSaleId!).then((res) => res.data),
        enabled: !!vehicleSaleId,
    });

export const useFollowupsByTicket = (ticketNumber?: string) =>
    useQuery({
        queryKey: ["followups", "ticket", ticketNumber],
        queryFn: () => VehicleSaleService.followUpGetByTicket(ticketNumber!).then((res) => res.data),
        enabled: !!ticketNumber,
    });

export const useCreateFollowup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VehicleSaleService.followUpCreate,
        onSuccess: (_, variables) => {
            if (variables.vehicleSaleId)
                queryClient.invalidateQueries({ queryKey: ["followups", variables.vehicleSaleId] });
        },
    });
};

export const useDeleteFollowup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.followUpDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["followups"] });
        },
    });
};


export const useRemindersBySaleId = (vehicleSaleId?: number) =>
    useQuery({
        queryKey: ["reminders", vehicleSaleId],
        queryFn: () => VehicleSaleService.reminderGetBySaleId(vehicleSaleId!).then((res) => res.data),
        enabled: !!vehicleSaleId,
    });

export const useRemindersByTicket = (ticketNumber?: string) =>
    useQuery({
        queryKey: ["reminders", "ticket", ticketNumber],
        queryFn: () => VehicleSaleService.reminderGetByTicket(ticketNumber!).then((res) => res.data),
        enabled: !!ticketNumber,
    });

export const useCreateReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VehicleSaleService.reminderCreate,
        onSuccess: (_, variables) => {
            if (variables.vehicleSaleId)
                queryClient.invalidateQueries({ queryKey: ["reminders", variables.vehicleSaleId] });
        },
    });
};

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.reminderDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
    });
};

export const useNearestReminders = (userId: number) =>
    useQuery({
        queryKey: ["vehicleSales", "reminders", userId],
        queryFn: async () => {
            const res = await VehicleSaleService.getNearestReminders(userId);
            return res.data ?? {};
        },
        enabled: !!userId,
    });


export const useUpdatePriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, priority }: { id: number; priority: number }) =>
            VehicleSaleService.updatePriority(id, { priority }),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
            queryClient.invalidateQueries({ queryKey: ["vehicleSale", variables.id] });
        },
    });
};


export const usePromoteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            VehicleSaleService.promote(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicleSales"] });
            queryClient.invalidateQueries({ queryKey: ["vehicleSale"] });
            queryClient.invalidateQueries({ queryKey: ["saleHistory"] });
        },
    });
};

export const useSaleHistory = (saleId: number) =>
    useQuery({
        queryKey: ["saleHistory", saleId],
        queryFn: () => VehicleSaleService.getHistory(saleId).then(res => res.data),
        enabled: !!saleId
    });
