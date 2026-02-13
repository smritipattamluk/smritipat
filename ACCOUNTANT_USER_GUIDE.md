# 📊 Accountant User Guide - Smritipat Hall Management System

## Welcome, Accountant!

This guide will help you navigate and use all the features available to you as an Accountant in the Smritipat Hall Management System. As an Accountant, you have access to view all financial data, manage expenses, and generate comprehensive reports.

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Viewing Bookings](#viewing-bookings)
4. [Managing Expenses](#managing-expenses)
5. [Generating Reports](#generating-reports)
6. [Calendar View](#calendar-view)
7. [Financial Calculations](#financial-calculations)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Tips & Best Practices](#tips--best-practices)

---

## 🚀 Getting Started

### Logging In

1. Navigate to the login page
2. Enter your **email address** and **password**
3. Click **Sign In**
4. You will be redirected to the Dashboard

### Your Access Level

As an **ACCOUNTANT**, you have access to:
- ✅ **Dashboard** - View financial metrics and statistics
- ✅ **Calendar** - View event schedule
- ✅ **Bookings** - View all bookings with full financial details (read-only)
- ✅ **Expenses** - Full access to create, edit, and delete expenses
- ✅ **Reports** - Generate and export financial reports
- ❌ **Halls** - No access (Admin only)
- ❌ **Users** - No access (Admin only)
- ❌ **Logs** - No access to view logs (Admin only)
- ❌ **Settings** - No access (Admin only)

> **Important Notes:** 
> - You can view bookings but cannot create, edit, or delete them. Only Admins and Managers can manage bookings.
> - **All your actions are automatically logged** in the system's audit trail (expense creation, updates, deletions, report generation). While you cannot view the audit logs page, Admins can review all activities for accountability and compliance.

---

## 📊 Dashboard Overview

The Dashboard is your main hub for quick financial insights.

### Accessing the Dashboard

- Click **Dashboard** in the left sidebar
- Or press `g` then `d` (keyboard shortcut)

### Month Navigation

- Use **← Arrow** to view the previous month
- Use **→ Arrow** to view the next month
- Click **"Go to current month"** to return to the current period

### Key Financial Metrics

#### 1. Total Earnings (Green Card)
Shows total revenue from confirmed and completed bookings for the selected month.

**Calculation:**
- Base Rent + Additional Charges (AC, Decoration, Sound, etc.)
- Minus Discounts
- Plus Tax
- Minus Refunds

#### 2. Total Expenses (Red Card)
Shows all expenses recorded for the selected month across all categories.

#### 3. Net Profit (Blue Card)
Shows profit for the month: **Earnings - Expenses**

Also displays the **profit margin percentage**: `(Net Profit / Total Earnings) × 100`

#### 4. Bookings Count
Shows the number of confirmed and completed bookings, with a conversion rate showing how many inquiries turned into confirmed bookings.

### Quick Stats Section

- **Total Bookings This Month** - All bookings regardless of status
- **Pending Inquiries** - Bookings with INQUIRY status that need follow-up
- **Upcoming Events** - Events scheduled in the next 30 days

### Bookings by Status

Visual grid showing booking counts by status:
- **INQUIRY** - Initial inquiry, not confirmed
- **TENTATIVE** - Tentatively booked, awaiting confirmation
- **CONFIRMED** - Confirmed booking
- **COMPLETED** - Event has occurred
- **CANCELLED** - Booking was cancelled

### Upcoming Bookings Table

Shows the next scheduled events with:
- Customer name
- Event date and time
- Event type
- Hall name
- Status badge

Click any booking row to view full details.

---

## 📅 Viewing Bookings

As an Accountant, you can view all booking details including financial information, but you cannot create, edit, or delete bookings.

### Accessing Bookings

- Click **Bookings** in the left sidebar
- Or press `g` then `b` (keyboard shortcut)

### Bookings List View

#### Search & Filter Options

1. **Search Box** (top)
   - Search by customer name
   - Search by phone number
   - Search by event type
   - Real-time filtering as you type

2. **Status Filter**
   - Select from: INQUIRY, TENTATIVE, CONFIRMED, COMPLETED, CANCELLED
   - Or select "All Statuses" to see everything

3. **Hall Filter**
   - Filter bookings by specific hall
   - Useful for hall-specific revenue analysis

4. **Sort Options**
   - **Date** - Sort by event date (click again to reverse)
   - **Name** - Sort by customer name (alphabetical)
   - **Amount** - Sort by booking total amount

5. **Clear All Filters**
   - Click **"Clear"** button to reset all filters

#### Booking Card Information

Each booking card displays:
- **Customer Name** & contact details
- **Event Type** (e.g., Wedding, Birthday, Corporate)
- **Event Date** and **Time Range**
- **Hall Name** and **Floor**
- **Status Badge** (color-coded)
- **Total Amount** due (calculated)

### Viewing Booking Details

Click any booking card to view complete details:

#### Customer Information
- Full name
- Phone number
- Email address (if provided)

#### Event Details
- Event type
- Event date
- Start time and end time
- Hall name and floor

#### Financial Breakdown

**Base Charges:**
- Base Rent: Hall rental charge
- Status: Current booking status

**Additional Charges:**
All extra charges added to the booking:
- **AC** - Air conditioning charges
- **DECORATION** - Decoration services
- **SOUND** - Sound system charges
- **CATERING** - Catering services
- **CLEANING** - Extra cleaning charges
- **GENERATOR** - Generator/power backup
- **OTHER** - Any other miscellaneous charges

Each charge shows:
- Type
- Description
- Amount

**Financial Summary:**
- **Base Rent** - Hall rental fee
- **Additional Charges** - Sum of all extra charges
- **Subtotal** - Base Rent + Additional Charges
- **Discount** - Any discount applied
- **Subtotal After Discount** - Amount after discount
- **Tax** (e.g., 18% GST) - Tax on discounted amount
- **Grand Total** - Final amount due

**Payment Information:**
- **Total Paid** - Sum of all payments received
- **Total Refunds** - Sum of all refunds issued
- **Net Received** - Paid minus Refunds
- **Balance Due** - Outstanding amount (can be negative if overpaid)

#### Payment History

All payments recorded for the booking:
- **Amount** - Payment amount
- **Type** - ADVANCE, FINAL, or REFUND
- **Method** - CASH, CARD, UPI, CHEQUE, or BANK_TRANSFER
- **Date** - When payment was received
- **Reference** - Reference number (if applicable)

#### Notes

Any special notes or instructions recorded for the booking.

---

## 💰 Managing Expenses

This is one of your primary responsibilities as an Accountant. You have full control over expense management.

### Accessing Expenses

- Click **Expenses** in the left sidebar
- Or press `g` then `e` (keyboard shortcut)

### Viewing Expenses List

#### Search & Filter Options

1. **Search Box**
   - Search by expense description
   - Search by category name
   - Search by creator name
   - Real-time filtering

2. **Category Filter**
   - Filter by specific expense category
   - Or select "All Categories"

3. **Sort Options**
   - **Date** - Sort by expense date
   - **Amount** - Sort by expense amount
   - **Category** - Sort alphabetically by category

#### Expense Categories

The system supports the following expense categories:

- **ELECTRICITY** - Power bills
- **WATER** - Water bills
- **SALARY** - Staff salaries and wages
- **REPAIR_MAINTENANCE** - Repairs and maintenance costs
- **CLEANING** - Cleaning supplies and services
- **DECORATION_MATERIAL** - Decoration materials and supplies
- **CATERING_MATERIAL** - Catering supplies and equipment
- **GENERATOR_FUEL** - Fuel for generator
- **RENT** - Property rent
- **MISC** - Miscellaneous expenses

#### Expense Card Information

Each expense card shows:
- **Category** badge (color-coded)
- **Description** - What the expense was for
- **Amount** - Expense amount
- **Date** - When expense was incurred
- **Created By** - Who recorded the expense
- **Linked Booking** - If expense is related to a specific booking

#### Total Summary

At the top of the page, you'll see:
- **Total Expenses** - Sum of all filtered expenses
- Helps you quickly see category-specific totals

### Creating a New Expense

1. Click **"+ New Expense"** button (top right)

2. Fill in the expense form:

   **Category** (Required)
   - Select from the dropdown menu
   - Choose the most appropriate category

   **Description** (Required)
   - Enter a clear description
   - Include relevant details (e.g., "Monthly electricity bill - December", "Plumber charges for hall repair")

   **Amount** (Required)
   - Enter the expense amount
   - Must be a positive number
   - Enter in Indian Rupees (₹)

   **Expense Date** (Required)
   - Select the date when expense was incurred
   - Use date picker or type manually (YYYY-MM-DD)

   **Related Booking** (Optional)
   - If this expense is related to a specific booking, select it
   - Useful for tracking booking-specific costs
   - Leave blank for general operational expenses

3. Click **"Create Expense"** to save

4. The expense will appear in the list immediately

### Editing an Expense

1. Click the **Edit** button (pencil icon) on any expense card

2. Modify the fields as needed:
   - Category
   - Description
   - Amount
   - Expense Date
   - Related Booking

3. Click **"Update Expense"** to save changes

### Deleting an Expense

1. Click the **Delete** button (trash icon) on the expense card

2. Confirm the deletion when prompted

3. The expense will be permanently removed

> ⚠️ **Warning:** Deletion is permanent and cannot be undone. Double-check before deleting.

### Best Practices for Expense Management

✅ **Record expenses promptly** - Don't wait until month-end
✅ **Be descriptive** - Future you will thank you for clear descriptions
✅ **Link to bookings** - When expenses are booking-specific
✅ **Categorize correctly** - Helps with accurate reporting
✅ **Include dates** - Use the actual expense date, not entry date
✅ **Regular review** - Review expenses weekly to catch errors
✅ **Backup receipts** - Keep physical/digital receipts separately

### Audit Trail & Accountability

> 🔒 **All expense activities are logged** in the system's audit trail.

The system is designed to automatically record every action you perform on expenses with:
- **What you did** - Created, updated, or deleted an expense
- **When you did it** - Timestamp of the action
- **Who did it** - Your user account
- **Details** - Category, amount, description of the expense
- **Technical info** - IP address and device information

**Why this matters:**
- Ensures financial accountability
- Helps track changes and corrections
- Provides audit trail for compliance
- Allows Admins to review all financial activities
- Protects against unauthorized changes

**Best practices:**
- ✅ Always enter accurate information the first time
- ✅ If you make a mistake, correct it immediately and document why
- ✅ Add detailed descriptions so changes are understandable
- ✅ Be aware that all actions should be traceable
- ✅ Follow proper procedures for sensitive financial data

> **Note:** The audit logging system has been implemented in the codebase. If you notice that logs are not appearing for Admin users, this may indicate a technical issue that requires developer attention. The logging infrastructure is in place and should be capturing all expense operations (create, update, delete) along with user, timestamp, and contextual information.

---

## 📈 Generating Reports

The Reports feature is your most powerful tool for financial analysis and record-keeping.

### Accessing Reports

- Click **Reports** in the left sidebar
- Or press `g` then `r` (keyboard shortcut)

### Setting Report Period

1. **Start Date** - Select the beginning date for your report
2. **End Date** - Select the ending date for your report
3. Click **"Generate Report"** to create the report

**Quick Selections:**
- Current month: Use the calendar to select first and last day of current month
- Previous month: Select first and last day of previous month
- Quarter: Select 3-month period
- Financial year: April to March (or your fiscal year)
- Custom range: Any date range you need

### Understanding the Report

#### Summary Cards

Four key metrics at the top:

1. **Total Revenue**
   - Gross revenue from bookings
   - Before refunds

2. **Net Earnings**
   - Revenue minus refunds
   - Actual money received

3. **Total Expenses**
   - All expenses in the period
   - Across all categories

4. **Net Profit**
   - Net Earnings minus Total Expenses
   - Your bottom line

Each card shows:
- Current period value
- Percentage change from previous period
- Green (up) or Red (down) indicator

#### Total Bookings

Shows the number of confirmed and completed bookings in the period.

#### Detailed Breakdown Sections

Click the section headers to expand/collapse:

##### 1. Revenue Details

**Earnings Breakdown:**
- **Total Revenue** - Gross earnings from bookings
- **Advance Payments** - All advance payments received
- **Partial Payments** - Partial payments on bookings
- **Full Payments** - Full final payments
- **Refunds** - Total refunds issued
- **Net Earnings** - Revenue minus refunds

**Revenue by Hall:**
- Shows revenue breakdown for each hall
- Helps identify most profitable halls

**Revenue by Charge Type:**
- Base Rent
- AC charges
- Decoration charges
- Sound charges
- Catering charges
- Cleaning charges
- Generator charges
- Other charges

This breakdown helps you understand which services are most profitable.

##### 2. Expenses Breakdown

**Total Expenses by Category:**
- Each expense category with its total
- Percentage of total expenses
- Visual bar chart (if available)

**Categories include:**
- Electricity
- Water
- Salaries
- Repairs & Maintenance
- Cleaning
- Decoration Materials
- Catering Materials
- Generator Fuel
- Rent
- Miscellaneous

##### 3. Detailed Booking List

All bookings in the period with:
- Customer name
- Event date
- Event type
- Hall name
- Status
- Amount

Click any booking to view full details.

##### 4. Detailed Expense List

All expenses in the period with:
- Date
- Category
- Description
- Amount
- Created by

### Exporting Reports

You can export reports in two formats:

#### Export to PDF

1. Click **"Export to PDF"** button (with PDF icon)

2. PDF includes:
   - Report header with date range
   - Summary section with all key metrics
   - Expenses breakdown table
   - Revenue breakdown table
   - Detailed bookings list
   - Detailed expenses list

3. PDF opens in new tab - you can:
   - Print directly
   - Save to your computer
   - Email to stakeholders

**Use PDF for:**
- Monthly reports to management
- Financial presentations
- Archival purposes
- Audit documentation

#### Export to Excel

1. Click **"Export to Excel"** button (with spreadsheet icon)

2. Excel file includes multiple sheets:
   - **Summary** - Key metrics
   - **Revenue Details** - All revenue information
   - **Expenses** - Detailed expense list
   - **Bookings** - Detailed booking list

3. File downloads automatically to your Downloads folder

**Use Excel for:**
- Further analysis and calculations
- Creating custom charts
- Budget planning
- Comparing multiple periods
- Sharing data with external accountants

### Monthly Closing Checklist

Use this checklist at the end of each month:

- [ ] Verify all expenses are recorded
- [ ] Check all bookings have payment records
- [ ] Reconcile bank statements with payments
- [ ] Generate monthly report
- [ ] Export report to PDF and Excel
- [ ] Save reports in designated folder
- [ ] Review any outstanding balances
- [ ] Prepare summary for management
- [ ] Archive previous month's documents
- [ ] Plan for next month's budget

---

## 📅 Calendar View

The Calendar provides a visual overview of all bookings.

### Accessing Calendar

- Click **Calendar** in the left sidebar
- Or press `g` then `c` (keyboard shortcut)

### Calendar Features

#### Month Navigation
- Click **Previous/Next** arrows to change months
- Click **"Today"** to return to current month

#### Viewing Bookings
- Each booking appears on its event date
- Color-coded by status:
  - Blue - INQUIRY
  - Yellow - TENTATIVE
  - Green - CONFIRMED
  - Gray - COMPLETED
  - Red - CANCELLED

#### Booking Information on Calendar
- Customer name
- Event time
- Hall name
- Status badge

#### Clicking Bookings
- Click any calendar event to view full booking details
- Opens the same detailed view as from Bookings page

### Using Calendar for Financial Planning

- **Preview upcoming revenue** - See confirmed bookings
- **Identify busy periods** - Multiple bookings per day
- **Spot gaps** - Days with no bookings
- **Verify booking distribution** - Check hall utilization

---

## 🧮 Financial Calculations

Understanding how amounts are calculated helps you verify and explain financial data.

### Booking Total Calculation

```
Step 1: Base Amount
= Base Rent + Additional Charges (AC, Decoration, Sound, etc.)

Step 2: Apply Discount
= Base Amount - Discount Amount

Step 3: Calculate Tax
= (Base Amount - Discount) × Tax Rate
Example: If subtotal after discount is ₹50,000 and tax rate is 18%
Tax = ₹50,000 × 0.18 = ₹9,000

Step 4: Grand Total
= (Base Amount - Discount) + Tax

Step 5: Balance Due
= Grand Total - Net Received
where Net Received = Total Payments - Total Refunds
```

### Example Calculation

**Booking Details:**
- Base Rent: ₹30,000
- AC Charges: ₹5,000
- Decoration: ₹8,000
- Discount: ₹3,000
- Tax Rate: 18%

**Calculation:**
1. Base Amount = ₹30,000 + ₹5,000 + ₹8,000 = ₹43,000
2. After Discount = ₹43,000 - ₹3,000 = ₹40,000
3. Tax = ₹40,000 × 0.18 = ₹7,200
4. Grand Total = ₹40,000 + ₹7,200 = ₹47,200

**Payment Status:**
- Advance Payment: ₹15,000
- Final Payment: ₹32,200
- Total Paid: ₹47,200
- Balance Due: ₹0 ✅

### Payment Types Explained

- **ADVANCE** - Initial deposit to confirm booking
- **FINAL** - Remaining balance payment
- **REFUND** - Money returned to customer (reduces net received)

### When Balance is Negative

A negative balance means the customer has paid more than the grand total:
- Either by mistake
- Or advance was collected before discount was applied
- Negative balance should be refunded

---

## ⌨️ Keyboard Shortcuts

Speed up your workflow with these keyboard shortcuts.

### Viewing Shortcuts List

Press `?` (question mark) to see all available shortcuts

### Navigation Shortcuts

Press `g` followed by:
- `d` - Go to Dashboard
- `b` - Go to Bookings
- `c` - Go to Calendar
- `e` - Go to Expenses
- `r` - Go to Reports

### Action Shortcuts

When on specific pages:

**Expenses Page:**
- `n` - New Expense
- `/` - Focus search box
- `Esc` - Clear search/filters

**Bookings Page:**
- `/` - Focus search box
- `Esc` - Clear search/filters

**Reports Page:**
- `Enter` - Generate Report (when date fields are set)

**General:**
- `Esc` - Close dialog/modal
- `Tab` - Move to next field in forms
- `Shift + Tab` - Move to previous field

---

## 💡 Tips & Best Practices

### Daily Tasks

1. **Morning:**
   - Check Dashboard for yesterday's bookings
   - Review any new expenses to be recorded
   - Check for pending payments
   - Verify overnight bookings completed successfully

2. **During the Day:**
   - Record expenses as they occur (don't accumulate)
   - Verify payment receipts against bookings
   - Update related booking links for expenses
   - Monitor for duplicate entries
   - Check for unusual transactions

3. **Evening:**
   - Review day's financial activities
   - Ensure all transactions are recorded
   - Make note of any follow-ups needed
   - Check tomorrow's scheduled events
   - Backup important data

### Weekly Tasks

- ✅ Generate week's summary report
- ✅ Reconcile cash payments with physical cash
- ✅ Review outstanding balances on bookings
- ✅ Check for any booking amendments affecting revenue
- ✅ Verify expense categorization accuracy
- ✅ Backup exported reports to external drive
- ✅ Review cancelled bookings for refund processing
- ✅ Check for data entry errors or duplicates
- ✅ Compare week's performance with previous week
- ✅ Identify trends in expense categories

### Monthly Tasks

- ✅ Generate monthly financial report
- ✅ Export to PDF and Excel
- ✅ Analyze revenue by hall
- ✅ Review expense trends
- ✅ Compare with previous months
- ✅ Prepare summary for management
- ✅ Archive all monthly reports
- ✅ Plan next month's budget
- ✅ Reconcile bank statements
- ✅ Update cash flow projections
- ✅ Review aging receivables (outstanding balances)
- ✅ Identify cost-saving opportunities
- ✅ Analyze profit margins by event type
- ✅ Check for seasonal patterns

### Quarterly Tasks

- ✅ Generate quarterly trend analysis
- ✅ Review all expense categories for optimization
- ✅ Analyze hall utilization and profitability
- ✅ Compare actuals vs budget
- ✅ Identify top revenue generators
- ✅ Review pricing strategy effectiveness
- ✅ Prepare stakeholder presentations
- ✅ Update financial forecasts
- ✅ Conduct vendor cost analysis
- ✅ Review and update standard operating procedures

### Best Practices for Record Keeping

#### Daily Entry Discipline

✅ **Always include clear descriptions** - Future you will thank you
- Bad: "Repair"
- Good: "AC unit repair in Main Hall by XYZ Services - Invoice #1234"

✅ **Record promptly** - Don't rely on memory
- Enter expenses same day
- Don't batch at month-end
- Reduces errors and omissions

✅ **Double-check amounts** - Verify before saving
- Compare with receipt/invoice
- Check decimal places
- Verify currency (₹ vs $)

✅ **Link expenses to bookings** - When applicable
- Helps track true booking profitability
- Enables better pricing decisions
- Improves cost allocation

✅ **Maintain backup** - Export reports regularly
- Weekly exports to external storage
- Keep physical copies of critical reports
- Use cloud storage for redundancy

#### Description Best Practices

**For Expenses:**
```
Template: [Item/Service] - [Location/Purpose] - [Vendor] - [Reference]

Examples:
✅ "Electricity bill for December - BESCOM #12345"
✅ "Pandit fee for Singh wedding - Main Hall - Dec 15"
✅ "AC repair - First Floor Hall - Freeze Air Services - Inv#789"
✅ "Monthly salary - Cleaning staff - December 2024"
✅ "Decoration flowers - Sharma birthday - Local vendor"

❌ "Bill"
❌ "Repair"
❌ "Misc"
```

**For Booking Notes:**
```
Include:
- Special requirements
- Discount reasons
- Payment arrangements
- Unusual circumstances
- Contact preferences

Example:
"VIP customer - repeat client. Gave 10% discount for advance full payment. 
Requested extra cleaning. Contact via WhatsApp only."
```

### Best Practices for Financial Accuracy

#### Payment Verification Process

✅ **Verify payment totals** - Against booking totals
1. Open booking detail page
2. Check Grand Total
3. Verify Total Paid matches
4. Confirm Balance Due is zero (or expected amount)
5. Cross-check with payment receipt
6. Verify payment method matches physical receipt

✅ **Check refund reasons** - Document why refunds were issued
- Always add note explaining refund
- Include cancellation policy reference
- Attach supporting documentation if possible
- Verify refund amount calculation
- Confirm payment method for refund

✅ **Monitor outstanding balances** - Follow up on overdue payments
- Generate weekly report of bookings with balance due
- Prioritize follow-ups: >30 days first
- Maintain contact log
- Escalate to Manager after 45 days

✅ **Reconcile daily** - Don't wait until month-end
- Match physical cash with cash payments
- Verify UPI/Card payments in bank statement
- Check for discrepancies immediately
- Document any variances

✅ **Question discrepancies** - Address issues immediately
- Never assume errors will resolve themselves
- Investigate same-day if possible
- Document findings
- Escalate if needed

#### Data Quality Checks

**Weekly validation checklist:**

1. **Duplicate Detection:**
   - Search for similar customer names
   - Check for duplicate phone numbers
   - Look for same event dates and halls
   - Verify expense descriptions for duplicates

2. **Anomaly Detection:**
   - Flag expenses >₹50,000
   - Check bookings with >50% discount
   - Verify zero-value transactions
   - Review unusual payment patterns
   - Check for outlier amounts

3. **Completeness Checks:**
   - All bookings have at least one payment (except INQUIRY)
   - All COMPLETED bookings have final payment
   - All expenses have proper category
   - All refunds have notes explaining why
   - All bookings have customer contact info

4. **Consistency Checks:**
   - Event dates not in far past (data entry error)
   - Times make sense (end after start)
   - Amounts are reasonable for event type
   - Tax calculations are correct
   - Discounts don't exceed subtotal

**Monthly validation:**
- Compare total cash payments vs physical cash deposits
- Reconcile all bank transfers
- Verify all cheques cleared
- Check for unallocated payments
- Review all cancelled transactions

### Best Practices for Reporting

#### Consistent Period Selection

✅ **Use same date ranges for comparison**
- Always use calendar month (1st to last day)
- Or consistent fiscal periods (e.g., 16th to 15th)
- Don't compare 30-day period with 31-day period
- Account for seasonal variations

✅ **Regular exports** - Weekly or monthly
- Same day of week/month
- Same format (PDF + Excel)
- Same naming convention
- Same storage location

✅ **Organize files** - Use clear folder structure
```
Financial Reports/
  ├── 2024/
  │   ├── January/
  │   │   ├── Report_2024-01_Monthly.pdf
  │   │   ├── Report_2024-01_Monthly.xlsx
  │   │   └── Report_2024-01_Expenses_Detail.xlsx
  │   ├── February/
  │   └── Q1/
  │       ├── Report_2024-Q1_Quarterly.pdf
  │       └── Report_2024-Q1_Analysis.xlsx
  └── 2025/
```

✅ **Name files properly**
```
Format: Report_[Period]_[Type]_[Optional-Details].extension

Examples:
✅ "Report_2024-12_Monthly_Final.pdf"
✅ "Report_2024-Q4_Quarterly_Comparison.xlsx"
✅ "Report_2024_Annual_Executive-Summary.pdf"
✅ "Expenses_2024-12_By-Category.xlsx"

❌ "Report.pdf"
❌ "December.xlsx"
❌ "Final_V2_NEW.pdf"
```

✅ **Share with stakeholders** - Keep management informed
- Set regular reporting schedule
- Include executive summary (1 page)
- Highlight key changes from previous period
- Flag concerning trends
- Suggest action items

#### Report Interpretation Skills

**Understanding Trends:**
- Single month data = snapshot
- 3-month trend = pattern
- 12-month trend = seasonality
- Year-over-year = growth

**Key Metrics to Track:**
1. **Revenue per booking** = Total Revenue / Number of Bookings
2. **Average expense per booking** = Total Expenses / Number of Bookings
3. **Profit per booking** = Net Profit / Number of Bookings  
4. **Expense ratio** = Total Expenses / Total Revenue × 100
5. **Profit margin** = Net Profit / Total Revenue × 100
6. **Hall utilization** = Bookings per hall / Available days
7. **Conversion rate** = Confirmed bookings / Total inquiries × 100
8. **Average discount rate** = Total Discounts / Total Base Revenue × 100

**Healthy benchmarks (indicative):**
- Profit margin: >30%
- Expense ratio: <50%
- Conversion rate: >60%
- Average discount: <10%

### Advanced Financial Analysis Techniques

#### Variance Analysis

**Month-to-Month Variance:**
```
Calculate:
1. Current Month - Previous Month = Absolute Variance
2. (Absolute Variance / Previous Month) × 100 = % Variance

Example:
- December Revenue: ₹5,00,000
- November Revenue: ₹4,00,000
- Absolute Variance: ₹1,00,000
- % Variance: 25% increase

Investigate if variance >20% (up or down)
```

**Budget vs Actual:**
```
If you have a budget:
1. Budgeted Amount - Actual Amount = Variance
2. Categorize: Favorable (revenue higher/expenses lower) or Unfavorable

Example:
- Budgeted Expenses: ₹2,00,000
- Actual Expenses: ₹2,25,000
- Variance: ₹25,000 Unfavorable (12.5% over budget)
- Action: Investigate overspending categories
```

#### Profitability Analysis by Dimension

**By Hall:**
```
For each hall, calculate:
1. Total revenue generated
2. Direct expenses (maintenance, cleaning specific to that hall)
3. Allocated expenses (proportional share of common costs)
4. Net profit
5. Profit margin %
6. Revenue per booking
7. Utilization rate

Use this to identify:
- Most profitable hall
- Under-utilized halls
- Halls needing maintenance investment
- Pricing optimization opportunities
```

**By Event Type:**
```
For each event type (Wedding, Birthday, Corporate, etc.):
1. Average booking value
2. Average expense per event
3. Average profit per event
4. Profit margin %
5. Frequency
6. Seasonal patterns

Use this to:
- Focus marketing on high-margin events
- Create specialized packages
- Optimize pricing by event type
- Plan inventory accordingly
```

**By Customer Segment:**
```
Segment customers:
- First-time vs Repeat customers
- Corporate vs Individual
- By booking value (tiered)

Analyze:
- Retention rate
- Average lifetime value
- Payment behavior
- Discount sensitivity
- Referral rates
```

#### Break-Even Analysis

```
Fixed Costs = Rent + Salaries + Utilities base + Insurance
Variable Costs = Per-booking expenses (cleaning, extra staff, etc.)
Average Revenue per Booking = Total Revenue / Number of Bookings

Break-even bookings per month = Fixed Costs / (Average Revenue - Average Variable Cost)

Example:
- Fixed Costs: ₹1,50,000/month
- Average Revenue per Booking: ₹45,000
- Average Variable Cost per Booking: ₹15,000
- Contribution Margin: ₹30,000

Break-even = ₹1,50,000 / ₹30,000 = 5 bookings per month

Insight: Need minimum 5 bookings/month to cover costs
```

#### Cash Flow Forecasting

```
Simple 3-month forecast:

1. Confirmed bookings for next 3 months
2. Expected revenue from confirmed bookings
3. Add: Expected advance payments
4. Subtract: Expected refunds
5. Subtract: Fixed expenses (known)
6. Subtract: Estimated variable expenses
7. Result: Projected net cash flow

Use this for:
- Planning capital expenses
- Managing working capital
- Identifying cash crunches
- Negotiating payment terms with vendors
```

### Best Practices for Communication

#### With Management

✅ **Clarify booking changes** - About revenue impact
- "Changing this event date to next month will move ₹X revenue to next period"
- "Cancellation will require ₹X refund, impacting this month's net profit"
- "Additional discount of ₹X will reduce profit margin from Y% to Z%"

✅ **Report irregularities** - Unusual expenses or payments
- "Electricity bill 40% higher than usual - please verify"
- "Payment received but no matching booking found - needs investigation"
- "Three similar expenses entered - possible duplicate?"

✅ **Request documentation** - For large expenses
- "Need invoice copy for ₹50,000 repair expense"
- "Please provide vendor quotation for audit trail"
- "Receipt required for cash payment of ₹25,000"

✅ **Maintain audit trail** - Everything should be traceable
- Document verbal approvals in writing
- Keep email trail for decisions
- Attach supporting documents to expenses
- Note who approved unusual transactions

✅ **Be proactive** - Don't wait to be asked
- "Next month's revenue looking low - only 3 confirmed bookings so far"
- "Expense trending 20% above budget - may need to reduce discretionary spending"
- "Hall utilization down this quarter - suggest marketing push"

#### With Customers (via Manager)

When Manager asks for financial information to share with customers:

✅ **Provide accurate breakdown** in simple language
```
Customer-friendly format:

Hall Rental:                    ₹30,000
Air Conditioning:              ₹5,000
Decoration Setup:              ₹8,000
Sound System:                  ₹4,000
                              ________
Subtotal:                      ₹47,000
Discount (10%):               -₹4,700
                              ________
Subtotal after discount:       ₹42,300
GST (18%):                     ₹7,614
                              ________
Total Amount:                  ₹49,914
                              ========

Received (Advance):            ₹15,000
Balance Due:                   ₹34,914
```

✅ **Explain calculation clearly** when queries arise
- Show how discount is applied (before tax)
- Explain tax calculation
- Clarify refund policy
- Justify any additional charges

### Advanced Excel Analysis Techniques

Once you export reports to Excel, perform these analyses:

#### 1. Pivot Table Analysis

```
Create pivot tables for:
- Revenue by Hall by Month
- Expenses by Category by Month
- Bookings by Status by Hall
- Payment methods distribution
- Event type profitability
```

#### 2. Conditional Formatting

```
Use color coding for:
- Revenue above/below target (green/red)
- Expenses exceeding budget (red)
- Outstanding balances by age (yellow/orange/red)
- Profit margins (gradient scale)
```

#### 3. Charts and Visualization

```
Create charts:
- Monthly revenue trend line
- Expense breakdown pie chart
- Revenue vs Expense column chart
- Profit margin trend line
- Hall comparison bar chart
- Seasonal pattern heatmap
```

#### 4. Formula-based Insights

```
Add calculated columns:
- Days to payment = Payment Date - Booking Date
- Revenue per guest = Total Revenue / Number of Guests
- Discount percentage = (Discount / Subtotal) × 100
- Profit margin = (Net Profit / Revenue) × 100
- YoY growth = ((This Year - Last Year) / Last Year) × 100
```

#### 5. Scenario Analysis

```
Create "What-if" scenarios:
- If we increase prices by 10%, what's the revenue impact?
- If we reduce X expense by 20%, what's the profit impact?
- How many bookings needed to reach ₹X monthly profit?
- What discount level maintains 30% profit margin?
```

### Common Scenarios

#### Scenario 1: Customer Requests Refund

**Complete Process:**

1. **Verify booking details**
   - Open booking detail page
   - Note booking ID and customer information
   - Check event date and current status
   - Review payment history

2. **Calculate refund amount**
   - Check total paid amount
   - Review booking terms/cancellation policy
   - Calculate refund per policy:
     - >30 days before event: 90% refund
     - 15-30 days: 50% refund
     - <15 days: No refund (or as per policy)
   - Consider advance amount vs full payment

3. **Coordinate with Manager/Admin**
   - Provide refund calculation
   - Explain policy application
   - Get approval for refund amount
   - Manager/Admin will cancel booking

4. **Once cancelled, inform Manager to record refund**
   - Refund should be same payment method as original
   - Provide customer bank details if needed
   - Reference original payment ID

5. **Verify refund appears in payment history**
   - Check booking detail page
   - Confirm refund type = "REFUND"
   - Verify amount is correct
   - Check balance due is updated
   - Month-end: Verify refund in reports

**Documentation:**
```
Refund Approval Form (manual record):
- Booking ID: BK123456
- Customer Name: [Name]
- Original Amount: ₹50,000
- Paid Amount: ₹50,000
- Cancellation Date: [Date]
- Event Date: [Date]
- Days Before Event: 45
- Policy: 90% refund
- Refund Amount: ₹45,000
- Approved By: [Manager Name]
- Date: [Date]
```

#### Scenario 2: Expense Related to Specific Booking

**Best Practice Workflow:**

1. **Create new expense** with complete details
   ```
   Category: CATERING_MATERIAL
   Description: "Catering supplies for Singh-Sharma wedding - Main Hall - 
                ABC Caterers - Invoice #CAT-2024-1234"
   Amount: ₹12,500
   Date: 2024-12-15 (actual expense date)
   ```

2. **Link to booking**
   - In "Related Booking" field, search "Singh"
   - Select correct booking from dropdown
   - Double-check event date matches

3. **Verify linkage**
   - Save expense
   - Go to booking detail page
   - Scroll to bottom - should show linked expense
   - Verify expense appears correctly

4. **Reporting benefit**
   - Month-end report will show booking-specific costs
   - Calculate true booking profitability:
     ```
     Revenue from booking: ₹50,000
     Direct costs (linked expenses): ₹12,500
     Contribution: ₹37,500
     Profit margin: 75%
     ```

5. **Use for future pricing**
   - Track average direct costs by event type
   - Adjust pricing to maintain target margin
   - Identify high-cost events

**When to link expenses:**
- ✅ Catering for specific event
- ✅ Extra decoration for specific booking
- ✅ Special cleaning for event
- ✅ Event-specific equipment rental
- ❌ Regular electricity bill (not specific to one booking)
- ❌ Monthly staff salary (not booking-specific)
- ❌ General maintenance (benefits all bookings)

#### Scenario 3: Month-End Closing (Detailed)

**Complete Month-End Checklist:**

**Day 1-2 of New Month:**

1. **Expense Verification (30 minutes)**
   - [ ] Review all expenses entered last month
   - [ ] Check for missing receipts/invoices
   - [ ] Verify all expenses have correct category
   - [ ] Look for duplicate entries
   - [ ] Check for expenses in wrong month
   - [ ] Add any missing expenses from last month
   - [ ] Get approvals for pending large expenses

2. **Payment Verification (45 minutes)**
   - [ ] List all bookings with events last month
   - [ ] Check each booking has complete payment records
   - [ ] Verify all COMPLETED bookings are fully paid or have documented outstanding balance
   - [ ] Reconcile payment methods:
     - Cash: Count physical cash, match with cash payments
     - UPI: Check UPI transaction IDs in bank statement
     - Card: Verify card settlements
     - Bank Transfer: Match with bank statement
     - Cheque: Verify all cheques cleared
   - [ ] Identify any unreconciled payments
   - [ ] Document any discrepancies

3. **Outstanding Balance Review (30 minutes)**
   - [ ] Generate list of bookings with balance due
   - [ ] Age analysis:
     - 0-30 days: Note for follow-up
     - 31-60 days: Priority follow-up
     - 61-90 days: Escalate to Manager
     - >90 days: Flag for management review
   - [ ] Prepare follow-up list for Manager
   - [ ] Update status of previous month's follow-ups

4. **Report Generation (60 minutes)**
   - [ ] Generate monthly report (1st to last day of previous month)
   - [ ] Review all sections carefully:
     - Total Revenue: Does it match expectation?
     - Total Expenses: Any unusually high categories?
     - Net Profit: Compare with previous months
     - Bookings count: Verify matches dashboard
   - [ ] Cross-verify key figures:
     ```
     Manual check:
     1. Count CONFIRMED + COMPLETED bookings
     2. Add up grand totals from each booking
     3. Should match report revenue (within rounding)
     ```
   - [ ] Check expense totals by category
   - [ ] Verify hall-wise revenue distribution

5. **Export and Archive (20 minutes)**
   - [ ] Export to PDF - name: `Report_2024-12_Monthly_Final.pdf`
   - [ ] Export to Excel - name: `Report_2024-12_Monthly_Data.xlsx`
   - [ ] Save both to network drive / cloud: `/Financial Reports/2024/December/`
   - [ ] Create backup copy on external drive
   - [ ] Email PDF to Manager/Admin
   - [ ] Keep local copy for quick reference

6. **Management Summary Preparation (45 minutes)**
   - [ ] Create one-page executive summary
   ```
   MONTHLY FINANCIAL SUMMARY - DECEMBER 2024
   
   KEY METRICS:
   - Revenue: ₹5,25,000 (↑ 15% vs November)
   - Expenses: ₹2,10,000 (↑ 5% vs November)
   - Net Profit: ₹3,15,000 (↑ 20% vs November)
   - Profit Margin: 60% (↑ from 57%)
   
   OPERATIONAL METRICS:
   - Total Bookings: 12 (↑ 2 vs November)
   - Average Revenue/Booking: ₹43,750
   - Hall Utilization: 65%
   - Conversion Rate: 75% (9/12 confirmed)
   
   HIGHLIGHTS:
   ✅ Strong month with 20% profit growth
   ✅ Wedding season driving higher revenue
   ✅ Expense control improved (5% vs 15% revenue growth)
   
   CONCERNS:
   ⚠️  Electricity expenses up 40% (seasonal or issue?)
   ⚠️  3 bookings with outstanding balance >30 days (₹75,000 total)
   ⚠️  January looking slow - only 4 confirmed bookings so far
   
   RECOMMENDATIONS:
   1. Investigate electricity spike - possible meter issue
   2. Prioritize collection on overdue balances
   3. Marketing push for January-February bookings
   4. Consider offering seasonal discount for off-peak months
   
   NEXT MONTH FOCUS:
   - Target: ₹4,00,000 revenue (acknowledging seasonal dip)
   - Keep expenses under ₹1,80,000
   - Collect all outstanding balances
   - Increase booking pipeline for February-March
   ```

7. **Future Planning (30 minutes)**
   - [ ] Review next month's confirmed bookings
   - [ ] Project next month's revenue
   - [ ] Estimate next month's expenses
   - [ ] Identify any upcoming capital needs
   - [ ] Plan for seasonal variations
   - [ ] Update rolling 3-month forecast

8. **Documentation and Cleanup (20 minutes)**
   - [ ] File all physical receipts/invoices
   - [ ] Update expense tracking spreadsheet (if maintained separately)
   - [ ] Clear desktop/downloads of old reports
   - [ ] Update procedures document if any changes
   - [ ] Note any system issues to report

**Total Time Required: ~4-5 hours**  
**Best Practice:** Block calendar for morning of 1st and 2nd of month

#### Scenario 4: Discrepancy in Payment

**Investigation Procedure:**

1. **Identify the discrepancy**
   - Open booking details
   - Check Financial Summary section

2. **Compare key figures:**
   ```
   Expected (Grand Total):     ₹50,000
   Recorded (Net Received):    ₹48,000
   Difference:                 ₹2,000 SHORT
   
   OR
   
   Expected (Grand Total):     ₹50,000
   Recorded (Net Received):    ₹52,000
   Difference:                 ₹2,000 OVER
   ```

3. **Review payment history in detail:**
   - Count number of payment entries
   - Check each payment type (ADVANCE, FINAL, REFUND)
   - Verify each amount
   - Look for duplicate entries
   - Check for any refunds that shouldn't be there

4. **Common causes and solutions:**

   **A. Short payment scenarios:**
   
   **Cause 1: Payment not recorded**
   ```
   Symptom: Customer claims they paid, but no record
   Investigation:
   - Ask customer for payment receipt
   - Check payment date claimed
   - Verify in bank statement / cash register
   - Check if payment was for different booking
   
   Solution:
   - If verified, ask Manager to add payment with note:
     "Payment received on [date] - recorded late due to [reason]"
   ```
   
   **Cause 2: Partial payment missing**
   ```
   Symptom: Advance recorded, final payment missing
   Investigation:
   - Check if event occurred
   - Verify customer promised remaining payment
   - Check follow-up history
   
   Solution:
   - If payment due: Add to collection follow-up list
   - If payment made but not recorded: Add payment entry
   - If customer never paid: Escalate for collection
   ```
   
   **Cause 3: Discount not applied**
   ```
   Symptom: Grand Total higher than agreed
   Investigation:
   - Check booking notes for discount agreement
   - Verify with Manager about discount
   - Check email/WhatsApp communications
   
   Solution:
   - If discount was agreed: Ask Admin/Manager to update discount amount
   - If no discount: Explain to customer, request balance
   ```

   **B. Overpayment scenarios:**
   
   **Cause 1: Duplicate payment entry**
   ```
   Symptom: Same amount entered twice
   Investigation:
   - Check payment dates - are they same?
   - Check payment methods - are they same?
   - Check reference numbers - are they same?
   
   Solution:
   - Ask Manager/Admin to delete duplicate payment
   - Document which one to keep (with proper reference)
   ```
   
   **Cause 2: Advance before discount applied**
   ```
   Symptom: Customer paid advance on  higher amount, then discount given
   Investigation:
   - Check payment dates vs discount entry date
   - Verify original quote vs final amount
   
   Solution:
   - Calculate refund due OR
   - Adjust final payment amount expected
   - Add note explaining overpayment disposition
   ```
   
   **Cause 3: Payment meant for different booking**
   ```
   Symptom: Payment amount doesn't match any logical partial payment
   Investigation:
   - Check if customer has multiple bookings
   - Verify payment reference
   - Check customer's other outstanding balances
   
   Solution:
   - Move payment to correct booking
   - Ask Admin/Manager to correct payment association
   ```

5. **Document findings:**
   ```
   Discrepancy Investigation Report
   
   Booking ID: BK123456
   Customer: [Name]
   Event Date: [Date]
   
   DISCREPANCY FOUND:
   Expected: ₹50,000
   Recorded: ₹48,000
   Shortage: ₹2,000
   
   INVESTIGATION:
   - Reviewed all payment entries: 2 payments found
   - Checked bank statement: 3rd payment found for ₹2,000 on [date]
   - Verified with customer: Confirmed payment made
   
   ROOT CAUSE:
   Final payment of ₹2,000 not entered in system
   
   RESOLUTION:
   - Requested Manager to add payment entry
   - Payment Date: [date]
   - Payment Method: UPI  
   - Reference: [UTR number]
   - Status: RESOLVED on [date]
   
   PREVENTION:
   - Implement daily payment reconciliation
   - Double-check all payment entries same day
   ```

6. **Coordinate with Manager to verify**
   - Present findings clearly
   - Provide supporting documentation
   - Request specific action
   - Follow up to confirm resolution

7. **Update payment records if needed**
   - Manager/Admin will make corrections
   - Verify changes appear correctly
   - Check balance due updated
   - Export updated booking details for records

8. **Prevent future discrepancies:**
   - Implement daily reconciliation
   - Match physical receipts to system entries immediately
   - Double-entry check: Two people verify large payments
   - Use payment reference numbers consistently
   - Regular training on payment entry procedures

#### Scenario 5: Creating Budget Analysis & Forecast

**Objective:** Use historical data to plan next quarter's budget

**Step-by-Step Process:**

**Phase 1: Data Collection (1 hour)**

1. **Generate historical reports**
   - Last 6 months, month by month
   - Export each to Excel
   - Or generate one 6-month report and export

2. **Consolidate data in Excel**
   ```
   Create master spreadsheet with sheets:
   - Revenue_Summary
   - Expense_Summary
   - Booking_Stats
   - Trends_Analysis
   - Budget_Forecast
   ```

3. **Extract key metrics per month:**
   ```
   | Month   | Revenue | Expenses | Profit | Bookings | Rev/Booking |
   |---------|---------|----------|--------|----------|-------------|
   | Jul-24  | 400,000 | 180,000  | 220,000| 9        | 44,444      |
   | Aug-24  | 425,000 | 185,000  | 240,000| 10       | 42,500      |
   | Sep-24  | 380,000 | 175,000  | 205,000| 8        | 47,500      |
   | Oct-24  | 450,000 | 200,000  | 250,000| 11       | 40,909      |
   | Nov-24  | 480,000 | 205,000  | 275,000| 10       | 48,000      |
   | Dec-24  | 525,000 | 210,000  | 315,000| 12       | 43,750      |
   ```

**Phase 2: Trend Analysis (30 minutes)**

1. **Calculate averages and growth:**
   ```
   Average Monthly Revenue: ₹443,333
   Average Monthly Expenses: ₹192,500
   Average Monthly Profit: ₹250,833
   Average Bookings/Month: 10
   
   Revenue Growth Rate: +7% per month (trend)
   Expense Growth Rate: +3% per month (trend)
   ```

2. **Identify patterns:**
   - Seasonal trends: December strongest (wedding season)
   - Expense trends: Growing slower than revenue (good!)
   - Booking trends: Averaging 10 bookings/month
   - Revenue/booking: Fluctuates between ₹40,000-₹48,000

3. **Categorize expenses:**
   ```
   Fixed Monthly Costs:
   - Rent: ₹50,000
   - Salaries: ₹80,000
   - Base utilities: ₹20,000
   Total Fixed: ₹150,000
   
   Variable Costs: ₹42,500/month average
   - Varies based on bookings
   - Average: ₹4,250 per booking
   ```

**Phase 3: Budget Creation (45 minutes)**

1. **Set revenue targets by month:**
   ```
   Consider:
   - Historical trends
   - Seasonal patterns
   - Market conditions
   - Planned marketing efforts
   - Pricing changes
   
   Q1 2025 Forecast (Jan-Mar):
   
   January (off-season):
   - Expected bookings: 7 (↓ from Dec)
   - Revenue target: ₹320,000 (conservative)
   
   February (wedding season starts):
   - Expected bookings: 9
   - Revenue target: ₹410,000
   
   March (peak season):
   - Expected bookings: 11
   - Revenue target: ₹500,000
   
   Q1 Total Target: ₹1,230,000
   ```

2. **Budget expenses:**
   ```
   Fixed Costs (all 3 months):
   - Rent: ₹50,000 × 3 = ₹150,000
   - Salaries: ₹80,000 × 3 = ₹240,000
   - Base utilities: ₹20,000 × 3 = ₹60,000
   Total Fixed: ₹450,000
   
   Variable Costs:
   - Per booking estimate: ₹4,250
   - Total bookings forecast: 27
   - Total variable: ₹114,750
   
   Discretionary/One-time:
   - Repairs budget: ₹50,000
   - Marketing: ₹25,000
   Total Discretionary: ₹75,000
   
   Total Q1 Expense Budget: ₹639,750
   ```

3. **Calculate projected profit:**
   ```
   Q1 Revenue Target:     ₹1,230,000
   Q1 Expense Budget:     ₹  639,750
   Q1 Projected Profit:   ₹  590,250
   Q1 Profit Margin:      48%
   ```

**Phase 4: Document and Present (30 minutes)**

Create presentation with:

1. **Executive Summary**
   - Key targets and rationale
   - Major assumptions
   - Risk factors and mitigation

2. **Historical Performance**
   - Charts showing 6-month trends
   - Highlighting patterns used for forecast

3. **Detailed Budget**
```
QUARTERLY BUDGET FY2025 Q1 (January - March 2025)

REVENUE FORECAST:
                  Bookings    Revenue    Growth vs Q4-24
January               7      ₹320,000        -39%
February              9      ₹410,000        -15%  
March                11      ₹500,000         -5%
―――――――――――――――――――――――――――――――――――――――――――――――――
Q1 TOTAL             27    ₹1,230,000        -23%

Note: Q4 unusually strong due to wedding season; Q1 dip expected

EXPENSE BUDGET:

FIXED COSTS:                            Per Month    Q1 Total
  Rent                                   ₹50,000    ₹150,000
  Salaries (4 staff)                     ₹80,000    ₹240,000
  Utilities (base)                       ₹20,000     ₹60,000
                                                    ―――――――――
  Total Fixed                           ₹150,000    ₹450,000

VARIABLE COSTS:
  Per-booking costs (est.)                ₹4,250    ₹114,750
    - Extra cleaning
    - Event-specific utilities
    - Consumables
    - Equipment wear
    
ONE-TIME / DISCRETIONARY:
  Scheduled repairs                                  ₹50,000
  Marketing campaign                                 ₹25,000
                                                    ―――――――――
  Total One-time                                     ₹75,000

TOTAL EXPENSE BUDGET:                               ₹639,750

PROFIT FORECAST:
  Revenue                                         ₹1,230,000
  Expenses                                          ₹639,750
                                                  ―――――――――――
  NET PROFIT                                        ₹590,250
  
  Profit Margin: 48.0%
  
BREAK-EVEN ANALYSIS:
  Monthly fixed costs: ₹150,000
  Average contribution per booking: ₹41,000
  Break-even bookings/month: 4
  
  Safety margin: Currently forecasting 9/month average
  
KEY ASSUMPTIONS:
  1. Average revenue per booking: ₹45,500 (based on 6-mo avg)
  2. No major pricing changes
  3. Operating at similar capacity
  4. No major unexpected repairs beyond ₹50k budget
  5. Staff count remains same
  
RISK FACTORS:
  ⚠️  Off-season revenue decline - mitigated by conservative forecast
  ⚠️  Client payment delays - implement stricter advance payment  
  ⚠️  Utility rate increases - monitor monthly, adjust if needed
  ⚠️  Competition - maintain service quality, consider loyalty program
  
OPPORTUNITIES:
  ✅ Introduce off-season pricing packages
  ✅ Corporate event marketing push (higher margin)
  ✅ Implement referral program
  ✅ Add premium services (higher revenue/booking)
```

4. **Variance Tracking Plan**
   - Monthly budget vs actual comparison
   - Triggers for corrective action
   - Review schedule

**Phase 5: Monthly Monitoring (ongoing)**

Create tracking dashboard:
```
Month: January 2025

                  Budget    Actual    Variance    Status
Revenue          ₹320,000  ₹295,000  -₹25,000    ⚠️  Slight miss
Expenses         ₹213,250  ₹205,000  +₹8,250     ✅ Under budget
Net Profit       ₹106,750  ₹90,000   -₹16,750    ⚠️  Below target
Bookings              7         6         -1     ⚠️  One less

ANALYSIS:
- Revenue miss due to one cancelled booking (refund ₹25K)
- Good expense control - 4% under budget  
- Profit margin: 30.5% (target was 33.4%)

ACTION ITEMS:
- Increase follow-up on February leads
- Confirm at least 9 February bookings by mid-Jan
- One additional booking in Jan would bring back on track
```

---

## 🔍 Troubleshooting & Common Issues

### Booking & Display Issues

#### "Cannot create/edit booking" message

**Reason:** As an Accountant, you have read-only access to bookings.

**Solution:** Contact an Admin or Manager to make booking changes. You can view all details and provide them with the necessary information.

#### Event times showing incorrectly or as "--:--"

**Possible Causes:**
- Browser timezone differences
- Data not properly loaded
- Network connectivity issues

**Solutions:**
1. **Refresh the page** - Press F5 or Ctrl+R
2. **Clear browser cache** - Ctrl+Shift+Delete
3. **Check your timezone settings** - Ensure system time is correct
4. **Try a different browser** - Chrome, Firefox, or Edge
5. **Contact Admin** - If times consistently show wrong, there may be a data issue

**To verify times are saved correctly:**
- Open booking detail page
- Check if date shows correctly but time doesn't
- Note the booking ID and report to Admin

#### Booking shows wrong date or time zone offset

**Solution:**
- Bookings are stored in the server's timezone
- Times should display in your local timezone automatically
- If you see times like "1970-01-01" in the time field, this is a data serialization issue
- Report to technical support with booking ID

### Expense Issues

#### Expense won't save

**Check:**
- ✅ All required fields filled (Category, Description, Amount, Date)
- ✅ Amount is a positive number (no negative values)
- ✅ Date is in valid format (YYYY-MM-DD)
- ✅ Description has at least 3 characters
- ✅ Category is selected from dropdown
- ✅ You're not trying to save duplicate expense
- ✅ Internet connection is stable

**If still failing:**
1. Try reducing description length (max 500 characters)
2. Check if amount has too many decimal places (max 2)
3. Try selecting a different category
4. Log out and log back in
5. Try from a different device

#### Cannot delete expense

**Possible reasons:**
- Network timeout
- Expense linked to a completed booking (protection)
- Insufficient permissions (check with Admin)
- Database constraint violation

**Solution:**
- Try again after a few seconds
- Check your internet connection
- If problem persists, note the expense ID and contact Admin

#### Expense related to wrong booking

**How to fix:**
1. Click Edit on the expense
2. Change the "Related Booking" field
3. Search for correct booking
4. Save changes
5. Verify on booking detail page

### Report Issues

#### Report shows ₹0.00 or no data

**Reasons:**
- No bookings in selected date range
- Only INQUIRY or TENTATIVE bookings (not confirmed/completed)
- Selected date range has no confirmed events
- Date range is too narrow
- All bookings were cancelled

**Solution:**
1. **Expand date range** - Try full month or quarter
2. **Verify booking status** - Check if bookings are CONFIRMED or COMPLETED
3. **Check filters** - Ensure no conflicting filters applied
4. **Verify bookings exist** - Go to Bookings page and search

#### Export buttons not working

**Try:**
1. ✅ Ensure report is generated first (click "Generate Report")
2. ✅ Check browser pop-up blocker - Should show "Blocked" in address bar
3. ✅ Allow downloads in browser settings
4. ✅ Check Downloads folder - File may be there already
5. ✅ Try right-click → "Save Link As"
6. ✅ Try different browser (Chrome recommended)
7. ✅ Disable browser extensions temporarily
8. ✅ Check disk space - Ensure enough storage

**For PDF export issues:**
- Allow popups from this site
- Check if PDF viewer is installed
- Try "Save as PDF" from browser print dialog

**For Excel export issues:**
- Ensure Excel or compatible software is installed
- Check file isn't blocked by antivirus
- Try opening from Downloads folder directly

#### Report calculations seem wrong

**Verification steps:**
1. **Check individual bookings** - Open each booking and verify amounts
2. **Verify payment status** - Ensure all payments are recorded
3. **Check refunds** - Refunds reduce net revenue
4. **Verify date range** - Ensure bookings fall within selected period
5. **Check booking status** - Only CONFIRMED and COMPLETED count toward revenue
6. **Manual calculation** - Use calculator to spot-check totals
7. **Compare with previous period** - Check for consistency

**Common calculation mistakes:** 
- Forgetting that Tax is calculated AFTER discount
- Not accounting for refunds in net revenue
- Including INQUIRY/TENTATIVE bookings (which shouldn't count)
- Confusing Gross Revenue with Net Revenue

### Access & Permission Issues

#### Can't see certain navigation items

**Normal:** Based on your ACCOUNTANT role:
- ❌ Halls - Admin only
- ❌ Users - Admin only  
- ❌ Logs - Admin only (you cannot view logs, but your actions ARE being logged)
- ❌ Settings - Admin only

These restrictions are by design for security and role separation.

> **Note:** While you cannot view the audit logs page, all your activities (expense creation, updates, deletions, report exports) are automatically logged for accountability. Admins can review these logs to track all financial activities.

#### "Unauthorized" error when accessing a page

**Solutions:**
1. **Check your session** - You may have been logged out
2. **Log out and log back in** - Session may be expired
3. **Clear cookies** - Browser may have stale authentication
4. **Verify your role** - Contact Admin to confirm you're still ACCOUNTANT
5. **Check if account is active** - Admin may have deactivated your account

### Performance Issues

#### Pages loading slowly

**Quick fixes:**
1. **Refresh the page** - F5 or Ctrl+R
2. **Clear browser cache** - May have old data
3. **Check internet speed** - Run speed test
4. **Close unnecessary tabs** - Free up memory
5. **Try incognito/private mode** - Rules out extension issues

#### Search is slow or not responding

**Solutions:**
- Wait for initial data to load completely
- Reduce search query length
- Clear filters before searching
- Try filtering by category first, then search

#### Report generation takes too long

**Expected behavior:**
- Small date ranges (1 month): 2-5 seconds
- Large date ranges (1 year): 10-30 seconds
- If taking longer than 1 minute, refresh and try again

**Optimization tips:**
- Generate smaller date ranges
- Avoid peak hours if possible
- Close other applications using internet

### Data Validation Issues

#### Cannot enter certain amounts

**Validation rules:**
- Amounts must be positive (> 0)
- Maximum: ₹99,999,999.99 (10 crore minus 1 paisa)
- Maximum 2 decimal places
- No commas allowed (enter 50000 not 50,000)

#### Date picker not working

**Solutions:**
1. Type date manually in YYYY-MM-DD format
2. Use keyboard arrows to navigate dates
3. Click year/month header to jump to year/month selector
4. Clear browser cache
5. Try different browser

#### Form validation errors not clear

**Common validation messages:**
- "Required" - Field must be filled
- "Invalid format" - Check date/time/number format  
- "Must be greater than X" - Value too small
- "Must be less than X" - Value too large
- "Invalid email" - Check email format

### Technical Issues

#### White screen or blank page

**Emergency solutions:**
1. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache and cookies**
3. **Try incognito/private mode**
4. **Disable browser extensions**
5. **Try different browser**
6. **Check browser console** - F12, look for red errors
7. **Contact technical support** - Provide screenshot of console errors

#### Changes not saving

**Checklist:**
1. ✅ Click Save/Submit button (don't just navigate away)
2. ✅ Wait for confirmation message
3. ✅ Check for error messages (usually red text)
4. ✅ Verify internet connection
5. ✅ Try saving again after a few seconds
6. ✅ If still failing, copy your data and try from different browser

#### Data looks outdated

**Solutions:**
1. **Refresh the page** - F5
2. **Check last updated timestamp** - Usually shown on cards
3. **Log out and log back in** - Refreshes all data
4. **Verify with another user** - Confirm data is accurate
5. **Check if you're viewing old date range** - Dashboard/Reports may be showing past month

### Browser Compatibility

**Recommended browsers:**
- ✅ Google Chrome (latest version) - BEST
- ✅ Microsoft Edge (latest version)
- ✅ Mozilla Firefox (latest version)
- ⚠️ Safari (may have issues) - Not fully tested
- ❌ Internet Explorer - NOT SUPPORTED

**Mobile browsers:**
- ✅ Chrome Mobile - Good
- ✅ Safari Mobile - Acceptable
- ⚠️ Other mobile browsers - Not tested

### Getting Additional Help

**When contacting support, include:**
1. ✅ Your username (email)
2. ✅ What you were trying to do
3. ✅ What happened instead
4. ✅ Screenshot of error (if any)
5. ✅ Date and time of issue
6. ✅ Browser and version (e.g., Chrome 120)
7. ✅ Device type (Windows PC, Mac, Mobile)
8. ✅ Steps to reproduce the issue

**Priority levels:**
- 🔴 **Critical** - Cannot work at all, system down
- 🟡 **High** - Major feature broken, blocking important work
- 🟢 **Medium** - Feature not working as expected, workaround available  
- 🔵 **Low** - Minor issue, cosmetic problem, feature request

---

## � Advanced Financial Management

### Key Performance Indicators (KPIs)

As an accountant, you should track these KPIs regularly:

#### Revenue KPIs

1. **Monthly Recurring Revenue (MRR)**
   ```
   Formula: Average revenue per month over last 3 months
   Target: Stable or growing
   Track: Monthly
   ```

2. **Revenue Growth Rate**
   ```
   Formula: ((Current Month - Previous Month) / Previous Month) × 100
   Target: >5% month-over-month
   Alert: If negative for 2 consecutive months
   ```

3. **Revenue per Available Day**
   ```
   Formula: Monthly Revenue / Number of Days in Month
   Benchmark: ₹15,000+ per day
   Use: Understand daily revenue needed to hit targets
   ```

4. **Revenue per Booking**
   ```
   Formula: Total Revenue / Number of Bookings
   Benchmark: ₹40,000-₹50,000 depending on hall/season
   Track: Monitor pricing effectiveness
   ```

5. **Average Booking Value by Event Type**
   ```
   Wedding: Target ₹50,000+
   Birthday: Target ₹30,000-₹40,000
   Corporate: Target ₹45,000+
   Track: Identify most valuable event types
   ```

#### Profitability KPIs

1. **Gross Profit Margin**
   ```
   Formula: ((Revenue - Variable Costs) / Revenue) × 100
   Target: >60%
   Alert: If drops below 50%
   ```

2. **Net Profit Margin**
   ```
   Formula: (Net Profit / Revenue) × 100
   Target: >30%
   Good: 30-40%
   Excellent: >40%
   Alert: <20%
   ```

3. **Profit per Booking**
   ```
   Formula: Net Profit / Number of Bookings
   Track: Identify which events are most profitable
   Use: Optimize marketing and pricing
   ```

4. **Break-even Point**
   ```
   Formula: Fixed Costs / (Avg Revenue per Booking - Variable Cost per Booking)
   Example: ₹150,000 / (₹45,000 - ₹5,000) = 3.75 bookings/month
   Monitor: Ensure consistently above break-even
   ```

#### Operational KPIs

1. **Hall Utilization Rate**
   ```
   Formula: (Booked Days / Available Days) × 100
   Target: >60% overall
   Peak season: >80%
   Off-season: >40%
   Track: By hall, by month
   ```

2. **Booking Conversion Rate**
   ```
   Formula: (Confirmed Bookings / Total Inquiries) × 100
   Target: >60%
   Good: 60-75%
   Excellent: >75%
   Alert: <50%
   ```

3. **Average Lead Time**
   ```
   Formula: Average days between booking date and event date
   Good to know: Longer lead times = better planning
   Track: By event type, by season
   ```

4. **Cancellation Rate**
   ```
   Formula: (Cancelled Bookings / Total Bookings) × 100
   Target: <10%
   Alert: If >15%
   Investigate: Reasons for cancellations
   ```

#### Cash Flow KPIs

1. **Days Sales Outstanding (DSO)**
   ```
   Formula: (Outstanding Balance / Average Daily Revenue)
   Target: <30 days
   Alert: If >45 days
   Action: Improve collection process
   ```

2. **Collection Effectiveness Index**
   ```
   Formula: (Amount Collected / Amount Due) × 100
   Target: >95%
   Track: Monthly
   Improve: Follow up on overdue balances
   ```

3. **Advance Payment Ratio**
   ```
   Formula: (Total Advance Payments / Total Revenue) × 100
   Target: >40%
   Benefit: Better cash flow, less default risk
   ```

4. **Operating Cash Flow**
   ```
   Formula: Net Profit + Non-cash expenses (depreciation) - Working Capital Changes
   Monitor: Positive every month
   Alert: If negative alert management
   ```

#### Cost Control KPIs

1. **Operating Expense Ratio**
   ```
   Formula: (Operating Expenses / Revenue) × 100
   Target: <50%
   Good: 40-50%
   Excellent: <40%
   ```

2. **Expense per Booking**
   ```
   Formula: Total Expenses / Number of Bookings
   Track: Identify cost creep
   Control: Keep variable costs consistent
   ```

3. **Salary as % of Revenue**
   ```
   Formula: (Total Salaries / Revenue) × 100
   Benchmark: 15-20%
   Alert: If >25%
   ```

4. **Utility Expense Variance**
   ```
   Track: Month-to-month utility cost changes
   Alert: If >20% increase without cause
   Investigate: Possible wastage or rate increases
   ```

#### Customer KPIs

1. **Repeat Customer Rate**
   ```
   Formula: (Repeat Customers / Total Customers) × 100
   Target: >20%
   Track: Customer satisfaction indicator
   ```

2. **Customer Lifetime Value (CLV)**
   ```
   Formula: Average Booking Value × Average # of Bookings per Customer
   Use: Identify valuable customers
   Strategy: Focus on retention of high CLV customers
   ```

3. **Average Discount Given**
   ```
   Formula: (Total Discounts / Total Base Revenue) × 100
   Target: <10%
   Alert: If >15%, reviewing pricing strategy needed
   ```

### Reconciliation Procedures

#### Daily Cash Reconciliation

**Objective:** Ensure all cash transactions are accurately recorded

**Procedure:**

1. **Morning Opening Balance**
   ```
   Count physical cash in drawer
   Record: Opening Balance = ₹[Amount]
   ```

2. **During Day**
   ```
   Record each cash receipt:
   - Payment ID
   - Booking ID
   - Customer Name
   - Amount
   - Time
   - Received by (your initials)
   ```

3. **End of Day**
   ```
   Count physical cash: ₹[Closing Cash]
   
   Reconciliation:
   Opening Balance:           ₹10,000
   + Cash Received (per system): ₹25,000
   - Cash Paid Out:           ₹2,000
   = Expected Closing:        ₹33,000
   
   Actual Closing Count:      ₹33,000
   
   Variance:                  ₹0 ✅
   ```

4. **If Variance Exists**
   ```
   Short (Variance negative):
   - Recount cash carefully
   - Check if any payments not entered in system
   - Review payment vouchers
   - Check for calculation errors
   - Document variance reason
   
   Over (Variance positive):
   - Recount cash carefully
   - Check for duplicate entries in system
   - Verify each payment amount
   - Check if payment belongs to different booking
   - Document variance reason
   
   Tolerance: Up to ₹100 variance acceptable
   >₹100: Must investigate thoroughly before closing
   ```

5. **Documentation**
   ```
   Daily Cash Reconciliation Sheet
   Date: [DD/MM/YYYY]
   
   Opening Balance:           ₹[Amount]
   Receipts:                  ₹[Amount]
   Payments:                  ₹[Amount]
   Expected Closing:          ₹[Amount]
   Actual Closing:            ₹[Amount]
   Variance:                  ₹[Amount]
   
   Variance Reason (if any): ____________________
   
   Reconciled By: [Your Name]
   Verified By: [Manager Name]
   Date: [DD/MM/YYYY]
   ```

#### Weekly Bank Reconciliation

**Objective:** Match system records with bank statements

**Procedure:**

1. **Download bank statement** for the week

2. **Match each transaction:**
   ```
   System Entry               Bank Statement            Status
   ₹20,000 UPI - BK001       ₹20,000 UPI RECV          ✅ Matched
   ₹15,000 Card - BK002      ₹14,850 Card Settlement   ⚠️  Check fee
   ₹30,000 NEFT - BK003      [Not yet appeared]        ⏱️ Pending
   [No entry]                ₹5,000 NEFT RECV          ❌ Not recorded
   ```

3. **Identify discrepancies:**
   - **Timing differences** - Transaction recorded but not yet in bank (normal for 1-2 days)
   - **Missing entries** - In bank but not in system (investigate immediately)
   - **Amount mismatches** - Different amounts (check fees, errors)
   - **Duplicate entries** - Same transaction recorded twice

4. **Resolution actions:**
   ```
   For timing differences:
   - Note as "Pending clearance"
   - Follow up if >3 days
   
   For missing entries:
   - Identify transaction from bank details
   - Create payment entry in system with note: 
     "Recorded late - discovered in reconciliation"
   - Add reference number from bank
   
   For amount mismatches:
   - Check if transaction fees apply
   - For card: Merchant fees typical
   - For bank transfer: Usually no fee  
   - If error: Correct system entry
   
   For duplicates:
   - Identify correct transaction
   - Delete duplicate entry
   - Document reason for duplicate
   ```

5. **Documentation:**
   ```
   Weekly Bank Reconciliation - Week ending [DD/MM/YYYY]
   
   Expected balance (per system):    ₹[Amount]
   Actual balance (per bank):        ₹[Amount]
   
   Reconciling items:
   1. Pending clearances:            ₹[Amount]
   2. Bank charges not recorded:     ₹[Amount]
   3. Other adjustments:             ₹[Amount]
   
   Reconciled balance:               ₹[Amount]
   
   Status: ✅ Fully Reconciled / ⚠️ Items Pending
   
   Pending items requiring follow-up:
   - [List any outstanding items]
   
   Prepared by: [Your Name]
   Date: [DD/MM/YYYY]
   ```

#### Monthly Ledger Reconciliation

**Objective:** Ensure all financial records are complete and accurate

**Full Month-End Reconciliation:**

1. **Revenue Reconciliation**
   ```
   Step 1: List all revenue sources
   - Confirmed bookings completed
   - Partial payments received
   - Advance payments for future bookings
   
   Step 2: Verify against report
   - Report total revenue: ₹[Amount]
   - Manual calculation: ₹[Amount]
   - Difference: ₹[Amount]
   
   Step 3: Investigate any differences
   - Check if all bookings included
   - Verify refunds deducted properly
   - Confirm date ranges match
   - Check for data export issues
   
   Step 4: Document
   - Final reconciled revenue figure
   - Any adjustments made
   - Approval from manager
   ```

2. **Expense Reconciliation**
   ```
   Step 1: Collect all expense documents
   - Invoices
   - Bills
   - Receipts
   - Petty cash vouchers
   
   Step 2: Match with system entries
   - Every document should have system entry
   - Every system entry should have document
   
   Step 3: Verify totals by category
   Category           System  Documents  Status
   Electricity        ₹15,000  ₹15,000   ✅
   Salaries          ₹80,000  ₹80,000   ✅
   Repairs           ₹12,000  ₹13,000   ⚠️ Check
   
   Step 4: Resolve discrepancies
   - Missing documents: Request from vendors  
   - Missing entries: Add to system
   - Amount differences: Verify correct amount
   
   Step 5: File organized documents
   - By category, then by date
   - Attach to reconciliation report
   ```

3. **Balance Sheet Reconciliation**
   ```
   Assets:
   - Cash in hand (physical count)
   - Bank balances (per statements)
   - Accounts receivable (outstanding balances)
   
   Liabilities:
   - Advance payments (customer deposits for future events)
   - Accounts payable (outstanding vendor bills)
   - Refunds pending
   
   Verify all balances match supporting documents
   ```

### Financial Audit Preparation

**When external audit is scheduled:**

1. **Pre-Audit Preparation (2-3 weeks before)**
   ```
   Week 1-2:
   - Complete all outstanding reconciliations
   - Organize all financial documents by month
   - Prepare summary schedules:
     * Revenue by month
     * Expenses by category by month
     * Outstanding receivables aging
     * Fixed asset register (if any)
   - Identify any unusual transactions
   - Prepare explanations for significant variances
   
   Week 3:
   - Create audit file with:
     * Bank statements (all months)
     * Reconciliations (all months)
     * Sample invoices and receipts
     * Contracts (hall rental, vendor agreements)
     * Reports generated from system
   - Review with Manager
   - Fix any identified issues
   ```

2. **Documents to Prepare**
   ```
   Must Have:
   ✅ Monthly financial reports (all months)
   ✅ Bank statements (all accounts, all months)
   ✅ Bank reconciliations (all months)
   ✅ Sample invoices/receipts (representative sample)
   ✅ Vendor contracts and agreements
   ✅ Booking confirmations and agreements
   ✅ Payment receipts
   ✅ Expense vouchers
   ✅ Payroll records
   ✅ Tax filings and payments
   ✅ Fixed asset register
   ✅ Insurance policies
   
   Good to Have:
   ✅ Trend analysis charts
   ✅ Variance explanations
   ✅ Internal audit notes
   ✅ Management review notes
   ✅ System user logs (audit logs)
   ```

3. **During Audit**
   ```
   Your Role:
   - Provide requested documents promptly
   - Answer questions accurately
   - Don't guess - say "I'll verify and get back"
   - Take notes on questions asked
   - Escalate policy questions to management
   - Document all audit findings
   
   Common Audit Requests:
   - "Select X random transactions" - provide full trail
   - Revenue recognition policies - explain booking vs completion
   - Expense approval process - describe authorization flow
   - Cash handling procedures - describe daily process
   - Bank reconciliation process - walk through your procedure
   - Outstanding balance follow-up - show collection efforts
   ```

4. **Post-Audit**
   ```
   - Review audit findings
   - Prepare response to any observations
   - Implement recommended improvements
   - Document changes to procedures
   - Train staff on new procedures
   - Plan for next audit cycle
   ```

### Internal Control Best Practices

**Segregation of Duties:**
- ✅ You record expenses - Manager approves large expenses
- ✅ You reconcile - Manager reviews reconciliation
- ✅ Manager receives payments - You record payments
- ✅ You prepare reports - Manager reviews before distribution

**Authorization Limits:**
```
Expense Amount         Required Authorization
< ₹5,000              Accountant can record directly
₹5,000 - ₹25,000      Manager approval required
₹25,000 - ₹1,00,000   Admin approval required
> ₹1,00,000           Owner approval required
```

**Documentation Requirements:**
- All expenses >₹1,000 must have supporting document
- All cash payments must have receipt
- All bank transfers must have reference number
- All discounts >10% must have approval note
- All refunds must have reason documented

**Review Procedures:**
- Daily: Cash reconciliation
- Weekly: Bank reconciliation + Outstanding balances review
- Monthly: Complete financial review + Variance analysis
- Quarterly: Trend analysis + Budget review
- Annually: External audit + Comprehensive review

---

## 🔐 Security & Compliance

### Automatic Activity Logging

The Smritipat system automatically logs all your financial activities to maintain a complete audit trail. This is a standard accounting practice for:

✅ **Financial accountability** - Track who made what changes
✅ **Compliance** - Meet regulatory requirements  
✅ **Error tracking** - Identify and correct mistakes
✅ **Security** - Detect unauthorized activities
✅ **Transparency** - Build trust with management

### What Gets Logged

The system logs:
- Create an expense → Logged with full details (category, amount, description, date)
- Update an expense → Logged with what changed (old value → new value)
- Delete an expense → Logged with what was deleted
- Export a report → Logged with date range and format
- User login/logout → tracked for security
- Booking viewing (potentially) → for sensitive data access
- Payment record viewing → for financial data access

### Information Recorded

For each action, the system records:
- ✅ Your user ID and name
- ✅ Action type (CREATE, UPDATE, DELETE, EXPORT, VIEW)
- ✅ Date and time (precise timestamp with timezone)
- ✅ What entity was affected (expense ID, booking ID, etc.)
- ✅ What changed (before and after values for updates)
- ✅ IP address (your computer's network address)
- ✅ Device information (browser, operating system)
- ✅ Any related entities (linked booking, customer name, etc.)

### Viewing Audit Logs

As an Accountant, you **cannot view** the audit logs page. Only Admins have access to review the complete audit trail. This separation of duties is a security best practice.

**Why you can't view logs:**
- Prevents tampering with audit trail
- Separation of duties (standard accounting control)
- Ensures independent oversight
- Protects against fraud

**If you need to review your past actions:**
- Keep your own records of important changes
- Use expense list filters to find what you've entered
- Export monthly reports for your reference
- Contact Admin if you need to verify past activities
- Document major transactions in your personal work log

> **Technical Note:** The audit logging infrastructure has been implemented in the application code. All expense operations, booking operations, user management, and hall management include logging calls. If Admin users report that the audit log page is empty or incomplete, this indicates a potential technical issue requiring developer investigation  . The logging code is present and should be capturing all activities.

### Compliance Tips

✅ **Accuracy first** - Enter correct information from the start
✅ **Document changes** - Keep notes on why you made corrections
✅ **Timely recording** - Record expenses when they occur
✅ **Regular reconciliation** - Match records with receipts weekly
✅ **Report issues** - Inform Admin of any discrepancies immediately
✅ **Maintain receipts** - Keep physical/digital backup documentation
✅ **Follow procedures** - Adhere to your organization's financial policies

### Your Responsibilities

As the Accountant with direct access to financial data:
- ✅ Maintain confidentiality of financial information
- ✅ Enter accurate data only - no estimates or guesses
- ✅ Report any suspicious activities to Admin immediately
- ✅ Use your access for legitimate business purposes only
- ✅ Log out when away from your computer
- ✅ Keep your password secure - never share your account
- ✅ Follow your organization's financial policies and procedures
- ✅ Don't attempt to access restricted features or data
- ✅ Double-check high-value transactions before saving
- ✅ Maintain professional ethics at all times

**Data Privacy:**
- Customer information is confidential
- Don't share financial data outside organization
- Secure physical documents (lock filing cabinets)
- Don't leave sensitive data on screen when away
- Dispose of old reports securely (shred paper)
- Don't discuss customer finances in public areas

**Password Security:**
```
Strong Password Requirements:
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not based on personal information
- Unique (not used elsewhere)
- Changed every 90 days

Never:
- Write password down
- Share with colleagues
- Use same password for multiple systems
- Save in browser on shared computers
```

---

## 📞 Support & Help

### Getting Help

1. **Press `?`** - View keyboard shortcuts and quick help
2. **Check this guide** - Most questions are answered here
3. **Check the relevant section:**
   - Booking questions → "Viewing Bookings" section
   - Expense issues → "Managing Expenses" section
   - Report problems → "Generating Reports" section
   - Technical issues → "Troubleshooting" section
4. **Contact Admin** - For access issues or system problems
5. **Contact Manager** - For booking-related or policy queries
6. **Technical Support** - For persistent technical issues

### Reporting Issues

When reporting a problem, include:
- What you were trying to do
- What happened instead
- Any error messages (take screenshot)
- Date and time of issue
- Which page/feature was involved

### Feature Requests

If you have suggestions for improving the system:
- Document your idea clearly
- Explain the benefit
- Provide example use case
- Submit to system administrator

---

## 📋 Quick Reference Card

### Your Access Summary

| Feature | View | Create | Edit | Delete |
|---------|------|--------|------|--------|
| Dashboard | ✅ | - | - | - |
| Calendar | ✅ | - | - | - |
| Bookings | ✅ | ❌ | ❌ | ❌ |
| Expenses | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | - | - |
| Halls | ❌ | ❌ | ❌ | ❌ |
| Users | ❌ | ❌ | ❌ | ❌ |
| Settings | ❌ | ❌ | ❌ | ❌ |

### Expense Categories

- ELECTRICITY
- WATER
- SALARY
- REPAIR_MAINTENANCE
- CLEANING
- DECORATION_MATERIAL
- CATERING_MATERIAL
- GENERATOR_FUEL
- RENT
- MISC

### Payment Types

- ADVANCE - Initial deposit
- FINAL - Balance payment
- REFUND - Money returned

### Booking Statuses

- INQUIRY - Just inquiring
- TENTATIVE - Tentatively booked
- CONFIRMED - Confirmed booking
- COMPLETED - Event finished
- CANCELLED - Booking cancelled

### Essential Keyboard Shortcuts

- `?` - Help
- `g + d` - Dashboard
- `g + b` - Bookings
- `g + c` - Calendar
- `g + e` - Expenses
- `g + r` - Reports
- `n` - New (on Expenses page)
- `/` - Search
- `Esc` - Cancel/Close

---

## 🎓 Training Checklist

Use this checklist to ensure you're comfortable with all features:

### Basic Operations
- [ ] Successfully logged in
- [ ] Navigated all accessible pages
- [ ] Used keyboard shortcuts for navigation
- [ ] Opened and read booking details
- [ ] Viewed financial breakdown of a booking

### Expense Management
- [ ] Created a new expense
- [ ] Linked expense to a booking
- [ ] Edited an existing expense
- [ ] Deleted an expense
- [ ] Filtered expenses by category
- [ ] Searched for specific expense
- [ ] Sorted expenses by date/amount

### Reporting
- [ ] Generated a monthly report
- [ ] Generated a custom date range report
- [ ] Exported report to PDF
- [ ] Exported report to Excel
- [ ] Interpreted revenue breakdown
- [ ] Understood expenses by category
- [ ] Analyzed hall-wise revenue

### Dashboard
- [ ] Changed month view
- [ ] Understood each metric card
- [ ] Checked upcoming bookings
- [ ] Reviewed bookings by status
- [ ] Identified profit margin

### Calendar
- [ ] Navigated different months
- [ ] Clicked on booking in calendar
- [ ] Understood status colors
- [ ] Identified busy periods

---

## 📚 Glossary

**Base Rent** - The standard hall rental charge before any additions or discounts

**Grand Total** - Final amount payable including all charges, after discount, plus tax

**Net Received** - Actual money received (payments minus refunds)

**Balance Due** - Outstanding amount (Grand Total minus Net Received)

**Additional Charges** - Extra services like AC, decoration, sound, etc.

**Advance Payment** - Initial deposit to confirm booking

**Final Payment** - Remaining balance payment

**Refund** - Money returned to customer

**Subtotal** - Amount before tax

**Tax Rate** - Percentage tax (usually GST 18%)

**Discount** - Reduction in price

**Related Booking** - Expense linked to a specific event/booking

**Net Profit** - Revenue minus expenses

**Profit Margin** - (Net Profit / Revenue) × 100

**Outstanding Balance** - Unpaid amount on booking

**Audit Log** - System record of all user actions (who did what, when)

**Audit Trail** - Complete history of changes for accountability and compliance

---

## 🔐 Security & Compliance

### Automatic Activity Logging

The Smritipat system is designed to automatically log all your financial activities to maintain a complete audit trail. This is a standard accounting practice for:

✅ **Financial accountability** - Track who made what changes
✅ **Compliance** - Meet regulatory requirements  
✅ **Error tracking** - Identify and correct mistakes
✅ **Security** - Detect unauthorized activities
✅ **Transparency** - Build trust with management

### What Gets Logged

The system is configured to log:
- Create an expense → Logged with full details
- Update an expense → Logged with what changed
- Delete an expense → Logged with what was deleted
- User management actions → User creation, updates, deletions
- Booking actions → Booking creation, updates, deletions
- Hall management → Hall creation, updates, status changes

### Information Recorded

For each action, the system is designed to record:
- Your user ID and name
- Action type (CREATE, UPDATE, DELETE, EXPORT)
- Date and time (precise timestamp)
- What was changed (category, amount, description)
- IP address and device information
- Any related bookings or references

### Viewing Audit Logs

As an Accountant, you **cannot view** the audit logs page. Only Admins have access to review the complete audit trail. This separation of duties is a security best practice.

**If you need to review your past actions:**
- Keep your own records of important changes
- Contact Admin if you need to verify past activities
- Use the expense list filters to find what you've entered

> **Technical Note:** The audit logging infrastructure has been implemented in the application code. All expense, booking, user, and hall operations include logging calls. If Admin users report that the audit log page is empty, this indicates a technical issue that requires developer investigation. The logging code is present and should be capturing all activities, but there may be a database connection, migration, or timing issue preventing logs from being saved properly.

### Compliance Tips

✅ **Accuracy first** - Enter correct information from the start
✅ **Document changes** - Keep notes on why you made corrections
✅ **Timely recording** - Record expenses when they occur
✅ **Regular reconciliation** - Match records with receipts weekly
✅ **Report issues** - Inform Admin of any discrepancies immediately
✅ **Maintain receipts** - Keep physical/digital backup documentation
✅ **Follow procedures** - Adhere to your organization's financial policies

### Your Responsibilities

As the Accountant with direct access to financial data:
- ✅ Maintain confidentiality of financial information
- ✅ Enter accurate data only
- ✅ Report any suspicious activities to Admin
- ✅ Use your access for legitimate business purposes only
- ✅ Log out when away from your computer
- ✅ Keep your password secure and don't share your account
- ✅ Follow your organization's financial policies

**Conversion Rate** - Percentage of inquiries that became confirmed bookings

---

## 🔄 Version History

This guide is maintained to reflect the current system capabilities.

**Current Version:** 1.0  
**Last Updated:** December 2024  
**System Version:** Smritipat v1.0

For questions or clarifications about this guide, contact your system administrator.

---

**Thank you for using Smritipat Hall Management System!**

Your diligent financial management helps keep our business running smoothly. 📊✨
