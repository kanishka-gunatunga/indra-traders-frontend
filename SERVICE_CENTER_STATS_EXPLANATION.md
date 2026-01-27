# Service Center Stats - Reusing vs Adapting Logic

## 🎯 The Big Question: Do We Need to Rewrite Everything?

**Short Answer:** No! You can **reuse the same logic concepts**, but you need to **adapt them** for the different data structure.

---

## 📊 What's the Same?

Both dashboards calculate the **same 4 stats**:
1. **Total Scheduled** - All non-cancelled bookings
2. **In Progress** - Bookings currently happening (time is between start and end)
3. **Upcoming** - Bookings that haven't started yet
4. **Available Slots** - Time slots that aren't booked

The **logic is identical**, but the **data structures are different**.

---

## 🔄 What's Different?

### Service-Booking Dashboard:
- Uses `ScheduledServiceResponse` type
- Status is **calculated** from date/time: `"Completed" | "In Progress" | "Upcoming"`
- Fields: `booking_date`, `start_time`, `end_time`, `bay`, etc.

### Service-Center Dashboard:
- Uses `ServiceCenterBooking` type (from backend API)
- Status comes **from backend**: `"PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"`
- Fields: `date`, `start_time`, `end_time`, `line_id`, `service_type`, etc.
- **BUT**: Backend status doesn't tell us "In Progress" vs "Upcoming" - we still need to calculate that!

---

## 💡 The Solution: Adapt Existing Functions

Instead of rewriting, we'll **create new functions** that adapt the existing logic for service-center data.

### Step 1: Create `serviceCenterProcessor.ts`

Create this file: `src/utils/serviceCenterProcessor.ts`

```typescript
import { ServiceCenterBooking } from '@/types/serviceCenter';
import dayjs from 'dayjs';

// This is similar to determineStatus() but adapted for ServiceCenterBooking
export function determineServiceCenterStatus(
    booking: ServiceCenterBooking
): "Completed" | "In Progress" | "Upcoming" {
    const now = dayjs();
    const bookingDate = dayjs(booking.date);
    const currentTime = now.format('HH:mm');
    
    // If booking is cancelled, it's not active
    if (booking.status === 'CANCELLED') {
        return "Completed"; // Or handle differently if needed
    }
    
    // If booking is already completed, return Completed
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

// This is the SAME as calculateStats() but uses ServiceCenterBooking
export interface ServiceCenterStats {
    totalScheduled: number;
    inProgress: number;
    upcoming: number;
    availableSlots: number;
}

export function calculateServiceCenterStats(
    bookings: ServiceCenterBooking[],
    totalTimeSlots: number  // Total slots in a day (e.g., 18 slots from 8:00-17:00)
): ServiceCenterStats {
    // Process each booking to determine its display status
    const processedBookings = bookings.map(booking => ({
        ...booking,
        displayStatus: determineServiceCenterStatus(booking)
    }));
    
    // Calculate stats - SAME LOGIC as service-booking
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

## 🎓 Key Learning Points

### 1. **Reuse the Logic, Adapt the Data**
   - The **concept** of "In Progress" vs "Upcoming" is the same
   - Just adapt it to work with `ServiceCenterBooking` instead of `ScheduledServiceResponse`

### 2. **Backend Status vs Display Status**
   - Backend gives us: `PENDING`, `BOOKED`, `COMPLETED`, `CANCELLED`
   - But we still need to calculate: `"In Progress"` vs `"Upcoming"` based on **current time**
   - A `BOOKED` booking can be either "In Progress" (if time is now) or "Upcoming" (if time is later today)

### 3. **Available Slots Calculation**
   - Service-booking: Calculates per **bay** (multiple bays can have same time slot)
   - Service-center: Calculates per **line** (one line, one slot per time)
   - **Simpler** for service-center: `totalSlots - bookedSlots`

---

## 📝 What You Need to Do

1. **Create** `src/utils/serviceCenterProcessor.ts`
2. **Copy the logic** from `serviceBookingProcessor.ts` 
3. **Adapt it** to work with `ServiceCenterBooking` type
4. **Use it** in your hook (similar to how `useScheduledServices` uses `calculateStats`)

---

## 🔍 Example: How It Works

Let's say you have these bookings for today:

```typescript
const bookings = [
  { id: 1, date: "2026-01-27", start_time: "08:00", end_time: "08:30", status: "BOOKED" },
  { id: 2, date: "2026-01-27", start_time: "10:00", end_time: "10:30", status: "BOOKED" },
  { id: 3, date: "2026-01-27", start_time: "14:00", end_time: "14:30", status: "PENDING" },
  { id: 4, date: "2026-01-26", start_time: "08:00", end_time: "08:30", status: "BOOKED" }, // Yesterday
];
```

**Current time:** 10:15 AM

**Processing:**
- Booking 1 (08:00-08:30): `end_time` (08:30) < current time (10:15) → **"Completed"**
- Booking 2 (10:00-10:30): current time (10:15) is between start and end → **"In Progress"**
- Booking 3 (14:00-14:30): current time (10:15) < start_time (14:00) → **"Upcoming"**
- Booking 4 (yesterday): date is in past → **"Completed"**

**Stats:**
- Total Scheduled: 4 (all non-cancelled)
- In Progress: 1 (booking 2)
- Upcoming: 1 (booking 3)
- Available Slots: 18 total - 4 booked = 14

---

## ✅ Summary

**You don't need to rewrite everything!**

1. ✅ **Reuse** the logic concepts from `serviceBookingProcessor.ts`
2. ✅ **Adapt** the functions to work with `ServiceCenterBooking`
3. ✅ **Keep** the same calculation methods (filtering by status, counting, etc.)
4. ✅ **Use** the same pattern in your hook

The key is understanding that:
- **Logic** = Same (how to determine status, how to count)
- **Data** = Different (different types, different field names)
- **Solution** = Adapt existing functions, don't rewrite from scratch

---

## 🚀 Next Steps

1. Create `src/utils/serviceCenterProcessor.ts` with the adapted functions
2. Import and use them in your `useServiceCenterBookings` hook
3. The stats will update in real-time just like service-booking dashboard!
