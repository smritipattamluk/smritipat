# Smritipat - Reception Hall Management System

A comprehensive web application for managing reception hall bookings, finances, and operations. Built with modern TypeScript-based stack for internal business use.

## 🏗️ Technology Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **UI Components:** React with shadcn/ui, Tailwind CSS
- **Backend:** Next.js Route Handlers (RESTful API)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with role-based access control
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod validation
- **Date Utilities:** date-fns
- **Charts:** Recharts

## ✨ Features

### User Management & Authentication
- Secure login with email and password
- Role-based access control (RBAC)
  - **ADMIN:** Full system access, user management, settings
  - **MANAGER:** Booking management, hall management
  - **ACCOUNTANT:** Financial data access, expense management
  - **VIEWER:** Read-only access to bookings and reports
- Protected routes with middleware

### Booking Management
- Create, view, edit, and delete bookings
- Track booking status (Inquiry, Tentative, Confirmed, Completed, Cancelled)
- Prevent double-booking with time slot validation
- Customer information management
- Event type categorization
- Additional charges tracking (AC, Decoration, Sound, etc.)
- Payment tracking with multiple payment types (Advance, Final, Refund)

### Financial Management
- Track expenses by category
- Link expenses to specific bookings
- Automatic calculation of:
  - Base rent + additional charges
  - Discounts and tax
  - Total payments and refunds
  - Outstanding balance
- Multi-currency support

### Reports & Analytics
- Dashboard with key metrics
  - Total earnings, expenses, and net profit
  - Bookings by status
  - Upcoming events
- Custom date range reports
- Earnings breakdown by hall and charge type
- Expense breakdown by category
- Profit/loss analysis

### Hall Management
- Manage multiple halls
- Set capacity and base rent
- Activate/deactivate halls

### System Settings
- Configurable currency symbol
- Default tax rate configuration

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js:** Version 18.x or higher
- **PostgreSQL:** Version 12 or higher
- **npm or yarn:** Package manager

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE smritipat;
```

### 3. Environment Configuration

The `.env` file is already created with default values. Update it with your database credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smritipat?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:** 
- Replace `YOUR_PASSWORD` with your PostgreSQL password
- Generate a secure `NEXTAUTH_SECRET` for production:
  ```bash
  openssl rand -base64 32
  ```

### 4. Database Migration

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables
- Set up relationships and indexes
- Generate the Prisma Client

### 5. Seed Database

Populate the database with initial data:

```bash
npm run db:seed
```

This creates:
- System settings (currency: ₹, tax rate: 18%)
- Main hall: "Smritipat Main Hall"
- Default user accounts (see credentials below)

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🔑 Default User Credentials

The seed script creates three user accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@smritipat.com | Admin@123 |
| **Manager** | manager@smritipat.com | Manager@123 |
| **Accountant** | accountant@smritipat.com | Accountant@123 |

**⚠️ Security Note:** Change these passwords immediately after first login in a production environment.

## 📁 Project Structure

```
smritipat-app/
├── app/
│   ├── api/                    # API route handlers
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bookings/          # Booking CRUD + charges/payments
│   │   ├── dashboard/         # Dashboard statistics
│   │   ├── expenses/          # Expense management
│   │   ├── halls/             # Hall management
│   │   ├── reports/           # Financial reports
│   │   ├── settings/          # System settings
│   │   └── users/             # User management
│   ├── bookings/              # Booking pages
│   ├── dashboard/             # Dashboard page
│   ├── expenses/              # Expense pages
│   ├── halls/                 # Hall management pages
│   ├── login/                 # Login page
│   ├── reports/               # Reports page
│   ├── settings/              # Settings page
│   ├── users/                 # User management pages
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Home page (redirects to dashboard)
├── components/
│   ├── layout/                # Layout components
│   │   └── protected-layout.tsx  # Main app layout with sidebar
│   ├── providers.tsx          # React Query + NextAuth providers
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── auth-utils.ts          # Authorization helpers
│   ├── calculations.ts        # Business logic utilities
│   ├── db.ts                  # Prisma client instance
│   └── utils.ts               # General utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── types/
│   └── next-auth.d.ts         # NextAuth type definitions
├── .env                       # Environment variables
├── middleware.ts              # Route protection middleware
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio (database GUI)
```

## 🎨 Key Features Deep Dive

### Booking Workflow

1. **Create Booking:** Enter customer details, select hall, date, and time
2. **Add Charges:** Add additional services (AC, decoration, catering, etc.)
3. **Record Payments:** Track advances and final payments
4. **Auto-calculations:** System automatically calculates:
   - Total charges = Base rent + Additional charges
   - Subtotal = Total charges - Discount
   - Tax amount = Subtotal × Tax rate
   - Grand total = Subtotal + Tax
   - Balance = Grand total - Net payments

### Financial Tracking

- **Earnings:**
  - Base hall rent
  - Additional service charges
  - Automatic tax calculation
  
- **Expenses:**
  - Categorized by type (Electricity, Salaries, Maintenance, etc.)
  - Can be linked to specific bookings
  - Date-range filtering

- **Reports:**
  - Customizable date ranges
  - Breakdown by hall, service type, expense category
  - Net profit calculation

### Role-Based Access

Access control is enforced at both the API and UI level:

- **Routes are protected** via middleware
- **API endpoints validate** user roles
- **UI elements are conditionally rendered** based on permissions
- **Unauthorized access** redirects to appropriate pages

## 🔒 Security Considerations

### For Production Deployment:

1. **Environment Variables:**
   - Use strong, unique `NEXTAUTH_SECRET`
   - Secure your `DATABASE_URL`
   - Never commit `.env` to version control

2. **Database:**
   - Use strong PostgreSQL passwords
   - Enable SSL for database connections
   - Regular backups

3. **Authentication:**
   - Implement password complexity requirements
   - Add rate limiting for login attempts
   - Consider adding 2FA for admin accounts

4. **User Management:**
   - Change default passwords immediately
   - Disable or delete unused accounts
   - Regular security audits

## 🐛 Troubleshooting

### Database Connection Issues

If you see connection errors:

1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure database `smritipat` exists
4. Test connection: `psql -U postgres -d smritipat`

### Prisma Client Errors

If you see "Prisma Client not found":

```bash
npx prisma generate
```

### Port Already in Use

If port 3000 is occupied:

```bash
npm run dev -- -p 3001
```

### TypeScript Errors

Run type checking:

```bash
npx tsc --noEmit
```

## 📝 Development Notes

### Adding New Features

1. **Database Changes:**
   - Update `prisma/schema.prisma`
   - Run: `npx prisma migrate dev --name your_change_name`

2. **API Endpoints:**
   - Create route handlers in `app/api/`
   - Add validation with Zod schemas
   - Implement proper error handling

3. **UI Pages:**
   - Create pages in `app/`
   - Wrap with `ProtectedLayout`
   - Use TanStack Query for data fetching

### Code Style

- TypeScript for type safety
- Use `async/await` for asynchronous operations
- Validate all inputs with Zod
- Handle errors gracefully
- Add loading and empty states

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)

## 🤝 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the project structure and code comments
3. Consult the technology documentation links

## 📄 License

This project is built for internal business use at Smritipat Reception Hall.

---

**Built with ❤️ using Next.js and TypeScript**