# Service Center Dashboard - Frontend Integration Guide

## 🎯 Overview

This guide will teach you how to connect your Service Center dashboard to the backend API. We'll follow the same patterns used in your `service-booking` dashboard.

---

## 📚 Understanding the Architecture

Before we start coding, let's understand the pattern your project uses:

### 1. **Service Layer** (`src/services/`)
   - Contains API call functions
   - Uses `axiosInstance` (already configured with base URL and auth)
   - Each service file handles one domain (e.g., `serviceCenterService.ts`)

### 2. **Custom Hooks** (`src/hooks/`)
   - Manages component state (loading, error, data)
   - Calls service functions
   - Handles data processing/transformation
   - Example: `useScheduledServices.ts`

### 3. **Type Definitions** (`src/types/`)
   - TypeScript interfaces matching API responses
   - Ensures type safety

### 4. **Utility Functions** (`src/utils/`)
   - Helper functions for data processing
   - Business logic (e.g., calculating stats)

---

## 🗺️ Step-by-Step Implementation Plan

### **STEP 1: Update TypeScript Types** ✅

**What you'll do:**
Update `src/types/serviceCenter.ts` to match the backend API response shapes.

**Why:**
TypeScript types help catch errors early and provide autocomplete in your IDE.

**Your task:**
1. Open `src/types/serviceCenter.ts`
2. Add a new interface `ServiceCenterBooking` that matches the backend response:
   ```typescript
   export interface ServiceCenterBooking {
     id: number;
     date: string;           // YYYY-MM-DD
     start_time: string;     // "HH:mm"
     end_time: string;       // "HH:mm"
     vehicle_no: string | null;
     customer_name: string | null;
     phone_number: string | null;
     status: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED";
     line_id: number | null;
     service_type: string | null;  // "REPAIR" | "PAINT" | "ADDON"
   }
   ```

3. Add interface for Service Line:
   ```typescript
   export interface ServiceLine {
     id: number;
     name: string;
     type: string;  // "REPAIR" | "PAINT" | "ADDON"
     advisor: string;
   }
   ```

4. Keep your existing types (`BookingStatus`, `SlotStatus`, etc.) but note that backend uses uppercase: `"PENDING"`, `"BOOKED"`, etc.

**Questions to think about:**
- How will you convert between your frontend status format (`'booked'`) and backend format (`'BOOKED'`)?
- Should you create a mapping function?

---

### **STEP 2: Create Service File** ✅

**What you'll do:**
Create `src/services/serviceCenterService.ts` with all API functions.

**Why:**
Centralizing API calls makes them reusable and easier to test.

**Your task:**
1. Create the file `src/services/serviceCenterService.ts`
2. Import `axiosInstance` from `@/utils/axiosinstance`
3. Create these functions (follow the pattern from `serviceBookingService.ts`):

   **a) Get Service Types:**
   ```typescript
   export const getServiceTypes = async (): Promise<string[]> => {
     const res = await axiosInstance.get('/service-center/service-types');
     return res.data;  // Returns: ["REPAIR", "PAINT", "ADDON"]
   };
   ```

   **b) Get Service Lines:**
   ```typescript
   export const getServiceLines = async (branchId: number): Promise<ServiceLine[]> => {
     const res = await axiosInstance.get(`/service-park/branches/${branchId}/lines`);
     return res.data;
   };
   ```

   **c) Get Bookings:**
   ```typescript
   export const getBookings = async (
     date: string,        // YYYY-MM-DD
     branchId: number,
     lineId?: number,
     serviceType?: string
   ): Promise<ServiceCenterBooking[]> => {
     const params = new URLSearchParams({
       date,
       branchId: branchId.toString(),
     });
     
     if (lineId) params.append('lineId', lineId.toString());
     if (serviceType) params.append('serviceType', serviceType);
     
     const res = await axiosInstance.get(`/service-center/bookings?${params}`);
     return res.data;
   };
   ```

   **d) Get Single Booking:**
   ```typescript
   export const getBookingById = async (id: number): Promise<ServiceCenterBooking> => {
     const res = await axiosInstance.get(`/service-center/bookings/${id}`);
     return res.data;
   };
   ```

   **e) Create Booking:**
   ```typescript
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
     const res = await axiosInstance.post('/service-center/bookings', data);
     return res.data;
   };
   ```

   **f) Update Booking Status:**
   ```typescript
   export const updateBookingStatus = async (
     id: number,
     status: "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"
   ): Promise<ServiceCenterBooking> => {
     const res = await axiosInstance.put(`/service-center/bookings/${id}`, { status });
     return res.data;
   };
   ```

4. Add error handling (try-catch) like in `serviceBookingService.ts`
5. Import the types you created in Step 1

**Tips:**
- Notice the backend uses `snake_case` in request bodies (`branch_id`, `line_id`) but `camelCase` in query params (`branchId`)
- Always handle errors and log them for debugging

---

### **STEP 3: Create Utility Functions for Stats** ✅

**What you'll do:**
Create functions to calculate stats from bookings data.

**Why:**
Business logic should be separated from components. This makes it testable and reusable.

**Your task:**
1. Create or update `src/utils/serviceCenterProcessor.ts`
2. Create a function to calculate stats:

   ```typescript
   import { ServiceCenterBooking } from '@/types/serviceCenter';
   import dayjs from 'dayjs';

   export interface ServiceCenterStats {
     totalScheduled: number;
     inProgress: number;
     upcoming: number;
     availableSlots: number;
   }

   export const calculateServiceCenterStats = (
     bookings: ServiceCenterBooking[],
     selectedDate: string,  // YYYY-MM-DD
     totalTimeSlots: number  // Total available slots for the day (e.g., 18 slots from 8:00-17:00)
   ): ServiceCenterStats => {
     const now = dayjs();
     const selectedDateObj = dayjs(selectedDate);
     const isToday = selectedDateObj.isSame(now, 'day');

     // Filter bookings for the selected date
     const dayBookings = bookings.filter(b => b.date === selectedDate);

     // Total Scheduled = all non-cancelled bookings
     const totalScheduled = dayBookings.filter(
       b => b.status !== 'CANCELLED'
     ).length;

     // In Progress = BOOKED status bookings that have started (if today)
     let inProgress = 0;
     if (isToday) {
       inProgress = dayBookings.filter(b => {
         if (b.status !== 'BOOKED') return false;
         const slotStart = dayjs(`${b.date} ${b.start_time}`);
         const slotEnd = dayjs(`${b.date} ${b.end_time}`);
         return now.isAfter(slotStart) && now.isBefore(slotEnd);
       }).length;
     }

     // Upcoming = BOOKED or PENDING bookings that haven't started yet (if today)
     // OR all non-cancelled bookings if not today
     let upcoming = 0;
     if (isToday) {
       upcoming = dayBookings.filter(b => {
         if (b.status === 'CANCELLED' || b.status === 'COMPLETED') return false;
         const slotStart = dayjs(`${b.date} ${b.start_time}`);
         return now.isBefore(slotStart);
       }).length;
     } else {
       upcoming = dayBookings.filter(
         b => b.status !== 'CANCELLED' && b.status !== 'COMPLETED'
       ).length;
     }

     // Available Slots = total slots - booked slots (non-cancelled)
     const bookedSlots = dayBookings.filter(
       b => b.status !== 'CANCELLED'
     ).length;
     const availableSlots = Math.max(0, totalTimeSlots - bookedSlots);

     return {
       totalScheduled,
       inProgress,
       upcoming,
       availableSlots
     };
   };
   ```

3. Create a function to map bookings to time slots:

   ```typescript
   export const mapBookingsToTimeSlots = (
     bookings: ServiceCenterBooking[],
     timeSlots: Array<{ start: string; end: string; label: string }>,
     selectedDate: string
   ) => {
     // Create a map of start_time -> booking
     const bookingMap = new Map<string, ServiceCenterBooking>();
     bookings
       .filter(b => b.date === selectedDate)
       .forEach(booking => {
         bookingMap.set(booking.start_time, booking);
       });

     // Map each time slot to its status
     return timeSlots.map(slot => {
       const booking = bookingMap.get(slot.start);
       
       if (!booking) {
         return {
           ...slot,
           status: 'available' as const,
           vehicleCode: null,
           vehicleNo: null,
           bookingId: null
         };
       }

       // Convert backend status to frontend status
       const statusMap: Record<string, 'booked' | 'pending'> = {
         'BOOKED': 'booked',
         'PENDING': 'pending',
         'COMPLETED': 'booked',  // Show completed as booked
         'CANCELLED': 'available'  // Cancelled slots are available
       };

       return {
         ...slot,
         status: statusMap[booking.status] || 'available',
         vehicleCode: booking.vehicle_no || null,
         vehicleNo: booking.vehicle_no || null,
         bookingId: booking.id
       };
     });
   };
   ```

**Questions to think about:**
- How do you determine if a booking is "In Progress"? (Hint: current time is between start_time and end_time)
- What should happen to CANCELLED bookings in the stats?

---

### **STEP 4: Create Custom Hook** ✅

**What you'll do:**
Create `src/hooks/useServiceCenterBookings.ts` to manage all the data fetching and state.

**Why:**
Hooks encapsulate logic and make components cleaner. Look at `useScheduledServices.ts` as a reference.

**Your task:**
1. Create `src/hooks/useServiceCenterBookings.ts`
2. Structure it like this:

   ```typescript
   import { useState, useEffect, useRef } from 'react';
   import { useSession } from 'next-auth/react';
   import dayjs from 'dayjs';
   import {
     getServiceTypes,
     getServiceLines,
     getBookings,
     createBooking as createBookingAPI,
     updateBookingStatus as updateBookingStatusAPI
   } from '@/services/serviceCenterService';
   import { calculateServiceCenterStats, mapBookingsToTimeSlots } from '@/utils/serviceCenterProcessor';
   import { ServiceCenterBooking, ServiceLine } from '@/types/serviceCenter';

   export function useServiceCenterBookings(selectedDate: dayjs.Dayjs, selectedLineId: number | null, selectedServiceType: string | null) {
     const { data: session } = useSession();
     const branchId = session?.user?.branchId ? Number(session.user.branchId) : null;

     // State declarations
     const [serviceTypes, setServiceTypes] = useState<string[]>([]);
     const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
     const [bookings, setBookings] = useState<ServiceCenterBooking[]>([]);
     const [stats, setStats] = useState({ totalScheduled: 0, inProgress: 0, upcoming: 0, availableSlots: 0 });
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     // Fetch service types (once on mount)
     useEffect(() => {
       // Your code here - call getServiceTypes()
     }, []);

     // Fetch service lines (when branchId or selectedServiceType changes)
     useEffect(() => {
       // Your code here - call getServiceLines()
     }, [branchId, selectedServiceType]);

     // Fetch bookings (when date, branchId, lineId, or serviceType changes)
     useEffect(() => {
       // Your code here - call getBookings() and calculate stats
     }, [selectedDate, branchId, selectedLineId, selectedServiceType]);

     // Auto-refresh every 30 seconds
     useEffect(() => {
       // Your code here - setInterval to refetch bookings
     }, [selectedDate, branchId, selectedLineId, selectedServiceType]);

     // Functions to create/update bookings
     const createBooking = async (data: {...}) => {
       // Your code here
     };

     const updateBooking = async (id: number, status: string) => {
       // Your code here
     };

     return {
       serviceTypes,
       serviceLines,
       bookings,
       stats,
       loading,
       error,
       createBooking,
       updateBooking
     };
   }
   ```

3. **Key things to implement:**
   - Fetch service types on mount (only once)
   - Fetch service lines when `branchId` or `selectedServiceType` changes
   - Fetch bookings when date/line/serviceType changes
   - Calculate stats using your utility function
   - Auto-refresh every 30 seconds (like `useScheduledServices` does)
   - Handle loading and error states

**Tips:**
- Use `dayjs` to format dates as `YYYY-MM-DD` for API calls
- Remember to filter service lines by `selectedServiceType` if needed
- Set loading to `false` after first load, but keep refreshing in background

---

### **STEP 5: Update Dashboard Component** ✅

**What you'll do:**
Replace hardcoded data with real API data in your dashboard.

**Your task:**
1. In `src/app/service-center/dashboard/page.tsx`:
   
   **a) Import the hook:**
   ```typescript
   import { useServiceCenterBookings } from '@/hooks/useServiceCenterBookings';
   ```

   **b) Replace hardcoded stats:**
   - Remove the hardcoded `0` values in the stats cards (lines 311, 318, 325, 332)
   - Use `stats` from your hook instead

   **c) Replace mock service types and lines:**
   - Remove hardcoded options in Select components
   - Use `serviceTypes` and `serviceLines` from your hook
   - Map service types: `REPAIR` → `"Repair"` for display

   **d) Replace mock slot data:**
   - Remove `getSlotStatus()` and `getBookingDetails()` mock functions
   - Use `mapBookingsToTimeSlots()` to get real slot data
   - Update `handleSlotClick` to use real booking IDs

   **e) Add loading and error states:**
   - Show loading spinner while `loading === true`
   - Show error message if `error` exists

2. **Update the modal:**
   - When creating a booking, call `createBooking` from your hook
   - When updating status, call `updateBooking` from your hook
   - Handle 409 conflict error (slot already booked)

**Tips:**
- Use the same loading/error UI pattern as `service-booking/dashboard/page.tsx`
- After creating/updating a booking, the hook should auto-refresh
- Format dates/times correctly when sending to API

---

### **STEP 6: Handle Create Booking** ✅

**What you'll do:**
Implement the "Save" button in the modal to create a new booking.

**Your task:**
1. In your `handleSave` function:
   ```typescript
   const handleSave = async () => {
     if (!selectedBooking || !branchId) return;

     try {
       if (isAvailableSlot) {
         // Create new booking
         await createBooking({
           branch_id: branchId,
           line_id: selectedLineId!,
           date: selectedDate.format('YYYY-MM-DD'),
           start_time: selectedBooking.slotStart,
           end_time: selectedBooking.slotEnd,
           vehicle_no: formData.vehicleCode,
           customer_name: formData.customerName,
           phone_number: formData.phoneNumber,
           // Note: vehicleModel is not in API, you might need to handle this differently
         });
       } else {
         // Update existing booking status
         await updateBooking(selectedBooking.bookingId!, bookingStatus);
       }
       
       setIsModalOpen(false);
       // Hook will auto-refresh, so data updates automatically
     } catch (error: any) {
       // Handle 409 conflict (slot already booked)
       if (error.response?.status === 409) {
         alert('This slot is already booked. Please choose another time.');
       } else {
         alert('Failed to save booking: ' + (error.response?.data?.message || error.message));
       }
     }
   };
   ```

2. **Validation:**
   - Check all required fields are filled
   - Validate phone number format (optional but good practice)
   - Show user-friendly error messages

---

### **STEP 7: Handle Update Booking Status** ✅

**What you'll do:**
Allow users to change booking status in the modal.

**Your task:**
1. The status dropdown already exists in your modal
2. When user changes status, update `bookingStatus` state
3. On "Save", call `updateBooking` with the new status
4. Convert frontend status format to backend format:
   ```typescript
   const statusToBackend = (status: string): "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED" => {
     const map: Record<string, "PENDING" | "BOOKED" | "COMPLETED" | "CANCELLED"> = {
       'pending': 'PENDING',
       'booked': 'BOOKED',
       'available': 'CANCELLED'  // If user sets to available, cancel the booking
     };
     return map[status] || 'BOOKED';
   };
   ```

---

### **STEP 8: Handle Cancel Booking** ✅

**What you'll do:**
Implement the "Cancel Booking" button.

**Your task:**
1. In `handleCancelBooking`:
   ```typescript
   const handleCancelBooking = async () => {
     if (!selectedBooking?.bookingId) return;
     
     try {
       await updateBooking(selectedBooking.bookingId, 'CANCELLED');
       setIsModalOpen(false);
     } catch (error: any) {
       alert('Failed to cancel booking: ' + (error.response?.data?.message || error.message));
     }
   };
   ```

---

### **STEP 9: Calendar Dots** ✅

**What you'll do:**
Show colored dots on calendar dates based on booking statuses.

**Your task:**
1. In `dateCellRender` function:
   ```typescript
   const dateCellRender = (date: dayjs.Dayjs) => {
     const dateStr = date.format('YYYY-MM-DD');
     
     // Get bookings for this date
     const dayBookings = bookings.filter(b => b.date === dateStr);
     
     // Determine dot colors based on booking statuses
     const hasBooked = dayBookings.some(b => b.status === 'BOOKED');
     const hasPending = dayBookings.some(b => b.status === 'PENDING');
     const hasCompleted = dayBookings.some(b => b.status === 'COMPLETED');
     
     const dotColors: string[] = [];
     if (hasCompleted || hasBooked) dotColors.push('green');
     if (hasPending) dotColors.push('orange');
     // Add red if needed (e.g., cancelled bookings)
     
     return (
       <div className="flex justify-start items-end w-full gap-[4px]">
         {dotColors.slice(0, 3).map((color: string, i: number) => (
           <span
             key={i}
             className={`w-[7px] h-[7px] rounded-full ${
               color === 'green' ? 'bg-[#039855]' : 
               color === 'red' ? 'bg-[#DB2727]' : 
               'bg-[#FF961B]'
             }`}
           />
         ))}
       </div>
     );
   };
   ```

---

### **STEP 10: Error Handling & Polish** ✅

**What you'll do:**
Add proper error handling and user feedback throughout.

**Your task:**
1. **Loading states:**
   - Show spinner while fetching initial data
   - Show "Saving..." when creating/updating bookings
   - Disable buttons during API calls

2. **Error messages:**
   - Display API errors in user-friendly format
   - Handle network errors
   - Handle 400, 404, 409, 500 status codes appropriately

3. **Success feedback:**
   - Show success message after creating/updating (optional, but nice UX)
   - Auto-close modal on success

4. **Edge cases:**
   - What if `branchId` is null?
   - What if no service lines are available?
   - What if date is in the past?

---

## 🎓 Learning Points

### **Key Concepts:**

1. **Separation of Concerns:**
   - Services = API calls
   - Hooks = State management + data fetching
   - Components = UI rendering
   - Utils = Business logic

2. **Type Safety:**
   - TypeScript types prevent bugs
   - Match types to API responses exactly

3. **Error Handling:**
   - Always wrap API calls in try-catch
   - Show user-friendly error messages
   - Log errors for debugging

4. **State Management:**
   - Use hooks to manage complex state
   - Keep components focused on rendering

5. **Real-time Updates:**
   - Use `setInterval` to refresh data
   - Update state after mutations (create/update)

---

## 🐛 Common Issues & Solutions

### Issue 1: "branchId is null"
**Solution:** Check if user session has `branchId`. Show error if missing.

### Issue 2: "CORS error"
**Solution:** Backend should allow your frontend origin. Check `axiosInstance` base URL.

### Issue 3: "409 Conflict - slot already booked"
**Solution:** This is expected! Show user-friendly message and let them choose another slot.

### Issue 4: "Stats not updating"
**Solution:** Make sure you're recalculating stats after fetching bookings. Check your `calculateServiceCenterStats` function.

### Issue 5: "Date format mismatch"
**Solution:** Always use `YYYY-MM-DD` format. Use `dayjs().format('YYYY-MM-DD')`.

---

## ✅ Checklist

Before you consider this complete:

- [ ] All TypeScript types match API responses
- [ ] Service functions handle errors properly
- [ ] Hook fetches data on mount and when filters change
- [ ] Stats calculate correctly from bookings
- [ ] Time slots show real booking data
- [ ] Create booking works and shows success/error
- [ ] Update booking status works
- [ ] Cancel booking works
- [ ] Calendar dots show correct colors
- [ ] Loading states work
- [ ] Error messages are user-friendly
- [ ] Auto-refresh works (every 30 seconds)
- [ ] No console errors

---

## 🚀 Next Steps

Once you complete all steps:

1. Test with real backend
2. Handle edge cases (no data, network errors, etc.)
3. Add loading skeletons for better UX
4. Consider adding optimistic updates (update UI immediately, rollback on error)
5. Add unit tests for utility functions

---

## 💡 Pro Tips

1. **Use React DevTools** to inspect state changes
2. **Use Network tab** in browser DevTools to see API calls
3. **Console.log** is your friend during development
4. **Break problems into smaller pieces** - don't try to do everything at once
5. **Test incrementally** - test each step before moving to the next

---

Good luck! You've got this! 🎉
