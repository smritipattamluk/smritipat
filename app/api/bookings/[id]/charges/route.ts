import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const chargeSchema = z.object({
  type: z.enum(['AC', 'DECORATION', 'SOUND', 'CATERING', 'CLEANING', 'GENERATOR', 'OTHER']),
  description: z.string().min(1),
  amount: z.number().positive(),
});

// GET /api/bookings/[id]/charges - Get all charges for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const charges = await prisma.bookingCharge.findMany({
      where: { bookingId: id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(charges);
  } catch (error) {
    console.error('Error fetching charges:', error);
    return NextResponse.json({ error: 'Failed to fetch charges' }, { status: 500 });
  }
}

// POST /api/bookings/[id]/charges - Add a charge to booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const validatedData = chargeSchema.parse(body);

    const charge = await prisma.bookingCharge.create({
      data: {
        bookingId: id,
        ...validatedData,
      },
    });

    return NextResponse.json(charge, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating charge:', error);
    return NextResponse.json({ error: 'Failed to create charge' }, { status: 500 });
  }
}
