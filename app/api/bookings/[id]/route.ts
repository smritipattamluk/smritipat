import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';
import { timeStringToDate, dateToTimeString } from '@/lib/utils';

const updateBookingSchema = z.object({
  hallId: z.string().optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  eventType: z.string().min(1).optional(),
  eventDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(['INQUIRY', 'TENTATIVE', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  baseRent: z.number().positive().optional(),
  discountAmount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
});

// GET /api/bookings/[id] - Get booking by ID with all details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        hall: true,
        createdBy: { select: { name: true, email: true } },
        bookingCharges: { orderBy: { createdAt: 'asc' } },
        payments: { orderBy: { paymentDate: 'desc' } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Serialize times properly
    const serializedBooking = {
      ...booking,
      startTime: dateToTimeString(booking.startTime),
      endTime: dateToTimeString(booking.endTime),
    };

    return NextResponse.json(serializedBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PATCH /api/bookings/[id] - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const validatedData = updateBookingSchema.parse(body);

    const updateData: any = { ...validatedData };

    // Convert date/time strings if provided
    if (validatedData.eventDate) {
      updateData.eventDate = new Date(validatedData.eventDate);
    }
    if (validatedData.startTime) {
      updateData.startTime = timeStringToDate(validatedData.startTime);
    }
    if (validatedData.endTime) {
      updateData.endTime = timeStringToDate(validatedData.endTime);
    }
    if (validatedData.customerEmail === '') {
      updateData.customerEmail = null;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        hall: true,
        bookingCharges: true,
        payments: true,
      },
    });

    // Log booking update
    await logger.updated('booking', booking.id, session.user?.id, {
      ...validatedData,
      ...getRequestInfo(request),
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Get booking details before deletion
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { customerName: true, eventDate: true },
    });

    await prisma.booking.delete({
      where: { id },
    });

    // Log booking deletion
    if (booking) {
      await logger.deleted('booking', id, session.user?.id, {
        customerName: booking.customerName,
        eventDate: booking.eventDate.toISOString(),
        ...getRequestInfo(request),
      });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
