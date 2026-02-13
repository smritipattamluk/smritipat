# 🔍 Audit Log Troubleshooting Guide

## Issue: Audit Logs Are Empty

If the audit logs page (`/logs`) shows no entries even though users are performing actions (creating expenses, bookings, etc.), follow this troubleshooting guide.

---

## ✅ Fixed: Logger Functions Now Return Promises Properly

**Issue Identified:** The logger convenience functions were not explicitly marked as `async` or returning the promise from `createAuditLog`. This could cause timing issues where the API response is sent before the log is written.

**Fix Applied:** Updated `lib/audit-logger.ts` to make all logger functions async and explicitly return promises:

```typescript
export const logger = {
  created: async (entity: string, entityId: string, userId?: string, metadata?: Record<string, any>) => {
    return createAuditLog({...});
  },
  // ... all other functions now async
};
```

This ensures that when code calls `await logger.created(...)`, it properly waits for the log to be written to the database.

---

## 🧪 Testing the Fix

### 1. Create a Test Expense

As an Admin or Accountant user:

1. Navigate to `/expenses`
2. Click "New Expense"
3. Fill in:
   - Category: MISC
   - Description: "Test audit log"
   - Amount: 100
   - Expense Date: Today
4. Click "Create Expense"

### 2. Check the Audit Logs

As an Admin user:

1. Navigate to `/logs`
2. You should see a new entry:
   - Action: CREATE
   - Entity: expense
   - Level: INFO
   - Message: "expense created successfully"
   - User: Your username
   - Timestamp: Just now

### 3. Test Update and Delete

1. Edit the test expense → Check logs for UPDATE entry
2. Delete the test expense → Check logs for DELETE entry

---

## 🔧 Additional Troubleshooting Steps

If logs are still empty after the fix:

### Step 1: Verify Database Schema

Check if the `audit_logs` table exists:

```powershell
cd e:\Smritipat\smritipat-app
npx prisma studio
```

In Prisma Studio:
- Look for `AuditLog` model
- Check if table exists in database
- Verify table structure matches schema

### Step 2: Check Database Migrations

Ensure all migrations are applied:

```powershell
npx prisma migrate status
```

If migrations are pending:

```powershell
npx prisma migrate deploy
```

Or if using `db push`:

```powershell
npx prisma db push
```

### Step 3: Test Database Connection

Create a test script to verify logging works:

```typescript
// test-audit-log.ts
import { logger } from './lib/audit-logger';

async function testLog() {
  try {
    await logger.created('test', 'test-123', 'admin-user-id', { 
      note: 'Testing audit log system' 
    });
    console.log('✅ Log created successfully');
  } catch (error) {
    console.error('❌ Log creation failed:', error);
  }
}

testLog();
```

Run:
```powershell
npx tsx test-audit-log.ts
```

### Step 4: Check Console for Errors

In development mode, logging errors are printed to console:

```typescript
// In lib/audit-logger.ts
if (process.env.NODE_ENV === 'development') {
  console.log(`[${options.level}] ${options.action} ${options.entity}:`, options.message);
}
```

Look for these console messages when actions are performed.

### Step 5: Verify Prisma Client is Generated

Sometimes the Prisma client needs to be regenerated:

```powershell
npx prisma generate
```

Then restart the dev server.

---

## 🐛 Common Issues & Solutions

### Issue: "Unknown field: auditLog" Error

**Cause:** Prisma client not generated after schema changes

**Solution:**
```powershell
npx prisma generate
npm run dev  # Restart server
```

### Issue: Logs Work in Development but Not Production

**Cause:** Environment variables or database connection issues

**Solution:**
1. Check `.env` has correct DATABASE_URL
2. Ensure production database has migrations applied
3. Verify Prisma client is generated in build process

### Issue: Some Actions Log, Others Don't

**Cause:** Not all API routes are calling logger functions

**Solution:** Check that all routes include logging:
- `app/api/expenses/route.ts` - ✅ Has logging
- `app/api/expenses/[id]/route.ts` - ✅ Has logging  
- `app/api/bookings/route.ts` - ✅ Has logging
- `app/api/bookings/[id]/route.ts` - ✅ Has logging
- `app/api/users/route.ts` - ✅ Has logging
- `app/api/users/[id]/route.ts` - ✅ Has logging
- `app/api/halls/route.ts` - ✅ Has logging
- `app/api/halls/[id]/route.ts` - ✅ Has logging

### Issue: Metadata Field Shows `{}`

**Cause:** `metadata` is optional and may be empty

**Solution:** This is normal. Metadata contains additional context when provided:
```typescript
await logger.created('expense', expense.id, session.user.id, {
  category: expense.category,
  amount: expense.amount,
  description: expense.description,
  ipAddress,
  userAgent,
});
```

---

## 📝 Verification Checklist

After implementing fixes, verify:

- [ ] `audit_logs` table exists in database
- [ ] Prisma schema includes `AuditLog` model
- [ ] Migrations are applied (`npx prisma migrate status`)
- [ ] Logger functions are `async` and return promises
- [ ] All API routes call `await logger.*()` after operations
- [ ] Test expense creation shows log entry
- [ ] Test expense update shows log entry
- [ ] Test expense deletion shows log entry
- [ ] Test booking creation shows log entry (as Admin/Manager)
- [ ] Logs page displays entries with correct information
- [ ] Logs can be filtered by level, action, entity
- [ ] User information is correctly linked in logs

---

## 🔍 Inspecting Logs Manually

### Via Prisma Studio

```powershell
npx prisma studio
```

Navigate to `AuditLog` model to see raw log entries.

### Via Database Query

```sql
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

### Via API (for Admins)

```bash
curl http://localhost:3000/api/logs?limit=10
```

---

## 📊 Expected Log Entries

### Expense Operations

**Create:**
```json
{
  "action": "CREATE",
  "entity": "expense",
  "entityId": "clx...",
  "level": "INFO",
  "message": "expense created successfully",
  "metadata": {
    "category": "ELECTRICITY",
    "amount": 5000,
    "description": "Monthly electricity bill"
  }
}
```

**Update:**
```json
{
  "action": "UPDATE",
  "entity": "expense",
  "entityId": "clx...",
  "level": "INFO",
  "message": "expense updated successfully",
  "metadata": {
    "amount": 5500
  }
}
```

**Delete:**
```json
{
  "action": "DELETE",
  "entity": "expense",
  "entityId": "clx...",
  "level": "INFO",
  "message": "expense deleted",
  "metadata": {
    "category": "ELECTRICITY",
    "amount": 5500
  }
}
```

---

## 🚀 Next Steps

Once logs are working:

1. **Monitor Log Growth:** Logs can grow large over time
2. **Implement Log Rotation:** Use the DELETE endpoint to clean old logs
3. **Add Export Logging:** Currently report exports are not logged (client-side operation)
4. **Add Login Logging:** Implement login/logout logging in NextAuth callbacks
5. **Add Report Viewing Logs:** Log when users view sensitive reports

---

## 📞 Getting Support

If issues persist after following this guide:

1. Check the server console for error messages
2. Verify database connection is working for other operations
3. Check Prisma client version compatibility
4. Review NextJS and database logs
5. Contact the development team with:
   - Error messages (screenshots)
   - Steps to reproduce
   - Database migration status
   - Node/npm versions

---

## ✅ Success Indicators

You'll know logging is working when:

- ✅ Audit logs page shows recent entries
- ✅ Each user action creates a new log entry
- ✅ Log entries include correct user, timestamp, and action
- ✅ Metadata contains relevant details
- ✅ Filters work correctly on logs page
- ✅ No errors in server console related to logging
- ✅ Database `audit_logs` table contains records

---

**Last Updated:** December 2024  
**System Version:** Smritipat v1.0
