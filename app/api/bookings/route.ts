import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';
import { timeStringToDate, dateToTimeString } from '@/lib/utils';

const bookingSchema = z.object({
  hallId: z.string(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal('')),
  eventType: z.string().min(1),
  eventDate: z.string(), // ISO date string
  startTime: z.string(), // HH:mm format
  endTime: z.string(), // HH:mm format
  status: z.enum(['INQUIRY', 'TENTATIVE', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  baseRent: z.number().positive(),
  discountAmount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
});

// GET /api/bookings - List bookings with filters
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const hallId = searchParams.get('hallId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};

    if (hallId) where.hallId = hallId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.eventDate = {};
      if (startDate) where.eventDate.gte = new Date(startDate);
      if (endDate) where.eventDate.lte = new Date(endDate);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hall: { select: { name: true } },
        createdBy: { select: { name: true } },
        bookingCharges: true,
        payments: true,
      },
      orderBy: { eventDate: 'desc' },
    });

    // Serialize times properly
    const serializedBookings = bookings.map(booking => ({
      ...booking,
      startTime: dateToTimeString(booking.startTime),
      endTime: dateToTimeString(booking.endTime),
    }));

    return NextResponse.json(serializedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    // Verify user exists
    if (!session.user?.id) {
      console.error('No user ID in session:', session);
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    console.log('Creating booking with user ID:', session.user.id);

    // Parse dates and times
    const eventDate = new Date(validatedData.eventDate);
    const startTime = timeStringToDate(validatedData.startTime);
    const endTime = timeStringToDate(validatedData.endTime);

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        hallId: validatedData.hallId,
        eventDate: eventDate,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { error: 'Hall is already booked for this time slot' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        hallId: validatedData.hallId,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerEmail: validatedData.customerEmail || null,
        eventType: validatedData.eventType,
        eventDate,
        startTime,
        endTime,
        status: validatedData.status || 'INQUIRY',
        baseRent: validatedData.baseRent,
        discountAmount: validatedData.discountAmount || 0,
        taxRate: validatedData.taxRate || 0,
        notes: validatedData.notes || null,
        createdByUserId: session.user.id,
      },
      include: {
        hall: true,
        createdBy: { select: { name: true } },
      },
    });

    // Log booking creation
    await logger.created('booking', booking.id, session.user.id, {
      hallId: booking.hallId,
      customerName: booking.customerName,
      eventDate: booking.eventDate.toISOString(),
      ...getRequestInfo(request),
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
