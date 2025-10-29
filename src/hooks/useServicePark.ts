import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    assignToSalesAgent,
    createAssignToSale, createFollowup, createReminder, getNearestReminders,
    getSaleDetails, getSaleDetailsByTicket,
    getVehicleHistoryByNumber,
    handleServiceIntake,
    listVehicleHistories, listVehicleSales, updateStatus
} from "@/services/serviceParkService";


export const useVehicleHistories = () =>
    useQuery({
        queryKey: ["servicePark", "vehicleHistories"],
        queryFn: listVehicleHistories,
    });

export const useVehicleSales = () =>
    useQuery({
        queryKey: ["servicePark", "saleDetails"],
        queryFn: async () => {
            const res = await listVehicleSales();
            return res.data;
        },
    });

export const useSaleDetailsByTicketNumber = (ticketNumber: string) =>
    useQuery({
        queryKey: ["servicePark", "saleDetails", ticketNumber],
        queryFn: async () => {
            const data = await getSaleDetailsByTicket(ticketNumber);
            return data ?? {};
        },
        enabled: !!ticketNumber,
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
            queryClient.invalidateQueries({queryKey: ["servicePark", "vehicleHistories"]});
        },
    });
};


export const useAssignToSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAssignToSale,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["servicePark", "vehicleHistories"]});
        },
    });
};


export const useAssignToSalesAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({saleId, userId}: { saleId: number; userId: number }) =>
            assignToSalesAgent(saleId, userId),
        onSuccess: (_, {saleId}) => {
            queryClient.invalidateQueries({queryKey: ["servicePark", "saleDetails", saleId]});
        },
    });
};


export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, status}: { id: number; status: "WON" | "LOST" }) => updateStatus(id, {status}),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ["servicePark"]});
            queryClient.invalidateQueries({queryKey: ["servicePark", variables.id]});
        },
    });
};

export const useCreateFollowup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFollowup,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["servicePark", "followups"]});
        },
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReminder,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["servicePark", "reminders"]});
        },
    });
};


