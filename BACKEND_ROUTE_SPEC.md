# Backend Route Specification: Get All Bookings for Calendar

## Endpoint Details

**Route:** `GET /api/v1/service-center/bookings/all`

**Purpose:** Fetch all bookings for calendar dots display. This endpoint returns bookings without requiring a specific date, allowing the frontend to display calendar indicators for all dates that have bookings.

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

### Example 1: Get all bookings for a branch
```
GET /api/v1/service-center/bookings/all?branchId=1
```

### Example 2: Get bookings for a date range
```
GET /api/v1/service-center/bookings/all?branchId=1&startDate=2026-01-01&endDate=2026-12-31
```

### Example 3: Get bookings filtered by line and service type
```
GET /api/v1/service-center/bookings/all?branchId=1&lineId=3&serviceType=REPAIR
```

### Example 4: Get bookings for date range with filters
```
GET /api/v1/service-center/bookings/all?branchId=1&startDate=2026-01-01&endDate=2026-12-31&lineId=3&serviceType=REPAIR
```

---

## Response Format

**Success Response (200 OK):**

Returns an array of `ServiceCenterBooking` objects:

```json
[
  {
    "id": 1,
    "date": "2026-01-15",
    "start_time": "08:00",
    "end_time": "08:30",
    "vehicle_no": "CAB - 5482",
    "customer_name": "John Doe",
    "phone_number": "077-1234567",
    "status": "BOOKED",
    "line_id": 3,
    "service_type": "REPAIR"
  },
  {
    "id": 2,
    "date": "2026-01-15",
    "start_time": "09:00",
    "end_time": "09:30",
    "vehicle_no": "CAB - 4862",
    "customer_name": "Jane Smith",
    "phone_number": "077-9876543",
    "status": "PENDING",
    "line_id": 3,
    "service_type": "REPAIR"
  },
  {
    "id": 3,
    "date": "2026-01-16",
    "start_time": "10:00",
    "end_time": "10:30",
    "vehicle_no": "CAB - 1234",
    "customer_name": "Bob Johnson",
    "phone_number": "077-5555555",
    "status": "COMPLETED",
    "line_id": 3,
    "service_type": "REPAIR"
  }
]
```

**Error Responses:**

- **400 Bad Request:** Invalid query parameters
  ```json
  {
    "message": "Invalid branchId parameter"
  }
  ```

- **401 Unauthorized:** Missing or invalid authentication
  ```json
  {
    "message": "Unauthorized"
  }
  ```

- **404 Not Found:** Branch not found
  ```json
  {
    "message": "Branch not found"
  }
  ```

- **500 Internal Server Error:** Server error
  ```json
  {
    "message": "Internal server error"
  }
  ```

---

## Backend Implementation Notes

### Database Query Logic

1. **Base Query:** Start with all bookings for the given `branchId`
2. **Date Filtering:** 
   - If `startDate` is provided, filter: `date >= startDate`
   - If `endDate` is provided, filter: `date <= endDate`
   - If both are provided, filter: `startDate <= date <= endDate`
3. **Line Filtering:** If `lineId` is provided, filter: `line_id = lineId`
4. **Service Type Filtering:** If `serviceType` is provided, filter: `service_type = serviceType`
5. **Ordering:** Order by `date ASC, start_time ASC` for consistent results

### Important Considerations

- **Performance:** This endpoint may return a large number of bookings. Consider:
  - Adding pagination if needed (though for calendar dots, we typically need all dates)
  - Adding database indexes on `branch_id`, `date`, `line_id`, `service_type`
  - Caching results if bookings don't change frequently

- **Authentication:** Ensure the user has permission to access bookings for the specified branch

- **Data Consistency:** Return bookings regardless of their status (including CANCELLED if needed for historical display)

---

## Frontend Integration

The frontend will call this endpoint to:
1. Fetch all bookings for calendar dot display
2. Process the bookings to determine which dates have bookings
3. Determine dot colors based on booking statuses:
   - **Green dot:** Dates with COMPLETED or BOOKED status bookings
   - **Orange dot:** Dates with PENDING status bookings
   - **Red dot:** Dates with CANCELLED status bookings (optional)

---

## Testing Checklist

- [ ] Test with only `branchId` parameter
- [ ] Test with `branchId` and `startDate`
- [ ] Test with `branchId` and `endDate`
- [ ] Test with `branchId`, `startDate`, and `endDate`
- [ ] Test with `branchId` and `lineId`
- [ ] Test with `branchId` and `serviceType`
- [ ] Test with all parameters combined
- [ ] Test with invalid `branchId`
- [ ] Test with invalid date formats
- [ ] Test with non-existent `lineId`
- [ ] Test with non-existent `serviceType`
- [ ] Test authentication/authorization
- [ ] Test with large date ranges (performance)
- [ ] Verify response format matches specification
