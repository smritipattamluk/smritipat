import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const paymentSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['ADVANCE', 'FINAL', 'REFUND']),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'UPI', 'OTHER']),
  paymentDate: z.string(), // ISO date string
  reference: z.string().optional(),
});

// GET /api/bookings/[id]/payments - Get all payments for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const payments = await prisma.payment.findMany({
      where: { bookingId: id },
      orderBy: { paymentDate: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST /api/bookings/[id]/payments - Add a payment to booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        bookingId: id,
        amount: validatedData.amount,
        type: validatedData.type,
        paymentMethod: validatedData.paymentMethod,
        paymentDate: new Date(validatedData.paymentDate),
        reference: validatedData.reference || null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
