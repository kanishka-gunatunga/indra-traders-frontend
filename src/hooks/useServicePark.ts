import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    assignToSalesAgent,
    createAssignToSale,
    getSaleDetails,
    getVehicleHistoryByNumber,
    handleServiceIntake,
    listVehicleHistories
} from "@/services/serviceParkService";


export const useVehicleHistories = () =>
    useQuery({
        queryKey: ["servicePark", "vehicleHistories"],
        queryFn: listVehicleHistories,
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
        mutationFn: ({saleId, userId}: { saleId: string; userId: string }) =>
            assignToSalesAgent(saleId, userId),
        onSuccess: (_, {saleId}) => {
            queryClient.invalidateQueries({queryKey: ["servicePark", "saleDetails", saleId]});
        },
    });
};
