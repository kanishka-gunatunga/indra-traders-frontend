import {useQuery} from "@tanstack/react-query";
import {ActivityLogFilters, activityLogService} from "@/services/logService";


export const useActivityLogs = (filters: ActivityLogFilters) => {
    return useQuery({
        queryKey: ["activity-logs", filters],
        queryFn: () => activityLogService.getAll(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5,
    });
};