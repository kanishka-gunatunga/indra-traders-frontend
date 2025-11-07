import { useQuery, useMutation } from "@tanstack/react-query";
import {
    createUnavailableVehicleSale,
    fetchUnavailableVehicleSales,
    fetchUnavailableVehicleSaleById, fetchUnavailableServices, fetchUnavailableServiceById, createUnavailableService,
    fetchUnavailableSpareParts, fetchUnavailableSparePartById, createUnavailableSparePart
} from "@/services/unavailableService";

export const useUnavailableVehicleSales = () =>
    useQuery({
        queryKey: ["unavailableVehicleSales"],
        queryFn: fetchUnavailableVehicleSales
    });

export const useUnavailableVehicleSaleById = (id: number | string) =>
    useQuery({
        queryKey: ["unavailableVehicleSale", id],
        queryFn: () => fetchUnavailableVehicleSaleById(id),
        enabled: !!id
    });

export const useCreateUnavailableVehicleSale = () =>
    useMutation({
        mutationFn: createUnavailableVehicleSale
    });

export const useUnavailableServices = () =>
    useQuery({
        queryKey: ["unavailableServices"],
        queryFn: fetchUnavailableServices
    });

export const useUnavailableServiceById = (id: number | string) =>
    useQuery({
        queryKey: ["unavailableService", id],
        queryFn: () => fetchUnavailableServiceById(id),
        enabled: !!id
    });

export const useCreateUnavailableService = () =>
    useMutation({
        mutationFn: createUnavailableService
    });

export const useUnavailableSpareParts = () =>
    useQuery({
        queryKey: ["unavailableSpareParts"],
        queryFn: fetchUnavailableSpareParts
    });

export const useUnavailableSparePartById = (id: number | string) =>
    useQuery({
        queryKey: ["unavailableSparePart", id],
        queryFn: () => fetchUnavailableSparePartById(id),
        enabled: !!id
    });

export const useCreateUnavailableSparePart = () =>
    useMutation({
        mutationFn: createUnavailableSparePart
    });
