import { useQuery, useMutation } from "@tanstack/react-query";
import {
    createUnavailableVehicleSale,
    fetchUnavailableVehicleSales,
    fetchUnavailableVehicleSaleById, fetchUnavailableServices, fetchUnavailableServiceById, createUnavailableService,
    fetchUnavailableSpareParts, fetchUnavailableSparePartById, createUnavailableSparePart
} from "@/services/unavailableService";

// ... (imports)

export const useUnavailableVehicleSales = (page = 1, limit = 10, filters = {}) =>
    useQuery({
        queryKey: ["unavailableVehicleSales", page, limit, filters],
        queryFn: () => fetchUnavailableVehicleSales(page, limit, filters)
    });

export const useCreateUnavailableVehicleSale = () =>
    useMutation({
        mutationFn: createUnavailableVehicleSale
    });

// ... (other hooks)

export const useUnavailableServices = (page = 1, limit = 10, filters = {}) =>
    useQuery({
        queryKey: ["unavailableServices", page, limit, filters],
        queryFn: () => fetchUnavailableServices(page, limit, filters)
    });

// ... (other hooks)

export const useUnavailableSpareParts = (page = 1, limit = 10, filters = {}) =>
    useQuery({
        queryKey: ["unavailableSpareParts", page, limit, filters],
        queryFn: () => fetchUnavailableSpareParts(page, limit, filters)
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
