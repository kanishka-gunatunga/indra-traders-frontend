import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fastTrackService} from "@/services/fastTrack.service";
import {SparePartSalesService} from "@/services/sparePartSalesService";

export const useDirectRequests = () =>
    useQuery({
        queryKey: ["directRequests"],
        queryFn: () => fastTrackService.listDirectRequests().then(res => res.data),
    });

export const useCreateDirectRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => fastTrackService.createDirectRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["directRequests"]});
        },
    });
};

export const useFastTrackSales = () =>
    useQuery({
        queryKey: ["sales"],
        queryFn: () => fastTrackService.listSales().then(res => res.data),
    });


export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, status }: { saleId: string; status: string }) =>
            fastTrackService.updateSaleStatus(saleId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
    });
};

export const useRemindersByDirectRequest = (directRequestId: string) =>
    useQuery({
        queryKey: ["reminders", directRequestId],
        queryFn: () =>
            fastTrackService.getRemindersByDirectRequest(directRequestId).then(res => res.data),
        enabled: !!directRequestId,
    });

export const useRemindersBySale = (saleId: string) =>
    useQuery({
        queryKey: ["saleReminders", saleId],
        queryFn: () => fastTrackService.getRemindersBySale(saleId).then(res => res.data),
        enabled: !!saleId,
    });

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => fastTrackService.createReminder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["reminders"]});
        },
    });
};

export const useBestMatches = (directRequestId: string) =>
    useQuery({
        queryKey: ["bestMatches", directRequestId],
        queryFn: () => fastTrackService.getBestMatches(directRequestId).then(res => res.data),
        enabled: !!directRequestId,
    });

export const useVehicleDetails = (vehicleId: string) =>
    useQuery({
        queryKey: ["vehicleDetails", vehicleId],
        queryFn: () => fastTrackService.getVehicleDetails(vehicleId).then(res => res.data),
        enabled: !!vehicleId,
    });

export const useAssignSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { directRequestId: string; vehicleId: string; data: any }) =>
            fastTrackService.assignSale(params.directRequestId, params.vehicleId, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["directRequests"]});
            queryClient.invalidateQueries({queryKey: ["sales"]});
        },
    });
};

export const useAssignToMe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (saleId: string) => fastTrackService.assignToMe(saleId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["sales"]});
        },
    });
};

export const useSaleByTicket = (ticket: string) =>
    useQuery({
        queryKey: ["saleByTicket", ticket],
        queryFn: () => fastTrackService.getSaleByTicket(ticket).then(res => res.data),
        enabled: !!ticket,
    });


export const useCreateFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => fastTrackService.createFollowup(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ["followups", variables.saleId]});
        },
    });
};

export const useFollowupsBySale = (saleId: string) =>
    useQuery({
        queryKey: ["followups", saleId],
        queryFn: () => fastTrackService.getFollowupsBySale(saleId).then(res => res.data),
        enabled: !!saleId,
    });


export const useNearestReminders = (userId: number) =>
    useQuery({
        queryKey: ["sales", "reminders", userId],
        queryFn: async () => {
            const res = await fastTrackService.getNearestReminders(userId);
            return res.data ?? {};
        },
        enabled: !!userId,
    });
