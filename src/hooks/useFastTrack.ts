/* eslint-disable @typescript-eslint/no-explicit-any */

// import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
// import {fastTrackService} from "@/services/fastTrack.service";
//
// export const useDirectRequests = () =>
//     useQuery({
//         queryKey: ["directRequests"],
//         queryFn: () => fastTrackService.listDirectRequests().then(res => res.data),
//     });
//
// export const useCreateDirectRequest = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: any) => fastTrackService.createDirectRequest(data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["directRequests"]});
//         },
//     });
// };
//
// export const useFastTrackSales = () =>
//     useQuery({
//         queryKey: ["sales"],
//         queryFn: () => fastTrackService.listSales().then(res => res.data),
//     });
//
//
// export const useUpdateSaleStatus = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ saleId, status }: { saleId: string; status: string }) =>
//             fastTrackService.updateSaleStatus(saleId, status),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["sales"] });
//         },
//     });
// };
//
// export const useRemindersByDirectRequest = (directRequestId: string) =>
//     useQuery({
//         queryKey: ["reminders", directRequestId],
//         queryFn: () =>
//             fastTrackService.getRemindersByDirectRequest(directRequestId).then(res => res.data),
//         enabled: !!directRequestId,
//     });
//
// export const useRemindersBySale = (saleId: string) =>
//     useQuery({
//         queryKey: ["saleReminders", saleId],
//         queryFn: () => fastTrackService.getRemindersBySale(saleId).then(res => res.data),
//         enabled: !!saleId,
//     });
//
// export const useCreateReminder = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: any) => fastTrackService.createReminder(data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["reminders"]});
//         },
//     });
// };
//
// export const useBestMatches = (directRequestId: string) =>
//     useQuery({
//         queryKey: ["bestMatches", directRequestId],
//         queryFn: () => fastTrackService.getBestMatches(directRequestId).then(res => res.data),
//         enabled: !!directRequestId,
//     });
//
// export const useVehicleDetails = (vehicleId: string) =>
//     useQuery({
//         queryKey: ["vehicleDetails", vehicleId],
//         queryFn: () => fastTrackService.getVehicleDetails(vehicleId).then(res => res.data),
//         enabled: !!vehicleId,
//     });
//
// export const useAssignSale = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (params: { directRequestId: string; vehicleId: string; data: any }) =>
//             fastTrackService.assignSale(params.directRequestId, params.vehicleId, params.data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["directRequests"]});
//             queryClient.invalidateQueries({queryKey: ["sales"]});
//         },
//     });
// };
//
// export const useAssignToMe = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (saleId: string) => fastTrackService.assignToMe(saleId),
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["sales"]});
//         },
//     });
// };
//
// export const useSaleByTicket = (ticket: string) =>
//     useQuery({
//         queryKey: ["saleByTicket", ticket],
//         queryFn: () => fastTrackService.getSaleByTicket(ticket).then(res => res.data),
//         enabled: !!ticket,
//     });
//
//
// export const useCreateFollowup = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: any) => fastTrackService.createFollowup(data),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({queryKey: ["followups", variables.saleId]});
//         },
//     });
// };
//
// export const useFollowupsBySale = (saleId: string) =>
//     useQuery({
//         queryKey: ["followups", saleId],
//         queryFn: () => fastTrackService.getFollowupsBySale(saleId).then(res => res.data),
//         enabled: !!saleId,
//     });
//
//
// export const useNearestReminders = (userId: number) =>
//     useQuery({
//         queryKey: ["sales", "reminders", userId],
//         queryFn: async () => {
//             const res = await fastTrackService.getNearestReminders(userId);
//             return res.data ?? {};
//         },
//         enabled: !!userId,
//     });

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FastTrackService } from "@/services/fastTrack.service";


export const useCreateDirectRequest = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => FastTrackService.createDirectRequest(payload),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ["directRequests"] })
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
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            FastTrackService.addDirectRequestReminder(id, payload),
        onSuccess: (_d, vars) =>
            qc.invalidateQueries({ queryKey: ["directReminders", vars.id] })
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

/* --------------------------- BEST MATCH --------------------------- */

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

/* ------------------------------- SALES ------------------------------- */

export const useSales = (params?: any) => {
    return useQuery({
        queryKey: ["sales", params],
        queryFn: () => FastTrackService.listSales(params)
    });
};

export const useClaimSaleLead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, userId }: { saleId: number; userId: number }) =>
            FastTrackService.claimSaleLead(saleId, userId),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ["sales"] })
    });
};

export const useUpdateSaleStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, status }: { saleId: number; status: string }) =>
            FastTrackService.updateSaleStatus(saleId, status),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ["sales"] })
    });
};

export const useUpdateSalePriority = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, priority }: { saleId: number; priority: number }) =>
            FastTrackService.updateSalePriority(saleId, priority),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ["sales"] })
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
