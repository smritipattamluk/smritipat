# 📡 API Documentation

Base URL: `http://localhost:3000/api`

All API endpoints require authentication unless specified otherwise.

## Authentication

### POST /auth/[...nextauth]
NextAuth.js authentication endpoint (handled automatically by the library)

**Public endpoint - no authentication required**

## Users API

### GET /api/users
List all users

**Authorization:** ADMIN only

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN" | "MANAGER" | "ACCOUNTANT" | "VIEWER",
    "isActive": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### POST /api/users
Create a new user

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "role": "ADMIN" | "MANAGER" | "ACCOUNTANT" | "VIEWER",
  "password": "string (required, min 6 chars)"
}
```

### GET /api/users/[id]
Get user by ID

**Authorization:** ADMIN only

### PATCH /api/users/[id]
Update user

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "name": "string (optional)",
  "role": "ADMIN" | "MANAGER" | "ACCOUNTANT" | "VIEWER" (optional),
  "isActive": boolean (optional)
}
```

### DELETE /api/users/[id]
Delete user

**Authorization:** ADMIN only

## Halls API

### GET /api/halls
List all halls

**Authorization:** Authenticated users

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "capacity": number,
    "baseRent": number,
    "isActive": boolean,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

### POST /api/halls
Create a new hall

**Authorization:** ADMIN, MANAGER

**Request Body:**
```json
{
  "name": "string (required)",
  "capacity": number (required, positive integer)",
  "baseRent": number (required, positive)",
  "isActive": boolean (optional, default: true)
}
```

### GET /api/halls/[id]
Get hall by ID

**Authorization:** Authenticated users

### PATCH /api/halls/[id]
Update hall

**Authorization:** ADMIN, MANAGER

**Request Body:** Same as POST, all fields optional

### DELETE /api/halls/[id]
Delete hall

**Authorization:** ADMIN only

## Bookings API

### GET /api/bookings
List bookings with optional filters

**Authorization:** Authenticated users

**Query Parameters:**
- `hallId` (optional): Filter by hall ID
- `status` (optional): Filter by status
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "string",
    "hallId": "string",
    "customerName": "string",
    "customerPhone": "string",
    "customerEmail": "string | null",
    "eventType": "string",
    "eventDate": "date",
    "startTime": "time",
    "endTime": "time",
    "status": "INQUIRY" | "TENTATIVE" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
    "baseRent": number,
    "discountAmount": number,
    "taxRate": number,
    "notes": "string | null",
    "hall": { "name": "string" },
    "createdBy": { "name": "string" },
    "bookingCharges": [...],
    "payments": [...]
  }
]
```

### POST /api/bookings
Create a new booking

**Authorization:** Authenticated users

**Request Body:**
```json
{
  "hallId": "string (required)",
  "customerName": "string (required)",
  "customerPhone": "string (required)",
  "customerEmail": "string (optional, valid email)",
  "eventType": "string (required)",
  "eventDate": "string (required, YYYY-MM-DD)",
  "startTime": "string (required, HH:mm)",
  "endTime": "string (required, HH:mm)",
  "status": "INQUIRY" | "TENTATIVE" | "CONFIRMED" | "COMPLETED" | "CANCELLED" (optional)",
  "baseRent": number (required, positive)",
  "discountAmount": number (optional, min 0)",
  "taxRate": number (optional, 0-1)",
  "notes": "string (optional)"
}
```

**Validation:**
- Checks for overlapping bookings (same hall, date, time)
- Returns 400 if conflict found

### GET /api/bookings/[id]
Get booking by ID with all related data

**Authorization:** Authenticated users

### PATCH /api/bookings/[id]
Update booking

**Authorization:** Authenticated users

**Request Body:** Same as POST, all fields optional

### DELETE /api/bookings/[id]
Delete booking (cascades to charges and payments)

**Authorization:** Authenticated users

## Booking Charges API

### GET /api/bookings/[id]/charges
Get all charges for a booking

**Authorization:** Authenticated users

### POST /api/bookings/[id]/charges
Add a charge to booking

**Authorization:** Authenticated users

**Request Body:**
```json
{
  "type": "AC" | "DECORATION" | "SOUND" | "CATERING" | "CLEANING" | "GENERATOR" | "OTHER",
  "description": "string (required)",
  "amount": number (required, positive)
}
```

### PATCH /api/bookings/[id]/charges/[chargeId]
Update a charge

**Authorization:** Authenticated users

**Request Body:** Same as POST, all fields optional

### DELETE /api/bookings/[id]/charges/[chargeId]
Delete a charge

**Authorization:** Authenticated users

## Payments API

### GET /api/bookings/[id]/payments
Get all payments for a booking

**Authorization:** Authenticated users

### POST /api/bookings/[id]/payments
Add a payment to booking

**Authorization:** Authenticated users

**Request Body:**
```json
{
  "amount": number (required, positive),
  "type": "ADVANCE" | "FINAL" | "REFUND",
  "paymentMethod": "CASH" | "CARD" | "BANK_TRANSFER" | "UPI" | "OTHER",
  "paymentDate": "string (required, YYYY-MM-DD)",
  "reference": "string (optional)"
}
```

### PATCH /api/bookings/[id]/payments/[paymentId]
Update a payment

**Authorization:** Authenticated users

**Request Body:** Same as POST, all fields optional

### DELETE /api/bookings/[id]/payments/[paymentId]
Delete a payment

**Authorization:** Authenticated users

## Expenses API

### GET /api/expenses
List expenses with optional filters

**Authorization:** Authenticated users

**Query Parameters:**
- `category` (optional): Filter by category
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `bookingId` (optional): Filter by related booking

**Response:**
```json
[
  {
    "id": "string",
    "category": "ELECTRICITY" | "WATER" | "SALARY" | ...,
    "relatedBookingId": "string | null",
    "description": "string",
    "amount": number,
    "expenseDate": "date",
    "createdBy": { "name": "string" },
    "relatedBooking": { ... } | null
  }
]
```

### POST /api/expenses
Create a new expense

**Authorization:** Authenticated users

**Request Body:**
```json
{
  "category": "ELECTRICITY" | "WATER" | "SALARY" | "REPAIR_MAINTENANCE" | "CLEANING" | "DECORATION_MATERIAL" | "CATERING_MATERIAL" | "GENERATOR_FUEL" | "RENT" | "MISC",
  "relatedBookingId": "string (optional)",
  "description": "string (required)",
  "amount": number (required, positive)",
  "expenseDate": "string (required, YYYY-MM-DD)"
}
```

### GET /api/expenses/[id]
Get expense by ID

**Authorization:** Authenticated users

### PATCH /api/expenses/[id]
Update expense

**Authorization:** Authenticated users

**Request Body:** Same as POST, all fields optional

### DELETE /api/expenses/[id]
Delete expense

**Authorization:** Authenticated users

## Dashboard API

### GET /api/dashboard
Get dashboard statistics

**Authorization:** Authenticated users

**Query Parameters:**
- `month` (optional): YYYY-MM format (defaults to current month)

**Response:**
```json
{
  "period": {
    "start": "datetime",
    "end": "datetime"
  },
  "earnings": number,
  "expenses": number,
  "netProfit": number,
  "bookingsByStatus": {
    "INQUIRY": number,
    "TENTATIVE": number,
    "CONFIRMED": number,
    "COMPLETED": number,
    "CANCELLED": number
  },
  "upcomingBookings": [
    {
      "id": "string",
      "customerName": "string",
      "eventDate": "date",
      "eventType": "string",
      "hall": "string",
      "status": "string"
    }
  ]
}
```

## Reports API

### GET /api/reports
Generate financial report

**Authorization:** Authenticated users

**Query Parameters:**
- `startDate` (required): YYYY-MM-DD
- `endDate` (required): YYYY-MM-DD

**Response:**
```json
{
  "period": {
    "startDate": "string",
    "endDate": "string"
  },
  "bookingsCount": number,
  "earnings": {
    "totalRent": number,
    "chargesByType": {
      "AC": number,
      "DECORATION": number,
      ...
    },
    "grossEarnings": number,
    "refunds": number,
    "netEarnings": number,
    "earningsByHall": {
      "Hall Name": number,
      ...
    }
  },
  "expenses": {
    "total": number,
    "byCategory": {
      "ELECTRICITY": number,
      "SALARY": number,
      ...
    }
  },
  "netProfit": number,
  "bookings": [...]
}
```

## Settings API

### GET /api/settings
Get system settings

**Authorization:** Authenticated users

**Response:**
```json
{
  "id": "string",
  "currencySymbol": "string",
  "defaultTaxRate": number,
  "defaultHallId": "string | null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### PATCH /api/settings
Update system settings

**Authorization:** ADMIN only

**Request Body:**
```json
{
  "currencySymbol": "string (optional)",
  "defaultTaxRate": number (optional, 0-1)",
  "defaultHallId": "string (optional)"
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Error message",
  "details": [] // Zod validation errors
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Authentication

All requests (except public endpoints) must include a valid session cookie set by NextAuth.js after login.

The session includes:
- User ID
- User role
- User email

## Rate Limiting

Currently not implemented. Consider adding for production:
- Login attempts: 5 per 15 minutes
- API requests: 100 per minute per user

## CORS

Currently configured for same-origin requests only. Update Next.js middleware if cross-origin requests are needed.

## Pagination

Currently not implemented. All list endpoints return all matching records. Consider adding for large datasets:
- Query params: `page`, `limit`
- Response: Include `total`, `page`, `pages`

---

**API Version:** 1.0  
**Last Updated:** December 2025
