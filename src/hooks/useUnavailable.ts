import { useQuery, useMutation } from "@tanstack/react-query";
import {
    createUnavailableVehicleSale,
    fetchUnavailableVehicleSales,
    fetchUnavailableVehicleSaleById, fetchUnavailableServices, fetchUnavailableServiceById, createUnavailableService,
    fetchUnavailableSpareParts, fetchUnavailableSparePartById, createUnavailableSparePart
} from "@/services/unavailableService";

export const useUnavailableVehicleSales = (page = 1, limit = 10) =>
    useQuery({
        queryKey: ["unavailableVehicleSales", page, limit],
        queryFn: () => fetchUnavailableVehicleSales(page, limit)
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

export const useUnavailableServices = (page = 1, limit = 10) =>
    useQuery({
        queryKey: ["unavailableServices", page, limit],
        queryFn: () => fetchUnavailableServices(page, limit)
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

export const useUnavailableSpareParts = (page = 1, limit = 10) =>
    useQuery({
        queryKey: ["unavailableSpareParts", page, limit],
        queryFn: () => fetchUnavailableSpareParts(page, limit)
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
