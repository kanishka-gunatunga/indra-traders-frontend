import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import {
    getServiceTypes,
    getServiceLines,
    getBookings,
    getCalendarDots,
    createBooking as createBookingAPI,
    updateBookingStatus as updateBookingStatusAPI
} from '@/services/serviceCenterService';
import { calculateServiceCenterStats } from '@/utils/serviceCenterProcessor';
import { calculateTotalTimeSlots } from '@/utils/timeSlotUtils';
import { ServiceCenterBooking, ServiceLine, DatabaseStatus } from '@/types/serviceCenter';

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
    const [calendarDotsCache, setCalendarDotsCache] = useState<Record<string, Array<{ date: string; status: DatabaseStatus }>>>({});
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
    const fetchedMonthsRef = useRef<Set<string>>(new Set());

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

    // Clear cache and fetched months when filters change 
    useEffect(() => {
        setCalendarDotsCache({});
        fetchedMonthsRef.current.clear();
    }, [selectedLineId, selectedServiceType]);

    useEffect(() => {
        if (!branchId) return;

        const fetchMonthBookings = async (forceRefresh = false) => {
            try {
                
                const monthKey = selectedDate.format('YYYY-MM');
                
                
                if (!forceRefresh && fetchedMonthsRef.current.has(monthKey)) {
                    return; 
                }

                const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
                const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
                
                const monthDots = await getCalendarDots(
                    branchId,
                    startDate,
                    endDate,
                    selectedLineId || undefined,
                    selectedServiceType || undefined
                );
                
                
                setCalendarDotsCache(prev => ({
                    ...prev,
                    [monthKey]: monthDots
                }));
                
                fetchedMonthsRef.current.add(monthKey);
            } catch (err) {
                console.error('[useServiceCenterBookings] Failed to fetch calendar bookings:', err);
                
            }
        };

        fetchMonthBookings();
        
        
        const intervalId = setInterval(() => {
            fetchMonthBookings(true); 
        }, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, [branchId, selectedDate, selectedLineId, selectedServiceType]);

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
            
            
            const monthKey = selectedDate.format('YYYY-MM');
            const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
            const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
            const monthDots = await getCalendarDots(
                branchId,
                startDate,
                endDate,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setCalendarDotsCache(prev => ({
                ...prev,
                [monthKey]: monthDots
            }));
            
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
            
            
            const monthKey = selectedDate.format('YYYY-MM');
            const startDate = selectedDate.startOf('month').format('YYYY-MM-DD');
            const endDate = selectedDate.endOf('month').format('YYYY-MM-DD');
            const monthDots = await getCalendarDots(
                branchId,
                startDate,
                endDate,
                selectedLineId || undefined,
                selectedServiceType || undefined
            );
            setCalendarDotsCache(prev => ({
                ...prev,
                [monthKey]: monthDots
            }));
            
            return updatedBooking;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update booking';
            console.error('[useServiceCenterBookings] Failed to update booking:', errorMessage);
            throw err;
        }
    };


    const calendarDots = React.useMemo(() => {
        const dotsMap: Record<string, string[]> = {};
        
       
        const allCachedDots = Object.values(calendarDotsCache).flat();
        
        allCachedDots.forEach(dot => {
            const dateStr = dot.date;
            if (!dotsMap[dateStr]) {
                dotsMap[dateStr] = [];
            }
            
           
            if (dot.status === 'COMPLETED' || dot.status === 'BOOKED') {
                if (!dotsMap[dateStr].includes('green')) {
                    dotsMap[dateStr].push('green');
                }
            } else if (dot.status === 'PENDING') {
                if (!dotsMap[dateStr].includes('orange')) {
                    dotsMap[dateStr].push('orange');
                }
            }
            
        });
        
        return dotsMap;
    }, [calendarDotsCache]);

    return {
        serviceTypes,
        serviceLines,
        bookings,
        calendarDots,
        stats,
        loading,
        error,
        createBooking,
        updateBooking
    };
}
