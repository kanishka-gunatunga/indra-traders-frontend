import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import {
    getServiceTypes,
    getServiceLines,
    getBookings,
    getAllBookingsForCalendar,
    createBooking as createBookingAPI,
    updateBookingStatus as updateBookingStatusAPI
} from '@/services/serviceCenterService';
import { calculateServiceCenterStats } from '@/utils/serviceCenterProcessor';
import { calculateTotalTimeSlots } from '@/utils/timeSlotUtils';
import { ServiceCenterBooking, ServiceLine } from '@/types/serviceCenter';

export function useServiceCenterBookings(
    selectedDate: dayjs.Dayjs,
    selectedLineId: number | null,
    selectedServiceType: string | null
) {
    const { data: session } = useSession();
    const branchId = session?.user?.branchId ? Number(session.user.branchId) : null;

    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
    const [bookings, setBookings] = useState<ServiceCenterBooking[]>([]);
    const [calendarBookings, setCalendarBookings] = useState<ServiceCenterBooking[]>([]);
    const [stats, setStats] = useState({
        totalScheduled: 0,
        inProgress: 0,
        upcoming: 0,
        availableSlots: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isInitialLoad = useRef(true);
    const totalTimeSlots = calculateTotalTimeSlots();

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const types = await getServiceTypes();
                setServiceTypes(types);
            } catch (err) {
                console.error('[useServiceCenterBookings] Failed to fetch service types:', err);
            }
        };
        fetchServiceTypes();
    }, []);

    useEffect(() => {
        if (!branchId) return;

        const fetchLines = async () => {
            try {
                const lines = await getServiceLines(branchId);
                const filteredLines = selectedServiceType
                    ? lines.filter(line => line.type === selectedServiceType)
                    : lines;
                setServiceLines(filteredLines);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service lines';
                console.error('[useServiceCenterBookings] Failed to fetch service lines:', errorMessage);
                setError(errorMessage);
            }
        };

        fetchLines();
    }, [branchId, selectedServiceType]);

    // Fetch all bookings for calendar dots (fetches all bookings, not filtered by date)
    useEffect(() => {
        if (!branchId) return;

        const fetchCalendarBookings = async () => {
            try {

                const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
                const endDate = dayjs().add(1, 'year').format('YYYY-MM-DD');
                
                const allBookings = await getAllBookingsForCalendar(
                    branchId,
                    startDate,
                    endDate,
                    selectedLineId || undefined,
                    selectedServiceType || undefined
                );
                
                setCalendarBookings(allBookings);
            } catch (err) {
                console.error('[useServiceCenterBookings] Failed to fetch calendar bookings:', err);

            }
        };

        fetchCalendarBookings();
        
        const intervalId = setInterval(fetchCalendarBookings, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [branchId, selectedLineId, selectedServiceType]);

    useEffect(() => {
        if (!branchId) {
            setLoading(false);
            return;
        }

        const fetchAndProcessData = async () => {
            try {
                if (isInitialLoad.current) {
                    setLoading(true);
                }
                setError(null);

                const dateStr = selectedDate.format('YYYY-MM-DD');
                
                const fetchedBookings = await getBookings(
                    dateStr,
                    branchId,
                    selectedLineId || undefined,
                    selectedServiceType || undefined
                );

                setBookings(fetchedBookings);

                const calculatedStats = calculateServiceCenterStats(fetchedBookings, totalTimeSlots);
                setStats(calculatedStats);
                
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setLoading(false);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
                console.error('[useServiceCenterBookings] Error fetching bookings:', errorMessage);
                setError(errorMessage);
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setLoading(false);
                }
            }
        };

        isInitialLoad.current = true;
        fetchAndProcessData();

        const intervalId = setInterval(() => {
            fetchAndProcessData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [selectedDate, branchId, selectedLineId, selectedServiceType, totalTimeSlots]);

    const createBooking = async (data: {
        line_id: number;
        date: string;
        start_time: string;
        end_time: string;
        vehicle_no: string;
        customer_name: string;
        phone_number: string;
        status?: string;
    }) => {
        if (!branchId) throw new Error('Branch ID is required');
        
        try {
            const newBooking = await createBookingAPI({
                branch_id: branchId,
                ...data
            });
            
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const fetchedBookings = await getBookings(
                dateStr,
                branchId,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setBookings(fetchedBookings);
            
            const calculatedStats = calculateServiceCenterStats(fetchedBookings, totalTimeSlots);
            setStats(calculatedStats);
            
            const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
            const endDate = dayjs().add(1, 'year').format('YYYY-MM-DD');
            const allBookings = await getAllBookingsForCalendar(
                branchId,
                startDate,
                endDate,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setCalendarBookings(allBookings);
            
            return newBooking;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
            console.error('[useServiceCenterBookings] Failed to create booking:', errorMessage);
            throw err;
        }
    };

    const updateBooking = async (id: number, status: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED") => {
        if (!branchId) throw new Error('Branch ID is required');
        
        try {
            const updatedBooking = await updateBookingStatusAPI(id, status);
            
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const fetchedBookings = await getBookings(
                dateStr,
                branchId,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setBookings(fetchedBookings);
            
            const calculatedStats = calculateServiceCenterStats(fetchedBookings, totalTimeSlots);
            setStats(calculatedStats);
            
            const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
            const endDate = dayjs().add(1, 'year').format('YYYY-MM-DD');
            const allBookings = await getAllBookingsForCalendar(
                branchId,
                startDate,
                endDate,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setCalendarBookings(allBookings);
            
            return updatedBooking;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
            console.error('[useServiceCenterBookings] Failed to update booking:', errorMessage);
            throw err;
        }
    };

    // Process calendar bookings to create a map of date -> dot colors
    const calendarDots = React.useMemo(() => {
        const dotsMap: Record<string, string[]> = {};
        
        calendarBookings.forEach(booking => {
            const dateStr = booking.date;
            if (!dotsMap[dateStr]) {
                dotsMap[dateStr] = [];
            }
            
            if (booking.status === 'COMPLETED' || booking.status === 'BOOKED') {
                if (!dotsMap[dateStr].includes('green')) {
                    dotsMap[dateStr].push('green');
                }
            } else if (booking.status === 'PENDING') {
                if (!dotsMap[dateStr].includes('orange')) {
                    dotsMap[dateStr].push('orange');
                }
            } else if (booking.status === 'CANCELLED') {

            }
        });
        
        return dotsMap;
    }, [calendarBookings]);

    return {
        serviceTypes,
        serviceLines,
        bookings,
        calendarBookings,
        calendarDots,
        stats,
        loading,
        error,
        createBooking,
        updateBooking
    };
}
