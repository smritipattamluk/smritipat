import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { startOfMonth, endOfMonth, addDays } from 'date-fns';

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Optional YYYY-MM format

    // Default to current month
    const now = new Date();
    const periodStart = month ? new Date(`${month}-01`) : startOfMonth(now);
    const periodEnd = month ? endOfMonth(new Date(`${month}-01`)) : endOfMonth(now);

    // Get bookings stats
    const bookingStats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        eventDate: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _count: {
        id: true,
      },
    });

    // Get confirmed/completed bookings for financial calculations
    const bookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      include: {
        bookingCharges: true,
        payments: true,
      },
    });

    // Calculate earnings
    let totalEarnings = 0;
    bookings.forEach((booking) => {
      let bookingTotal = Number(booking.baseRent);

      booking.bookingCharges.forEach((charge) => {
        bookingTotal += Number(charge.amount);
      });

      bookingTotal -= Number(booking.discountAmount);
      const tax = bookingTotal * Number(booking.taxRate);
      bookingTotal += tax;

      totalEarnings += bookingTotal;
    });

    // Get expenses for the period
    const expenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Calculate net profit
    const netProfit = totalEarnings - totalExpenses;

    // Get upcoming bookings (next 30 days)
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        eventDate: {
          gte: now,
          lte: addDays(now, 30),
        },
        status: { in: ['TENTATIVE', 'CONFIRMED'] },
      },
      include: {
        hall: { select: { name: true } },
      },
      orderBy: { eventDate: 'asc' },
      take: 10,
    });

    // Format booking stats
    const bookingsByStatus = bookingStats.reduce(
      (acc, stat) => {
        acc[stat.status] = stat._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      period: {
        start: periodStart,
        end: periodEnd,
      },
      earnings: totalEarnings,
      expenses: totalExpenses,
      netProfit,
      bookingsByStatus,
      upcomingBookings: upcomingBookings.map((booking) => ({
        id: booking.id,
        customerName: booking.customerName,
        eventDate: booking.eventDate,
        eventType: booking.eventType,
        hall: booking.hall.name,
        status: booking.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
