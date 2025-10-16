import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowUpService } from "@/services/followup.service";
import { FollowUp } from "@/types/followup.types";

export const useFollowUpsByComplaint = (complaintId: number) => {
    return useQuery<FollowUp[]>({
        queryKey: ["followups", complaintId],
        queryFn: () => FollowUpService.getByComplaint(complaintId),
        enabled: !!complaintId,
    });
};

export const useCreateFollowUp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: FollowUpService.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["followups", variables.complaintId] });
        },
    });
};
