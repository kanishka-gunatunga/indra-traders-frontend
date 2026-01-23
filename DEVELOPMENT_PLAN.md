# Service Center Dashboard - Development Plan

## Overview
This plan outlines the step-by-step approach to implement full functionality for the Service Center Dashboard, connecting the frontend UI to backend APIs.

## Current State
- ✅ UI/UX is complete
- ✅ Component structure is in place
- ✅ Mock data is being used
- ✅ Service layer pattern exists (`src/services/`)
- ✅ Axios instance with auth is configured
- ❌ No real API integration
- ❌ No data fetching hooks
- ❌ Backend routes need to be created

## Recommended Approach: **Contract-First Development**

Start with defining API contracts, then build frontend data layer, then backend routes. This allows parallel development and clear interfaces.

---

## Phase 1: Define API Contracts & Types (Day 1)

### 1.1 Define TypeScript Interfaces
**File:** `src/types/serviceCenter.ts`

Define all data structures:
- `ServiceLine` (already exists, extend if needed)
- `TimeSlot`
- `Booking`
- `BookingStatus` ('available' | 'booked' | 'pending')
- `CalendarDot` (for calendar indicators)
- `DashboardStats`
- `CreateBookingRequest`
- `UpdateBookingRequest`

### 1.2 Define API Endpoints Contract
**File:** `API_CONTRACT.md` (create in project root)

Document expected endpoints:
```
GET    /service-center/dashboard/stats?date=YYYY-MM-DD
GET    /service-center/bookings?date=YYYY-MM-DD&lineId=number&serviceType=string
GET    /service-center/bookings/:id
POST   /service-center/bookings
PUT    /service-center/bookings/:id
DELETE /service-center/bookings/:id
GET    /service-center/calendar-dots?date=YYYY-MM-DD&lineId=number
GET    /service-center/lines?branchId=number
GET    /service-center/service-types
```

---

## Phase 2: Build Frontend Data Layer (Days 2-3)

### 2.1 Extend Service Layer
**File:** `src/services/serviceBookingService.ts`

Add functions:
```typescript
- getDashboardStats(date: string)
- getBookings(filters: { date, lineId, serviceType })
- getBookingById(id: string)
- createBooking(data: CreateBookingRequest)
- updateBooking(id: string, data: UpdateBookingRequest)
- deleteBooking(id: string)
- getCalendarDots(date: string, lineId: number)
- getServiceTypes()
```

### 2.2 Create Custom Hooks
**File:** `src/hooks/useServiceCenterDashboard.ts`

Create hooks for:
- `useDashboardStats(date)` - Fetch statistics
- `useBookings(filters)` - Fetch bookings with auto-refresh
- `useBooking(id)` - Fetch single booking
- `useCalendarDots(date, lineId)` - Fetch calendar indicators
- `useServiceLines(branchId)` - Fetch service lines
- `useServiceTypes()` - Fetch service types
- `useCreateBooking()` - Mutation hook for creating
- `useUpdateBooking()` - Mutation hook for updating
- `useDeleteBooking()` - Mutation hook for deleting

**Benefits:**
- Centralized data fetching
- Loading/error states
- Automatic refetching
- Optimistic updates

### 2.3 Create Utility Functions
**File:** `src/utils/serviceCenterUtils.ts`

Helper functions:
- `formatTimeSlot(start, end)` - Format time display
- `getSlotStatus(booking)` - Determine slot status
- `mapBookingToSlot(booking)` - Transform booking to slot format
- `validateBookingForm(data)` - Form validation

---

## Phase 3: Integrate Frontend (Days 4-5)

### 3.1 Replace Mock Data
**File:** `src/app/service-center/dashboard/page.tsx`

Replace:
- `getSlotStatus()` → Use `useBookings()` hook
- `getBookingDetails()` → Use `useBooking()` hook
- `dateCellRender()` → Use `useCalendarDots()` hook
- Mock statistics → Use `useDashboardStats()` hook
- Static service lines → Use `useServiceLines()` hook

### 3.2 Implement Form Handlers
Update:
- `handleSave()` → Call `useCreateBooking()` or `useUpdateBooking()`
- `handleCancelBooking()` → Call `useDeleteBooking()`
- Add loading states
- Add error handling/toasts
- Add success feedback

### 3.3 Add Real-time Updates
- Implement polling or WebSocket for live updates
- Add optimistic UI updates
- Handle concurrent booking conflicts

---

## Phase 4: Build Backend Routes (Days 6-8)

### 4.1 Database Schema (if not exists)
Ensure tables:
- `bookings` (id, date, time_slot_start, time_slot_end, vehicle_code, customer_name, phone_number, vehicle_model, status, line_id, service_type, created_at, updated_at)
- `service_lines` (id, name, type, branch_id, advisor_id)
- `service_types` (id, name, description)

### 4.2 Create API Routes
**Backend Routes to Create:**

1. **GET /service-center/dashboard/stats**
   - Query params: `date` (optional, defaults to today)
   - Returns: `{ totalScheduled, inProgress, upcoming, availableSlots }`

2. **GET /service-center/bookings**
   - Query params: `date`, `lineId`, `serviceType`
   - Returns: Array of bookings for the day

3. **GET /service-center/bookings/:id**
   - Returns: Single booking details

4. **POST /service-center/bookings**
   - Body: `CreateBookingRequest`
   - Validates: No double booking, time slot availability
   - Returns: Created booking

5. **PUT /service-center/bookings/:id**
   - Body: `UpdateBookingRequest`
   - Validates: Booking exists, status transitions
   - Returns: Updated booking

6. **DELETE /service-center/bookings/:id**
   - Soft delete or hard delete
   - Returns: Success message

7. **GET /service-center/calendar-dots**
   - Query params: `date`, `lineId`
   - Returns: `{ date: string, dots: ['green' | 'red' | 'orange'][] }`

8. **GET /service-center/lines**
   - Query params: `branchId`
   - Returns: Array of service lines

9. **GET /service-center/service-types**
   - Returns: Array of service types

### 4.3 Backend Validation
- Time slot validation (8:00 AM - 5:00 PM, 30-min intervals)
- No overlapping bookings
- Status transition rules
- Required field validation

---

## Phase 5: Testing & Refinement (Days 9-10)

### 5.1 Integration Testing
- Test all CRUD operations
- Test edge cases (overlapping bookings, invalid times)
- Test error scenarios (network failures, validation errors)

### 5.2 Performance Optimization
- Add caching for static data (service types, lines)
- Optimize queries (indexes, pagination if needed)
- Debounce date changes
- Lazy load calendar data

### 5.3 Error Handling
- User-friendly error messages
- Retry logic for failed requests
- Offline handling
- Loading states for all async operations

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. **Day 1**: Define types and API contracts
2. **Day 2**: Build service layer functions
3. **Day 3**: Create custom hooks
4. **Day 4**: Start backend routes (parallel with frontend)

### Week 2: Integration
5. **Day 5**: Replace mock data in frontend
6. **Day 6**: Complete backend routes
7. **Day 7**: Connect frontend to backend
8. **Day 8**: Testing and bug fixes

### Week 3: Polish
9. **Day 9**: Error handling and edge cases
10. **Day 10**: Performance optimization and final testing

---

## Quick Start: What to Do First

### Option A: Frontend-First (Recommended for faster iteration)
1. ✅ Define TypeScript types (`src/types/serviceCenter.ts`)
2. ✅ Create service functions with mock responses first
3. ✅ Create hooks that work with mock data
4. ✅ Replace mock data in component
5. ✅ Then build backend to match

### Option B: Backend-First (Recommended if backend team is ready)
1. ✅ Define API contracts
2. ✅ Build backend routes
3. ✅ Test with Postman/Thunder Client
4. ✅ Build frontend service layer
5. ✅ Integrate

---

## Files to Create/Modify

### New Files:
- `src/types/serviceCenter.ts` - Type definitions
- `src/hooks/useServiceCenterDashboard.ts` - Custom hooks
- `src/utils/serviceCenterUtils.ts` - Utility functions
- `API_CONTRACT.md` - API documentation

### Files to Modify:
- `src/services/serviceBookingService.ts` - Add new functions
- `src/app/service-center/dashboard/page.tsx` - Replace mock data
- Backend: Create new route files

---

## Key Considerations

1. **Authentication**: Ensure all routes require proper auth (already handled by axiosInstance)
2. **Branch Context**: Most queries need `branchId` - get from user session
3. **Date Handling**: Use consistent date format (YYYY-MM-DD) across frontend/backend
4. **Time Zones**: Ensure consistent timezone handling
5. **Concurrency**: Handle simultaneous booking attempts
6. **Validation**: Client-side + server-side validation

---

## Next Steps

**Start with:**
1. Create `src/types/serviceCenter.ts` with all interfaces
2. Extend `serviceBookingService.ts` with new functions
3. Create `useServiceCenterDashboard.ts` hook
4. Replace one mock function at a time in the dashboard

**Then:**
5. Share API contract with backend team
6. Build backend routes
7. Connect and test

---

## Questions to Answer Before Starting

1. **Backend Framework?** (Express, NestJS, etc.)
2. **Database?** (MySQL, PostgreSQL, etc.)
3. **Branch ID Source?** (From user session? URL param?)
4. **Real-time Updates?** (Polling, WebSocket, SSE?)
5. **Booking Conflicts?** (First-come-first-served? Queue system?)

---

## Success Criteria

- ✅ All mock data replaced with real API calls
- ✅ All CRUD operations working
- ✅ Loading states on all async operations
- ✅ Error handling with user feedback
- ✅ Calendar shows real booking indicators
- ✅ Statistics show real data
- ✅ Form validation working
- ✅ No console errors
- ✅ Performance acceptable (< 2s load time)
