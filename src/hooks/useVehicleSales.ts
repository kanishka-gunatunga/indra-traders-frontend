import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {VehicleSaleService} from "@/services/vehicleSaleService";

export const useVehicleSales = (status?: string) =>
    useQuery({
        queryKey: ["vehicleSales", status],
        queryFn: () => VehicleSaleService.getAll(status).then((res) => res.data),
    });

export const useCreateVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VehicleSaleService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["vehicleSales"]});
        },
    });
};

export const useVehicleSaleByTicket = (ticketNumber?: string) =>
    useQuery({
        queryKey: ["vehicleSale", "ticket", ticketNumber],
        queryFn: () =>
            VehicleSaleService.getByTicket(ticketNumber!).then((res) => res.data),
        enabled: !!ticketNumber,
    });

export const useAssignVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, salesUserId}: { id: number; salesUserId: number }) =>
            VehicleSaleService.assign(id, salesUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["vehicleSales"]});
        },
    });
};

export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, status}: { id: number; status: string }) =>
            VehicleSaleService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["vehicleSales"]});
        },
    });
};

export const useDeleteVehicleSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["vehicleSales"]});
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
                queryClient.invalidateQueries({queryKey: ["followups", variables.vehicleSaleId]});
        },
    });
};

export const useDeleteFollowup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.followUpDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["followups"]});
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
                queryClient.invalidateQueries({queryKey: ["reminders", variables.vehicleSaleId]});
        },
    });
};

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => VehicleSaleService.reminderDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["reminders"]});
        },
    });
};
