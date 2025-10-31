import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplaintFollowupService } from "@/services/complaintFollowup.service";

export const useFollowUpsByComplaint = (complaintId: number) => {
    return useQuery({
        queryKey: ["followups", complaintId],
        queryFn: () => ComplaintFollowupService.getByComplaint(complaintId),
        enabled: !!complaintId,
    });
};

export const useCreateFollowUp = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ComplaintFollowupService.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["followups", variables.complaintId] });
        },
    });
};
