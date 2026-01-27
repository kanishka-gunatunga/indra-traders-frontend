# Migration Plan: Time-Based Status → Database Status

## 🎯 The Problem

**Current State:**
- Service-booking dashboard: Calculates status from time (3 statuses: "Completed", "In Progress", "Upcoming")
- Service-center dashboard: Needs to use database statuses (4 statuses: "PENDING", "BOOKED", "COMPLETED", "CANCELLED")
- **Both dashboards need to show the same data** but use different approaches

**Goal:**
- Both dashboards use **database statuses** as the source of truth
- Stats calculation works with 4 database statuses
- Unified logic that both can use

---

## 📋 Step-by-Step Migration Plan

### **PHASE 1: Update Types & Create Unified Processor** ✅

#### Step 1.1: Update `ScheduledServiceResponse` Type

**File:** `src/types/serviceBooking.ts`

**Current:**
```typescript
export interface ScheduledServiceResponse{
    time: string;
    cab: string;
    customer: string;
    service: string;
    bay: string;
    vehicle: string;
    technician: string;
    start_time: string;
    end_time: string;
    booking_date: string;
}
```

**Update to:**
```typescript
export interface ScheduledServiceResponse{
    time: string;
    cab: string;
    customer: string;
    service: string;
    bay: string;
    vehicle: string;
    technician: string;
    start_time: string;
    end_time: string;
    booking_date: string;
    status?: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";  // NEW: from database
    id?: number;  // NEW: booking ID (if available)
}
```

**Why:** Make status optional for backward compatibility during migration.

---

#### Step 1.2: Create Unified Stats Processor

**File:** `src/utils/bookingStatsProcessor.ts` (NEW FILE)

This will be the **single source of truth** for stats calculation that both dashboards use.

```typescript
import dayjs from 'dayjs';

// Database statuses from backend
export type DatabaseStatus = "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";

// Display statuses for UI (calculated from database status + time)
export type DisplayStatus = "Completed" | "In Progress" | "Upcoming";

// Interface for any booking that has status, date, and time
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
 */
export function calculateBookingStats(
    bookings: BookingWithStatus[],
    totalTimeSlots: number  // Total available slots in a day
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

---

### **PHASE 2: Update Service-Booking Dashboard** ✅

#### Step 2.1: Update `serviceBookingProcessor.ts`

**File:** `src/utils/serviceBookingProcessor.ts`

**Update `determineStatus` function:**

```typescript
import { getDisplayStatus } from './bookingStatsProcessor';
import type { BookingWithStatus } from './bookingStatsProcessor';

// Update this function to use database status if available
export function determineStatus(service: ScheduledServiceResponse): "Completed" | "In Progress" | "Upcoming" {
    // If service has database status, use unified processor
    if (service.status && service.booking_date) {
        const booking: BookingWithStatus = {
            status: service.status,
            date: service.booking_date,
            start_time: service.start_time,
            end_time: service.end_time
        };
        return getDisplayStatus(booking);
    }
    
    // Fallback to old time-based calculation (for backward compatibility)
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    if (service.booking_date < today) {
        return "Completed";
    }
    
    if (service.booking_date > today) {
        return "Upcoming";
    }

    if (service.booking_date === today) {
        if (currentTime >= service.end_time) {
            return "Completed";
        }
        if (currentTime >= service.start_time && currentTime < service.end_time) {
            return "In Progress";
        }
        if (currentTime < service.start_time) {
            return "Upcoming";
        }
    }

    return "Upcoming";
}
```

**Update `calculateStats` function:**

```typescript
import { calculateBookingStats } from './bookingStatsProcessor';
import type { BookingWithStatus } from './bookingStatsProcessor';

export function calculateStats(
    services: ProcessedScheduledService[],
    totalTimeSlots?: number  // Add optional parameter
): DashboardStats {
    // If we have database statuses, use unified processor
    const hasDatabaseStatus = services.some(s => s.status && 'PENDING' || 'BOOKED' || 'COMPLETED' || 'CANCELLED');
    
    if (hasDatabaseStatus && totalTimeSlots) {
        const bookings: BookingWithStatus[] = services.map(s => ({
            status: s.status as DatabaseStatus,  // Type assertion needed
            date: s.booking_date,
            start_time: s.start_time,
            end_time: s.end_time
        }));
        
        const stats = calculateBookingStats(bookings, totalTimeSlots);
        return {
            totalScheduled: stats.totalScheduled,
            inProgress: stats.inProgress,
            upcoming: stats.upcoming,
            availableSlots: stats.availableSlots
        };
    }
    
    // Fallback to old calculation
    const inProgress = services.filter(s => s.status === "In Progress").length;
    const upcoming = services.filter(s => s.status === "Upcoming").length; 
    const totalScheduled = services.length;
    const availableSlots = 0;

    return {
        totalScheduled,
        inProgress,
        upcoming,
        availableSlots
    };
}
```

---

### **PHASE 3: Create Service-Center Processor** ✅

#### Step 3.1: Create `serviceCenterProcessor.ts`

**File:** `src/utils/serviceCenterProcessor.ts`

```typescript
import { ServiceCenterBooking } from '@/types/serviceCenter';
import { 
    getDisplayStatus, 
    calculateBookingStats,
    type BookingWithStatus,
    type BookingStats 
} from './bookingStatsProcessor';

// Re-export for convenience
export type { BookingStats as ServiceCenterStats };

/**
 * Converts ServiceCenterBooking to BookingWithStatus format
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
 */
export function determineServiceCenterStatus(
    booking: ServiceCenterBooking
): "Completed" | "In Progress" | "Upcoming" {
    return getDisplayStatus(toBookingWithStatus(booking));
}

/**
 * Calculates stats for service center bookings
 */
export function calculateServiceCenterStats(
    bookings: ServiceCenterBooking[],
    totalTimeSlots: number
): BookingStats {
    const bookingsWithStatus: BookingWithStatus[] = bookings.map(toBookingWithStatus);
    return calculateBookingStats(bookingsWithStatus, totalTimeSlots);
}
```

---

### **PHASE 4: Update Backend API (If Needed)** ⚠️

#### Step 4.1: Check if Service-Booking API Returns Status

**Action:** Check your backend API endpoint `/service-booking/scheduled-services`

**If it doesn't return `status` field:**
- Update backend to include `status` in response
- Or add a migration endpoint that returns status

**If it already returns `status`:**
- Great! Just update the TypeScript type (Step 1.1)

---

## 🎓 Key Concepts

### **Database Status vs Display Status**

**Database Status** (from backend):
- `PENDING` - Booking created but not confirmed
- `BOOKED` - Booking confirmed
- `COMPLETED` - Service finished
- `CANCELLED` - Booking cancelled

**Display Status** (calculated for UI):
- `Completed` - Past bookings or COMPLETED/CANCELLED
- `In Progress` - Currently happening (time is now)
- `Upcoming` - Future bookings

**Why both?**
- Database status = **persistent state** (can be updated)
- Display status = **temporal state** (changes with time)
- We combine both: Database status + current time = Display status

### **Example:**

```typescript
// Booking at 10:00 AM, current time is 10:15 AM
{
  status: "BOOKED",  // From database
  date: "2026-01-27",
  start_time: "10:00",
  end_time: "10:30"
}

// Display status calculation:
// - Database status: BOOKED ✅
// - Current time (10:15) is between start (10:00) and end (10:30) ✅
// → Display Status: "In Progress" 🟠
```

---

## ✅ Migration Checklist

### Phase 1: Foundation
- [ ] Create `src/utils/bookingStatsProcessor.ts` (unified processor)
- [ ] Update `ScheduledServiceResponse` type to include optional `status` field
- [ ] Test unified processor with sample data

### Phase 2: Service-Booking Dashboard
- [ ] Update `determineStatus()` to use database status if available
- [ ] Update `calculateStats()` to use unified processor
- [ ] Update `useScheduledServices` hook to pass `totalTimeSlots`
- [ ] Test service-booking dashboard still works

### Phase 3: Service-Center Dashboard
- [ ] Create `serviceCenterProcessor.ts` using unified processor
- [ ] Use in `useServiceCenterBookings` hook
- [ ] Test service-center dashboard

### Phase 4: Backend
- [ ] Verify `/service-booking/scheduled-services` returns `status` field
- [ ] If not, update backend or create migration plan

### Phase 5: Cleanup (After Everything Works)
- [ ] Remove old time-based calculation fallback
- [ ] Make `status` field required (not optional)
- [ ] Update all types to use database statuses

---

## 🚀 Recommended Order

**Start Here:**
1. ✅ **Create unified processor first** (`bookingStatsProcessor.ts`)
2. ✅ **Test it with service-center data** (you're building service-center now)
3. ✅ **Use it in service-center dashboard**
4. ⏸️ **Then update service-booking** (after service-center works)

**Why this order?**
- Service-center is new, so no legacy code to break
- Once unified processor works for service-center, you know it's correct
- Then migrate service-booking to use the same logic
- Less risk, easier to test

---

## 💡 Pro Tips

1. **Keep backward compatibility** during migration
   - Make `status` optional in types
   - Keep old calculation as fallback
   - Remove fallback only after everything works

2. **Test incrementally**
   - Test unified processor with sample data first
   - Then integrate into one dashboard
   - Then migrate the other

3. **Use TypeScript**
   - Types will catch errors early
   - Make `BookingWithStatus` interface so both booking types can use it

4. **Document the difference**
   - Database status = persistent
   - Display status = temporal
   - Both are needed!

---

## 🐛 Common Issues

### Issue: "Backend doesn't return status for service-booking"
**Solution:** 
- Check if backend has been updated
- If not, you can still use time-based calculation as fallback
- Update backend later

### Issue: "Stats don't match between dashboards"
**Solution:**
- Make sure both use the same `calculateBookingStats` function
- Check that `totalTimeSlots` is calculated the same way
- Verify both filter out CANCELLED bookings the same way

### Issue: "Type errors when migrating"
**Solution:**
- Make status optional first (`status?:`)
- Use type assertions where needed
- Gradually make it required after migration

---

## 📝 Summary

**The Plan:**
1. Create **unified processor** that works with database statuses
2. Use it in **service-center** first (new code, easier)
3. Migrate **service-booking** to use it (update existing code)
4. Both dashboards now use the same logic! ✅

**Key Insight:**
- Database status = **what the booking is** (PENDING, BOOKED, etc.)
- Display status = **what the booking shows** (In Progress, Upcoming, etc.)
- We combine both to get the right display status

**Start with:** Create `bookingStatsProcessor.ts` and use it in service-center dashboard. Then migrate service-booking later!
