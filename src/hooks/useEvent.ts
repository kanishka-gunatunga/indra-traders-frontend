import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/services/event.service";
import { Event } from "@/types/event.types";

export const useEventsByCustomer = (customerId: number) => {
    return useQuery<Event[]>({
        queryKey: ["events", customerId],
        queryFn: () => EventService.getByCustomer(customerId),
        enabled: !!customerId,
    });
};
