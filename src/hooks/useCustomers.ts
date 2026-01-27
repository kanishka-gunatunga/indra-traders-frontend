import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, updateCustomer } from "@/services/customer.service";
import { toast } from "react-hot-toast";

export const useCustomers = (page = 1, limit = 10, filters = {}) => {
    return useQuery({
        queryKey: ["customers", page, limit, filters],
        queryFn: () => fetchCustomers(page, limit, filters),
        placeholderData: (previousData) => previousData,
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCustomer(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Customer updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Error updating customer");
        }
    });
};
