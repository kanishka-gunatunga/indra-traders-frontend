/* eslint-disable @typescript-eslint/no-explicit-any */

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {complaintService} from "@/services/complaintService";

export const complaintKeys = {
    all: ["complaints"] as const,
    lists: () => [...complaintKeys.all, "list"] as const,
    listByContact: (phone: string) => [...complaintKeys.lists(), {phone}] as const,
    details: () => [...complaintKeys.all, "detail"] as const,
    detail: (id: number) => [...complaintKeys.details(), id] as const,
};


export const useComplaints = () => {
    return useQuery({
        queryKey: complaintKeys.lists(),
        queryFn: complaintService.getAll,
    });
};


export const useComplaintById = (id: number) => {
    return useQuery({
        queryKey: complaintKeys.detail(id),
        queryFn: () => complaintService.getById(id),
        enabled: !!id, // Prevents unnecessary call when ID is undefined
    });
};


export const useComplaintsByContact = (phone: string) => {
    return useQuery({
        queryKey: complaintKeys.listByContact(phone),
        queryFn: () => complaintService.getByContact(phone),
        enabled: !!phone,
    });
};


export const useCreateComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => complaintService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: complaintKeys.lists()});
        },
    });
};


export const useUpdateComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, data}: { id: number; data: any }) =>
            complaintService.update(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: complaintKeys.detail(variables.id)});
            queryClient.invalidateQueries({queryKey: complaintKeys.lists()});
        },
    });
};
