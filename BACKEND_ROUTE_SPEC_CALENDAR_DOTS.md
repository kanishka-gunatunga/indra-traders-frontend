# Backend Route Specification: Calendar Dots (Lightweight Endpoint)

## Endpoint Details

**Route:** `GET /api/v1/service-center/bookings/calendar-dots`

**Purpose:** Fetch only booking dates and statuses for calendar dot display. This is a **lightweight endpoint** that returns minimal data (only `date` and `status`) to optimize performance and reduce response size.

---

## Why This Endpoint?

For calendar dots, we only need to know:
- Which dates have bookings
- What status those bookings have (to determine dot color)

We **don't need**:
- Customer names
- Phone numbers
- Vehicle numbers
- Start/end times
- Line IDs
- Service types

**Performance Benefits:**
- **Smaller response size:** ~20-30 bytes per booking vs ~200 bytes (10x reduction)
- **Faster database queries:** Only selects `date` and `status` columns
- **Faster JSON parsing:** Less data to parse
- **Lower memory usage:** Smaller objects in frontend

**Example:** For 200 bookings/month:
- Full endpoint: ~40 KB
- Calendar dots endpoint: ~4-6 KB (8-10x smaller)

---

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `branchId` | number | ✅ Yes | The branch ID to fetch bookings for |
| `startDate` | string (YYYY-MM-DD) | ❌ No | Optional start date filter. If provided, only returns bookings on or after this date |
| `endDate` | string (YYYY-MM-DD) | ❌ No | Optional end date filter. If provided, only returns bookings on or before this date |
| `lineId` | number | ❌ No | Optional filter by service line ID |
| `serviceType` | string | ❌ No | Optional filter by service type (e.g., "REPAIR", "PAINT", "ADDON") |

---

## Request Examples

### Example 1: Get calendar dots for a month
```
GET /api/v1/service-center/bookings/calendar-dots?branchId=1&startDate=2026-01-01&endDate=2026-01-31
```

### Example 2: Get calendar dots with filters
```
GET /api/v1/service-center/bookings/calendar-dots?branchId=1&startDate=2026-01-01&endDate=2026-01-31&lineId=3&serviceType=REPAIR
```

---

## Response Format

**Success Response (200 OK):**

Returns an array of lightweight booking objects with only `date` and `status`:

```json
[
  {
    "date": "2026-01-15",
    "status": "BOOKED"
  },
  {
    "date": "2026-01-15",
    "status": "PENDING"
  },
  {
    "date": "2026-01-16",
    "status": "COMPLETED"
  },
  {
    "date": "2026-01-17",
    "status": "BOOKED"
  }
]
```

**Response Size Comparison:**

For 200 bookings in a month:
- **Full endpoint** (`/bookings/all`): ~40 KB
- **Calendar dots endpoint**: ~4-6 KB (8-10x smaller)

---

## Backend Implementation Notes

### Database Query Optimization

**Select only needed columns:**
```sql
SELECT DISTINCT booking_date as date, status 
FROM isp_bookings 
WHERE branch_id = ? 
  AND booking_date >= ? 
  AND booking_date <= ?
ORDER BY booking_date ASC
```

**Key optimizations:**
1. **Use `SELECT DISTINCT`** or group by date+status to avoid duplicates
2. **Only select `booking_date` and `status`** columns
3. **No JOINs needed** (unless filtering by line_id or service_type)
4. **Index on `(branch_id, booking_date)`** for fast queries

### Response Processing

**Option 1: Return all bookings (may have duplicates)**
- Frontend groups by date and determines dot colors
- Simpler backend, slightly more data

**Option 2: Group by date on backend**
- Backend groups bookings by date and returns unique date+status combinations
- Less data transfer, slightly more backend processing

**Recommendation:** Option 1 (simpler, still very efficient)

---

## Frontend Usage

The frontend will:
1. Fetch lightweight calendar dots data
2. Group by date
3. Determine dot colors based on statuses:
   - **Green:** Has COMPLETED or BOOKED
   - **Orange:** Has PENDING
   - **Red:** Has CANCELLED (optional)

---

## Error Responses

Same as the full bookings endpoint:
- **400 Bad Request:** Invalid query parameters
- **401 Unauthorized:** Missing or invalid authentication
- **404 Not Found:** Branch not found
- **500 Internal Server Error:** Server error

---

## Migration Path

1. **Phase 1:** Create new endpoint `/calendar-dots`
2. **Phase 2:** Update frontend to use new endpoint
3. **Phase 3:** Monitor performance improvements
4. **Phase 4:** (Optional) Deprecate using `/all` for calendar dots

---

## Testing Recommendations

Test with realistic data volumes:

1. **Small branch** (~50 bookings/month) → Should be very fast (< 100ms)
2. **Medium branch** (~200 bookings/month) → Should be fast (< 200ms)
3. **Large branch** (~500+ bookings/month) → Should still be fast (< 500ms)

Compare response sizes:
- Full endpoint response size
- Calendar dots endpoint response size
- Expected: 8-10x reduction
