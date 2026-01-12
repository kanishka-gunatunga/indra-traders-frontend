import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {NotificationItem, NotificationResponse, notificationService} from "@/services/notificationService";
import {useEffect} from "react";
import { io, Socket } from "socket.io-client";

// export const useNotifications = (userId: number | undefined) => {
//     const queryClient = useQueryClient();
//
//     const query = useQuery({
//         queryKey: ["notifications", userId],
//         queryFn: () => notificationService.getMyNotifications(userId!),
//         enabled: !!userId,
//         refetchInterval: 30000,
//         staleTime: 1000 * 10,
//     });
//
//     const markReadMutation = useMutation({
//         mutationFn: (notificationId: number) =>
//             notificationService.markAsRead(notificationId, userId!),
//
//         onMutate: async (notificationId) => {
//             await queryClient.cancelQueries({queryKey: ["notifications", userId]});
//             const previousData = queryClient.getQueryData(["notifications", userId]);
//
//             queryClient.setQueryData(["notifications", userId], (old: any) => {
//                 if (!old) return old;
//                 return {
//                     ...old,
//                     notifications: old.notifications.map((n: any) =>
//                         n.id === notificationId ? {...n, is_read: true} : n
//                     ),
//                     unreadCount: Math.max(0, old.unreadCount - 1)
//                 };
//             });
//
//             return {previousData};
//         },
//         onError: (err, newTodo, context) => {
//             queryClient.setQueryData(["notifications", userId], context?.previousData);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ["notifications", userId]});
//         }
//     });
//
//     return {
//         ...query,
//         markAsRead: markReadMutation.mutate
//     };
// };


let socket: Socket;

export const useNotifications = (userId: number | undefined) => {
    const queryClient = useQueryClient();
    const queryKey = ["notifications", userId];

    // 1. Initial Fetch (REST API)
    const query = useQuery({
        queryKey: queryKey,
        queryFn: () => notificationService.getMyNotifications(userId!),
        enabled: !!userId,
        staleTime: Infinity, // Data doesn't go stale because Socket updates it
        // refetchInterval: 30000, // REMOVED: No longer needed!
    });

    // 2. Socket.IO Listener for Real-time Updates
    useEffect(() => {
        if (!userId) return;

        // const socket = getSocket(userId);

        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            query: { userId }
        });

        const handleNewNotification = (newNotification: NotificationItem) => {
            console.log("🔔 Real-time notification received:", newNotification);

            // OPTIMISTIC UPDATE: Update cache directly without refetching API
            queryClient.setQueryData<NotificationResponse>(queryKey, (oldData) => {
                if (!oldData) return { notifications: [newNotification], unreadCount: 1 };

                return {
                    ...oldData,
                    unreadCount: oldData.unreadCount + 1,
                    notifications: [newNotification, ...oldData.notifications] // Add to top
                };
            });

            // Optional: Play sound here
            // const audio = new Audio('/sounds/notification.mp3');
            // audio.play();
        };

        // Listen for event
        socket.on("notification.new", handleNewNotification);

        // Cleanup
        return () => {
            socket.off("notification.new", handleNewNotification);
        };
    }, [userId, queryClient, queryKey]);

    // 3. Mark as Read Mutation
    const markReadMutation = useMutation({
        mutationFn: (notificationId: number) =>
            notificationService.markAsRead(notificationId, userId!),

        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey });
            const previousData = queryClient.getQueryData<NotificationResponse>(queryKey);

            // Optimistic Update for UI responsiveness
            queryClient.setQueryData<NotificationResponse>(queryKey, (old) => {
                if (!old) return old;

                // Find if the target notification is currently unread
                const target = old.notifications.find(n => n.id === notificationId);
                const isCurrentlyUnread = target && !target.is_read;

                return {
                    ...old,
                    notifications: old.notifications.map((n) =>
                        n.id === notificationId ? { ...n, is_read: true } : n
                    ),
                    // Only decrease count if it was actually unread
                    unreadCount: isCurrentlyUnread ? Math.max(0, old.unreadCount - 1) : old.unreadCount
                };
            });

            return { previousData };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(queryKey, context.previousData);
            }
        },
        onSuccess: () => {
            // Usually no need to invalidate if logic is correct,
            // but safe to do so to sync with server state eventually
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        ...query,
        markAsRead: markReadMutation.mutate
    };
};