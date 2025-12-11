# 🚀 Quick Start Guide - Smritipat Hall Management

## Prerequisites Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Database user with create permissions

## Setup Steps (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Edit `.env` file:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smritipat?schema=public"
```

### 3. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE smritipat;

# Exit
\q
```

### 4. Run Migrations
```bash
npx prisma migrate dev --name init
```

### 5. Seed Data
```bash
npm run db:seed
```

### 6. Start Application
```bash
npm run dev
```

### 7. Login
Open http://localhost:3000 and login with:
- **Email:** admin@smritipat.com
- **Password:** Admin@123

## Common Issues

**Can't connect to database?**
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Prisma errors?**
```bash
npx prisma generate
```

## Next Steps

1. ✅ Login with admin credentials
2. ✅ Change default passwords in Users page
3. ✅ Add your hall details in Halls page
4. ✅ Update system settings (Settings page)
5. ✅ Create your first booking

## Need Help?

Check the main README.md for detailed documentation.
