/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
    addServiceToBranch,
    assignToSalesAgent,
    createAssignToSale,
    createBranch,
    createFollowup,
    createPackage,
    createReminder,
    createService,
    createServiceLine,
    getAllServices,
    getBranchDetails,
    getHistory,
    getNearestReminders,
    getSaleDetails,
    getSaleDetailsByTicket,
    getVehicleHistoryByNumber,
    handleServiceIntake,
    listBranches,
    listVehicleHistories,
    listVehicleSales,
    promote,
    updatePriority,
    updateStatus,
    getAllPackages,
    updatePackage,
    updateService,
    deletePackage,
    deleteService,
    updateBranch, deleteBranch, getBranchCatalog, validatePromo, getPromos, getDailyBookings, submitBooking,
    getBookingAvailability
} from "@/services/serviceParkService";


export const useVehicleHistories = () =>
    useQuery({
        queryKey: ["servicePark", "vehicleHistories"],
        queryFn: listVehicleHistories,
    });

export const useVehicleSales = (status?: string, userId?: number, userRole?: string, filters?: any) =>
    useQuery({
        queryKey: ["servicePark", "saleDetails", status, userId, userRole, filters],
        queryFn: async () => {
            const res = await listVehicleSales(status, userId, userRole, filters);
            return res.data;
        },
        refetchInterval: 1000,
        placeholderData: keepPreviousData,
    });

export const useSaleDetailsByTicketNumber = (ticketNumber: string) =>
    useQuery({
        queryKey: ["servicePark", "saleDetails", ticketNumber],
        queryFn: async () => {
            const data = await getSaleDetailsByTicket(ticketNumber);
            return data ?? {};
        },
        enabled: !!ticketNumber,
        refetchInterval: 1000,
    });

export const useVehicleHistoryByNumber = (vehicleNo: string) =>
    useQuery({
        queryKey: ["servicePark", "vehicleHistory", vehicleNo],
        queryFn: () => getVehicleHistoryByNumber(vehicleNo),
        enabled: !!vehicleNo,
    });


export const useSaleDetails = (saleId: string) =>
    useQuery({
        queryKey: ["servicePark", "saleDetails", saleId],
        queryFn: () => getSaleDetails(saleId),
        enabled: !!saleId,
    });

export const useNearestReminders = (userId: number) =>
    useQuery({
        queryKey: ["servicePark", "reminders", userId],
        queryFn: async () => {
            const res = await getNearestReminders(userId);
            return res.data ?? {};
        },
        enabled: !!userId,
    });


export const useServiceIntake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleServiceIntake,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["servicePark", "vehicleHistories"] });
        },
    });
};


export const useAssignToSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAssignToSale,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["servicePark", "vehicleHistories"] });
        },
    });
};


export const useAssignToSalesAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, userId }: { saleId: number; userId: number }) =>
            assignToSalesAgent(saleId, userId),
        onSuccess: (_, { saleId }) => {
            queryClient.invalidateQueries({ queryKey: ["servicePark", "saleDetails", saleId] });
        },
    });
};


export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: "WON" | "LOST" }) => updateStatus(id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["servicePark"] });
            queryClient.invalidateQueries({ queryKey: ["servicePark", variables.id] });
        },
    });
};

export const useCreateFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFollowup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["servicePark", "followups"] });
        },
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["servicePark", "reminders"] });
        },
    });
};

export const useUpdatePriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, priority }: { id: number; priority: number }) =>
            updatePriority(id, { priority }),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["serviceParks"] });
            queryClient.invalidateQueries({ queryKey: ["servicePark", variables.id] });
        },
    });
};


export const usePromoteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, userId }: { id: number; userId: number }) =>
            promote(id, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceParks"] });
            queryClient.invalidateQueries({ queryKey: ["servicePark"] });
            queryClient.invalidateQueries({ queryKey: ["saleHistory"] });
        },
    });
};

export const useSaleHistory = (saleId: number) =>
    useQuery({
        queryKey: ["saleHistory", saleId],
        queryFn: () => getHistory(saleId).then(res => res.data),
        enabled: !!saleId
    });




export const useAllServices = () =>
    useQuery({
        queryKey: ["serviceParkConfig", "services"],
        queryFn: getAllServices,
    });

export const useBranches = () =>
    useQuery({
        queryKey: ["serviceParkConfig", "branches"],
        queryFn: listBranches,
    });

export const useBranchDetails = (branchId: number) =>
    useQuery({
        queryKey: ["serviceParkConfig", "branch", branchId],
        queryFn: () => getBranchDetails(branchId),
        enabled: !!branchId,
    });

export const usePackages = () =>
    useQuery({
        queryKey: ["serviceParkConfig", "packages"],
        queryFn: getAllPackages
    });

// --- MUTATIONS ---

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "services"] });
        },
    });
};

export const useCreatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPackage,
        // Optional: Invalidate packages list if you have one
        // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "packages"] }),
    });
};

export const useCreateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branches"] });
        },
    });
};

export const useAddServiceToBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ branchId, data }: { branchId: number; data: { service_id: number; custom_price: number } }) =>
            addServiceToBranch(branchId, data),
        onSuccess: (_, variables) => {
            // Invalidate specific branch details to reflect updated pricing
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branch", variables.branchId] });
        },
    });
};

export const useCreateServiceLine = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ branchId, data }: { branchId: number; data: { name: string; type: string; advisor: number } }) =>
            createServiceLine(branchId, data),
        onSuccess: (_, variables) => {
            // Invalidate specific branch details to show new line
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branch", variables.branchId] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateService,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "services"] }),
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "services"] }),
    });
};

export const useUpdatePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePackage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "packages"] }),
    });
};

export const useDeletePackage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePackage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "packages"] }),
    });
};


export const useUpdateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branches"] });
            // Also invalidate specific details
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branch"] });
        },
    });
};

export const useDeleteBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceParkConfig", "branches"] });
        },
    });
};

export const useBranchCatalog = (branchId: number | null) =>
    useQuery({
        queryKey: ["branchCatalog", branchId],
        queryFn: () => getBranchCatalog(branchId!),
        enabled: !!branchId
    });


export const useValidatePromo = () => {
    return useMutation({
        mutationFn: validatePromo
    });
};


export const useAvailablePromos = () =>
    useQuery({
        queryKey: ["servicePark", "promos"],
        queryFn: getPromos
    });



export const useBookingAvailability = (
    branchId: number | null,
    lineId: number | null,
    month: string
) => {
    return useQuery({
        queryKey: ['bookingAvailability', branchId, lineId, month],
        queryFn: () => getBookingAvailability(branchId!, lineId!, month),
        enabled: !!branchId && !!lineId && !!month,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDailyBookings = (
    branchId: number | null,
    lineId: number | null,
    date: string
) => {
    return useQuery({
        queryKey: ['dailyBookings', branchId, lineId, date],
        queryFn: () => getDailyBookings(branchId!, lineId!, date),
        enabled: !!branchId && !!lineId && !!date,
    });
};

export const useSubmitBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dailyBookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookingAvailability'] });
        },
    });
};