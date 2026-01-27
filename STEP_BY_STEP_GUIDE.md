# Step-by-Step Implementation Guide

Follow these steps in order. Take your time with each step!

---

## 🎯 STEP 1: Update TypeScript Types

**File:** `src/types/serviceCenter.ts`

**What to do:**
Add the `ServiceCenterBooking` interface that matches your backend API response.

**Add this to the file:**

```typescript
// Database statuses from backend API
export type DatabaseStatus = "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";

// Service Center Booking from backend API
export interface ServiceCenterBooking {
    id: number;
    date: string;           // YYYY-MM-DD
    start_time: string;     // "HH:mm"
    end_time: string;       // "HH:mm"
    vehicle_no: string | null;
    customer_name: string | null;
    phone_number: string | null;
    status: DatabaseStatus;  // "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"
    line_id: number | null;
    service_type: string | null;  // "REPAIR" | "PAINT" | "ADDON"
}

// Service Line from backend API
export interface ServiceLine {
    id: number;
    name: string;
    type: string;  // "REPAIR" | "PAINT" | "ADDON"
    advisor: string;
}
```

**Why:**
- This matches exactly what your backend API returns
- TypeScript will help catch errors if you use wrong field names
- Other developers will know what data structure to expect

**Test:**
- Save the file
- Check for any red squiggly lines (errors)
- If you see errors, check that you copied the code correctly

---

## 🎯 STEP 2: Create Unified Stats Processor

**File:** `src/utils/bookingStatsProcessor.ts` (NEW FILE - create it!)

**What to do:**
Create a new file that contains the unified logic for calculating stats. This will be used by BOTH dashboards.

**Create the file and add this code:**

```typescript
import dayjs from 'dayjs';

// Database statuses from backend
export type DatabaseStatus = "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";

// Display statuses for UI (calculated from database status + time)
export type DisplayStatus = "Completed" | "In Progress" | "Upcoming";

// Interface for any booking that has status, date, and time
// This allows both service-booking and service-center bookings to use the same logic
export interface BookingWithStatus {
    status: DatabaseStatus;
    date: string;  // YYYY-MM-DD
    start_time: string;  // HH:mm
    end_time: string;  // HH:mm
}

// Stats interface (same for both dashboards)
export interface BookingStats {
    totalScheduled: number;
    inProgress: number;
    upcoming: number;
    availableSlots: number;
}

/**
 * Determines display status from database status + current time
 * This is what the UI shows (Completed, In Progress, Upcoming)
 * 
 * Example:
 * - Database status: "BOOKED"
 * - Current time: 10:15 AM
 * - Booking time: 10:00-10:30 AM
 * - Result: "In Progress" (because current time is between start and end)
 */
export function getDisplayStatus(booking: BookingWithStatus): DisplayStatus {
    const now = dayjs();
    const bookingDate = dayjs(booking.date);
    const currentTime = now.format('HH:mm');
    
    // CANCELLED bookings are always "Completed" (not active)
    if (booking.status === 'CANCELLED') {
        return "Completed";
    }
    
    // COMPLETED bookings are always "Completed"
    if (booking.status === 'COMPLETED') {
        return "Completed";
    }
    
    // If booking is in the past, it's completed
    if (bookingDate.isBefore(now, 'day')) {
        return "Completed";
    }
    
    // If booking is in the future, it's upcoming
    if (bookingDate.isAfter(now, 'day')) {
        return "Upcoming";
    }
    
    // If booking is today, check the time
    if (bookingDate.isSame(now, 'day')) {
        // If current time has passed the end time, it's completed
        if (currentTime >= booking.end_time) {
            return "Completed";
        }
        // If current time is between start and end time, it's in progress
        if (currentTime >= booking.start_time && currentTime < booking.end_time) {
            return "In Progress";
        }
        // If current time is before start time, it's upcoming
        if (currentTime < booking.start_time) {
            return "Upcoming";
        }
    }
    
    return "Upcoming";
}

/**
 * Calculates stats from bookings
 * Works with any booking type that implements BookingWithStatus
 * 
 * @param bookings - Array of bookings with status, date, and time
 * @param totalTimeSlots - Total available slots in a day (e.g., 18 slots from 8:00-17:00)
 * @returns Stats object with counts
 */
export function calculateBookingStats(
    bookings: BookingWithStatus[],
    totalTimeSlots: number
): BookingStats {
    // Process each booking to get display status
    const processedBookings = bookings.map(booking => ({
        ...booking,
        displayStatus: getDisplayStatus(booking)
    }));
    
    // Calculate stats
    const inProgress = processedBookings.filter(
        b => b.displayStatus === "In Progress"
    ).length;
    
    const upcoming = processedBookings.filter(
        b => b.displayStatus === "Upcoming"
    ).length;
    
    // Total Scheduled = all non-cancelled bookings
    const totalScheduled = bookings.filter(
        b => b.status !== 'CANCELLED'
    ).length;
    
    // Available Slots = total slots - booked slots (non-cancelled)
    const bookedSlots = bookings.filter(
        b => b.status !== 'CANCELLED'
    ).length;
    
    const availableSlots = Math.max(0, totalTimeSlots - bookedSlots);
    
    return {
        totalScheduled,
        inProgress,
        upcoming,
        availableSlots
    };
}
```

**Why:**
- This is the "single source of truth" for stats calculation
- Both dashboards will use this same logic
- Easy to test and maintain

**Test:**
1. Save the file
2. Check for errors (red squiggly lines)
3. Make sure `dayjs` is imported correctly (you should already have it installed)

---

## 🎯 STEP 3: Create Service-Center Processor

**File:** `src/utils/serviceCenterProcessor.ts` (NEW FILE - create it!)

**What to do:**
Create a processor specifically for service-center that uses the unified processor.

**Create the file and add this code:**

```typescript
import { ServiceCenterBooking } from '@/types/serviceCenter';
import { 
    getDisplayStatus, 
    calculateBookingStats,
    type BookingWithStatus,
    type BookingStats 
} from './bookingStatsProcessor';

// Re-export BookingStats as ServiceCenterStats for convenience
export type ServiceCenterStats = BookingStats;

/**
 * Converts ServiceCenterBooking to BookingWithStatus format
 * This allows us to use the unified processor
 */
function toBookingWithStatus(booking: ServiceCenterBooking): BookingWithStatus {
    return {
        status: booking.status,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time
    };
}

/**
 * Gets display status for a service center booking
 * This is what shows in the UI (Completed, In Progress, Upcoming)
 */
export function determineServiceCenterStatus(
    booking: ServiceCenterBooking
): "Completed" | "In Progress" | "Upcoming" {
    return getDisplayStatus(toBookingWithStatus(booking));
}

/**
 * Calculates stats for service center bookings
 * 
 * @param bookings - Array of ServiceCenterBooking from API
 * @param totalTimeSlots - Total slots in a day (e.g., 18 slots from 8:00-17:00)
 * @returns Stats object with counts
 */
export function calculateServiceCenterStats(
    bookings: ServiceCenterBooking[],
    totalTimeSlots: number
): BookingStats {
    // Convert ServiceCenterBooking[] to BookingWithStatus[]
    const bookingsWithStatus: BookingWithStatus[] = bookings.map(toBookingWithStatus);
    
    // Use unified processor to calculate stats
    return calculateBookingStats(bookingsWithStatus, totalTimeSlots);
}
```

**Why:**
- This wraps the unified processor for service-center specific types
- Makes it easy to use in your hook
- Keeps the code organized

**Test:**
1. Save the file
2. Check for import errors
3. Make sure all types match

---

## ✅ CHECKPOINT: Test Your Code So Far

Before moving forward, let's make sure everything compiles:

1. **Check for errors:**
   - Open VS Code/Cursor
   - Look at the Problems panel (bottom)
   - Should see no errors related to the files you just created

2. **Verify imports:**
   - Make sure `dayjs` is installed (check `package.json`)
   - If not, run: `npm install dayjs`

3. **Test the logic (optional but recommended):**
   - You can create a simple test file to verify the functions work
   - Or wait until we integrate it into the hook

---

## 🎯 STEP 4: Create Service File (API Calls)

**File:** `src/services/serviceCenterService.ts` (NEW FILE - create it!)

**What to do:**
Create the service file that makes API calls to your backend.

**Create the file and add this code:**

```typescript
import axiosInstance from "@/utils/axiosinstance";
import { ServiceCenterBooking, ServiceLine } from "@/types/serviceCenter";

/**
 * Get all service types (REPAIR, PAINT, ADDON)
 * GET /api/v1/service-center/service-types
 */
export const getServiceTypes = async (): Promise<string[]> => {
    try {
        const res = await axiosInstance.get('/service-center/service-types');
        return res.data;  // Returns: ["REPAIR", "PAINT", "ADDON"]
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to fetch service types:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch service types');
    }
};

/**
 * Get service lines (bays) for a branch
 * GET /api/v1/service-park/branches/:branchId/lines
 */
export const getServiceLines = async (branchId: number): Promise<ServiceLine[]> => {
    try {
        const res = await axiosInstance.get(`/service-park/branches/${branchId}/lines`);
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to fetch service lines:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch service lines');
    }
};

/**
 * Get bookings for a specific date
 * GET /api/v1/service-center/bookings?date=YYYY-MM-DD&branchId=15&lineId?=&serviceType?=
 */
export const getBookings = async (
    date: string,        // YYYY-MM-DD
    branchId: number,
    lineId?: number,
    serviceType?: string
): Promise<ServiceCenterBooking[]> => {
    try {
        const params = new URLSearchParams({
            date,
            branchId: branchId.toString(),
        });
        
        if (lineId) params.append('lineId', lineId.toString());
        if (serviceType) params.append('serviceType', serviceType);
        
        const res = await axiosInstance.get(`/service-center/bookings?${params}`);
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to fetch bookings:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch bookings');
    }
};

/**
 * Get a single booking by ID
 * GET /api/v1/service-center/bookings/:id
 */
export const getBookingById = async (id: number): Promise<ServiceCenterBooking> => {
    try {
        const res = await axiosInstance.get(`/service-center/bookings/${id}`);
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to fetch booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to fetch booking');
    }
};

/**
 * Create a new booking
 * POST /api/v1/service-center/bookings
 */
export const createBooking = async (data: {
    branch_id: number;
    line_id: number;
    date: string;
    start_time: string;
    end_time: string;
    vehicle_no: string;
    customer_name: string;
    phone_number: string;
    status?: string;
}): Promise<ServiceCenterBooking> => {
    try {
        const res = await axiosInstance.post('/service-center/bookings', data);
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to create booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to create booking');
    }
};

/**
 * Update booking status
 * PUT /api/v1/service-center/bookings/:id
 */
export const updateBookingStatus = async (
    id: number,
    status: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"
): Promise<ServiceCenterBooking> => {
    try {
        const res = await axiosInstance.put(`/service-center/bookings/${id}`, { status });
        return res.data;
    } catch (error: unknown) {
        const axiosError = error as { 
            message?: string; 
            response?: { 
                status?: number; 
                statusText?: string; 
                data?: { message?: string } 
            } 
        };
        
        console.error('[ServiceCenterService] Failed to update booking:', {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText
        });
        
        throw new Error(axiosError.response?.data?.message || 'Failed to update booking');
    }
};
```

**Why:**
- Centralizes all API calls
- Handles errors consistently
- Easy to test and maintain

**Test:**
1. Save the file
2. Check for import errors
3. Make sure all function signatures match your backend API

---

## 🎯 STEP 5: Create Custom Hook

**File:** `src/hooks/useServiceCenterBookings.ts` (NEW FILE - create it!)

**What to do:**
Create a hook that manages all the data fetching and state. This is similar to `useScheduledServices` but for service-center.

**This is a BIG step - we'll do it in the next message!**

For now, just know that this hook will:
- Fetch service types, lines, and bookings
- Calculate stats using `calculateServiceCenterStats`
- Auto-refresh every 30 seconds
- Handle loading and error states

---

## 📝 Summary of What You've Done So Far

After completing Steps 1-4, you will have:

✅ **Types** - `ServiceCenterBooking` interface matching backend
✅ **Unified Processor** - `bookingStatsProcessor.ts` (used by both dashboards)
✅ **Service-Center Processor** - `serviceCenterProcessor.ts` (wraps unified processor)
✅ **Service File** - `serviceCenterService.ts` (API calls)

**Next:** Create the hook that ties everything together!

---

## 🎓 Learning Points

1. **Separation of Concerns:**
   - Types = Data structure
   - Processor = Business logic
   - Service = API calls
   - Hook = State management

2. **Reusability:**
   - `bookingStatsProcessor.ts` can be used by both dashboards
   - Don't duplicate code!

3. **Type Safety:**
   - TypeScript catches errors early
   - Makes code self-documenting

---

## ❓ Questions?

If you get stuck:
1. Check for typos in file names or imports
2. Make sure all imports are correct
3. Check that `dayjs` is installed
4. Look at the error messages - they usually tell you what's wrong!

**Ready for Step 5?** Let me know when you've completed Steps 1-4, and I'll guide you through creating the hook!
