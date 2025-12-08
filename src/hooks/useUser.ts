/* eslint-disable @typescript-eslint/no-explicit-any */

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/services/userService";
import axiosInstance from "@/utils/axiosinstance";

export const useUsers = (filters?: {
    user_role?: string;
    department?: string;
    branch?: string;
}) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => userService.getUsers(filters),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
};

// export const useCheckHandover = () => {
//     return useMutation({
//         mutationFn: async (userId: string) => {
//             userService.handoverCheck(userId);
//         }
//     });
// };

export const useCheckHandover = () => {
    return useMutation({
        mutationFn: async (userId: string) => {
            const res = await axiosInstance.get(`/users/${userId}/handover-check`);
            return res.data;
        }
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}: { id: string; data: any }) =>
            userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["users"]});
        },
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const res = await userService.login(credentials.email, credentials.password);
            localStorage.setItem("accessToken", res.accessToken);
            return res;
        },
    });
};
