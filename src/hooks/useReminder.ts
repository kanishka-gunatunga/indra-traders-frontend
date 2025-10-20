import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplaintReminderService } from "@/services/complaintReminder.service";
import { Reminder } from "@/types/reminder.types";

export const useRemindersByComplaint = (complaintId: number) => {
    return useQuery<Reminder[]>({
        queryKey: ["reminders", complaintId],
        queryFn: () => ComplaintReminderService.getByComplaint(complaintId),
        enabled: !!complaintId,
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
