import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReminderService } from "@/services/reminder.service";
import { Reminder } from "@/types/reminder.types";

export const useRemindersByComplaint = (complaintId: number) => {
    return useQuery<Reminder[]>({
        queryKey: ["reminders", complaintId],
        queryFn: () => ReminderService.getByComplaint(complaintId),
        enabled: !!complaintId,
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ReminderService.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reminders", variables.complaintId] });
        },
    });
};
