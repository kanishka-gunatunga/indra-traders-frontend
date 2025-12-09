/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {LeasingBankFormData, LeasingService} from "@/services/leasingService";

export const LEASING_KEYS = {
    all: ["leasing-banks"] as const,
    active: ["leasing-banks", "active"] as const,
    dashboard: ["leasing-banks", "dashboard"] as const,
};


export const useActiveBanks = () => {
    return useQuery({
        queryKey: LEASING_KEYS.active,
        queryFn: LeasingService.getActiveBanks,
        staleTime: 1000 * 60 * 5,
    });
};

export const useAllBanks = () => {
    return useQuery({
        queryKey: LEASING_KEYS.dashboard,
        queryFn: LeasingService.getAllBanks,
    });
};

export const useCreateBank = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LeasingBankFormData) => LeasingService.createBank(data),
        onSuccess: () => {
            message.success("Bank created successfully");
            queryClient.invalidateQueries({ queryKey: LEASING_KEYS.all });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || "Failed to create bank");
        }
    });
};

export const useUpdateBank = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<LeasingBankFormData> }) =>
            LeasingService.updateBank(id, data),
        onSuccess: () => {
            message.success("Bank updated successfully");
            queryClient.invalidateQueries({ queryKey: LEASING_KEYS.all });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || "Failed to update bank");
        }
    });
};


export const useDeleteBank = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => LeasingService.deleteBank(id),
        onSuccess: () => {
            message.success("Bank deleted successfully");
            queryClient.invalidateQueries({ queryKey: LEASING_KEYS.all });
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || "Failed to delete bank");
        }
    });
};