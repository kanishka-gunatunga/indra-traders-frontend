import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplaintReminderService } from "@/services/complaintReminder.service";

export const useRemindersByComplaint = (complaintId: number) => {
    return useQuery({
        queryKey: ["reminders", complaintId],
        queryFn: () => ComplaintReminderService.getByComplaint(complaintId),
        enabled: !!complaintId,
    });
};

export const useNearestReminders = () => {
    return useQuery({
        queryKey: ["reminders", "nearest"],
        queryFn: () => ComplaintReminderService.getNearest(),
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ComplaintReminderService.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reminders", variables.complaintId] });
        },
    });
};
