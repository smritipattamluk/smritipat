import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';

// GET /api/reports - Generate financial reports
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get bookings in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: start,
          lte: end,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      include: {
        bookingCharges: true,
        payments: true,
        hall: { select: { name: true } },
      },
    });

    // Get expenses in the date range
    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: start,
          lte: end,
        },
      },
    });

    // Calculate totals
    let totalRent = 0;
    let totalChargesByType: Record<string, number> = {};
    let totalPaid = 0;
    let totalRefunds = 0;
    const earningsByHall: Record<string, number> = {};

    bookings.forEach((booking) => {
      totalRent += Number(booking.baseRent);

      // Track earnings by hall
      const hallName = booking.hall.name;
      if (!earningsByHall[hallName]) {
        earningsByHall[hallName] = 0;
      }

      // Calculate booking total
      let bookingTotal = Number(booking.baseRent);

      booking.bookingCharges.forEach((charge) => {
        const amount = Number(charge.amount);
        bookingTotal += amount;

        if (!totalChargesByType[charge.type]) {
          totalChargesByType[charge.type] = 0;
        }
        totalChargesByType[charge.type] += amount;
      });

      // Apply discount and tax
      bookingTotal -= Number(booking.discountAmount);
      const tax = bookingTotal * Number(booking.taxRate);
      bookingTotal += tax;

      earningsByHall[hallName] += bookingTotal;

      // Calculate payments
      booking.payments.forEach((payment) => {
        if (payment.type === 'REFUND') {
          totalRefunds += Number(payment.amount);
        } else {
          totalPaid += Number(payment.amount);
        }
      });
    });

    const netEarnings = totalPaid - totalRefunds;

    // Calculate expenses by category
    const expensesByCategory: Record<string, number> = {};
    let totalExpenses = 0;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount);
      totalExpenses += amount;

      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0;
      }
      expensesByCategory[expense.category] += amount;
    });

    // Calculate profit/loss
    const netProfit = netEarnings - totalExpenses;

    return NextResponse.json({
      period: { startDate, endDate },
      bookingsCount: bookings.length,
      earnings: {
        totalRent,
        chargesByType: totalChargesByType,
        grossEarnings: totalPaid,
        refunds: totalRefunds,
        netEarnings,
        earningsByHall,
      },
      expenses: {
        total: totalExpenses,
        byCategory: expensesByCategory,
      },
      netProfit,
      bookings: bookings.map((b) => ({
        id: b.id,
        customerName: b.customerName,
        eventDate: b.eventDate,
        hall: b.hall.name,
        baseRent: b.baseRent,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
