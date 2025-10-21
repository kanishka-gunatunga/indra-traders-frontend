import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {SparePartsService} from "@/services/sparePartsService";

export const useSpareParts = (filters?: Record<string, any>) =>
    useQuery({
        queryKey: ["spareParts", filters],
        queryFn: () => SparePartsService.listParts(filters).then((res) => res.data),
    });

export const useStockAvailability = (sparePartId: number) =>
    useQuery({
        queryKey: ["stockAvailability", sparePartId],
        queryFn: () =>
            SparePartsService.getStockAvailability(sparePartId).then((res) => res.data),
        enabled: !!sparePartId,
    });

export const usePromotions = (sparePartId: number) =>
    useQuery({
        queryKey: ["promotions", sparePartId],
        queryFn: () =>
            SparePartsService.getPromotions(sparePartId).then((res) => res.data),
        enabled: !!sparePartId,
    });

export const useCreateSparePart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: SparePartsService.createSparePart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spareParts"] });
        },
    });
};
