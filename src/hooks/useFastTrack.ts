/* eslint-disable @typescript-eslint/no-explicit-any */

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {FastTrackService} from "@/services/fastTrack.service";


export const useCreateDirectRequest = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => FastTrackService.createDirectRequest(payload),
        onSuccess: () =>
            qc.invalidateQueries({queryKey: ["directRequests"]})
    });
};

export const useDirectRequests = () => {
    return useQuery({
        queryKey: ["directRequests"],
        queryFn: () => FastTrackService.listDirectRequests()
    });
};

export const useAddDirectReminder = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, payload}: { id: number; payload: any }) =>
            FastTrackService.addDirectRequestReminder(id, payload),
        onSuccess: (_d, vars) =>
            qc.invalidateQueries({queryKey: ["directReminders", vars.id]})
    });
};

export const useAllDirectReminders = () => { // NEW: For all reminders
    return useQuery({
        queryKey: ["allDirectReminders"],
        queryFn: () => FastTrackService.getAllDirectReminders()
    });
};

export const useDirectReminders = (id?: number) => {
    return useQuery({
        queryKey: ["directReminders", id],
        queryFn: () => FastTrackService.getDirectReminders(id),
        enabled: !!id
    });
};

export const useBuildBestMatches = () => {
    return useMutation({
        mutationFn: (directRequestId: number) =>
            FastTrackService.buildBestMatches(directRequestId)
    });
};

export const useBestMatches = (directRequestId?: number) => {
    return useQuery({
        queryKey: ["bestMatches", directRequestId],
        queryFn: () => FastTrackService.getBestMatches(directRequestId!), // CHANGED: Use new GET
        enabled: !!directRequestId
    });
};


export const useVehicleDetails = (vehicleId: number) => {
    return useQuery({
        queryKey: ["vehicleDetails", vehicleId],
        queryFn: () => FastTrackService.getVehicleDetails(vehicleId),
        enabled: !!vehicleId
    });
};

export const useAssignBestMatchToSale = () => {
    return useMutation({
        mutationFn: ({
                         directRequestId,
                         vehicleId,
                         payload
                     }: {
            directRequestId: number;
            vehicleId: number;
            payload: any;
        }) =>
            FastTrackService.assignBestMatchToSale(
                directRequestId,
                vehicleId,
                payload
            )
    });
};


export const useSales = (status?: string, userId?: number, userRole?: string) => {
    return useQuery({
        queryKey: ["sales", status, userId, userRole],
        queryFn: () => FastTrackService.listSales(status, userId, userRole)
    });
};

export const useClaimSaleLead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({saleId, userId}: { saleId: number; userId: number }) =>
            FastTrackService.claimSaleLead(saleId, userId),
        onSuccess: () =>
            qc.invalidateQueries({queryKey: ["sales"]})
    });
};

export const useUpdateSaleStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({saleId, status}: { saleId: string; status: string }) =>
            FastTrackService.updateSaleStatus(saleId, status),
        onSuccess: () =>
            qc.invalidateQueries({queryKey: ["sales"]})
    });
};

export const useUpdateSalePriority = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({saleId, priority}: { saleId: number; priority: number }) =>
            FastTrackService.updateSalePriority(saleId, priority),
        onSuccess: () =>
            qc.invalidateQueries({queryKey: ["sales"]})
    });
};

export const useSaleByTicket = (ticket: string) => {
    return useQuery({
        queryKey: ["saleByTicket", ticket],
        queryFn: () => FastTrackService.getSaleByTicket(ticket),
        enabled: !!ticket
    });
};

export const useCreateSaleFollowup = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            FastTrackService.createSaleFollowup(payload),
        onSuccess: (_d, vars: any) =>
            qc.invalidateQueries({
                queryKey: ["saleFollowups", vars.sale_id]
            })
    });
};

export const useSaleFollowups = (saleId: number) => {
    return useQuery({
        queryKey: ["saleFollowups", saleId],
        queryFn: () => FastTrackService.getSaleFollowups(saleId),
        enabled: !!saleId
    });
};

export const useCreateSaleReminder = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            FastTrackService.createSaleReminder(payload),
        onSuccess: (_d, vars: any) =>
            qc.invalidateQueries({
                queryKey: ["saleReminders", vars.sale_id]
            })
    });
};

export const useSaleReminders = (saleId: number) => {
    return useQuery({
        queryKey: ["saleReminders", saleId],
        queryFn: () => FastTrackService.getSaleReminders(saleId),
        enabled: !!saleId
    });
};


export const usePromoteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, userId}: { id: number; userId: number }) =>
            FastTrackService.promote(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["FastTracks"]});
            queryClient.invalidateQueries({queryKey: ["FastTrack"]});
            queryClient.invalidateQueries({queryKey: ["saleHistory"]});
        },
    });
};

export const useSaleHistory = (saleId: number) =>
    useQuery({
        queryKey: ["saleHistory", saleId],
        queryFn: () => FastTrackService.getHistory(saleId).then(res => res.data),
        enabled: !!saleId
    });



export const useCreateFastTrackSaleDirect = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: FastTrackService.createSaleDirect,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["sales"] });
        },
    });
};
