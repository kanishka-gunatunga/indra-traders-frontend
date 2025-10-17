import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {vehicleSaleService} from "@/services/vehicleSaleService";

export const useVehicleSales = (status?: string) => {
    return useQuery({
        queryKey: ["vehicle-sales", status],
        queryFn: () => vehicleSaleService.getSales(status),
    });
};

export const useCreateVehicleSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: vehicleSaleService.createSale,
        onSuccess: () => {
            console.log("Vehicle sale created successfully");
            queryClient.invalidateQueries({queryKey: ["vehicle-sales"]});
        },
        onError: () => console.error("Failed to create vehicle sale"),
    });
};


export const useAssignVehicleSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, salesUserId}: { id: string; salesUserId: string }) =>
            vehicleSaleService.assignSale(id, salesUserId),
        onSuccess: () => {
            console.log("Sale assigned successfully");
            queryClient.invalidateQueries({queryKey: ["vehicle-sales"]});
        },
        onError: () => console.error("Failed to assign sale"),
    });
};


export const useUpdateSaleStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, status}: { id: string; status: string }) =>
            vehicleSaleService.updateSaleStatus(id, status),
        onSuccess: () => {
            console.log("Sale status updated");
            queryClient.invalidateQueries({queryKey: ["vehicle-sales"]});
        },
        onError: () => console.error("Failed to update sale status"),
    });
};
