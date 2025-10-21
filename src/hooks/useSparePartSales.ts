import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {SparePartSalesService} from "@/services/sparePartSalesService";

export const useSpareSales = (filters?: Record<string, any>) =>
    useQuery({
        queryKey: ["spareSales", filters],
        queryFn: () => SparePartSalesService.listSales(filters).then((res) => res.data),
    });

export const useSpareCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: SparePartSalesService.createSale,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["spareSales"]});
        },
    });
};

export const useSpareSaleByTicket = (ticket: string) =>
    useQuery({
        queryKey: ["spareSale", ticket],
        queryFn: () => SparePartSalesService.getSaleByTicket(ticket).then((res) => res.data),
        enabled: !!ticket,
    });

export const useAssignToSpareSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, salesUserId}: { id: number; salesUserId: number }) =>
            SparePartSalesService.assignToSales(id, {salesUserId}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["spareSales"]});
        },
    });
};

export const useAssignToMe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, userId}: { id: number; userId: number }) =>
            SparePartSalesService.assignToMe(id, {userId}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["spareSales"]});
        },
    });
};

export const useCreateFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SparePartSalesService.createFollowup,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ["spareFollowups", variables.spare_part_sale_id]});
        },
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SparePartSalesService.createReminder,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ["spareReminders", variables.spare_part_sale_id]});
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
