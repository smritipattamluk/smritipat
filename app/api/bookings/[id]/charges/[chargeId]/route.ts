import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const updateChargeSchema = z.object({
  type: z.enum(['AC', 'DECORATION', 'SOUND', 'CATERING', 'CLEANING', 'GENERATOR', 'OTHER']).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
});

// PATCH /api/bookings/[id]/charges/[chargeId] - Update a charge
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chargeId: string }> }
) {
  try {
    await requireAuth();
    const { chargeId } = await params;

    const body = await request.json();
    const validatedData = updateChargeSchema.parse(body);

    const charge = await prisma.bookingCharge.update({
      where: { id: chargeId },
      data: validatedData,
    });

    return NextResponse.json(charge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating charge:', error);
    return NextResponse.json({ error: 'Failed to update charge' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]/charges/[chargeId] - Delete a charge
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chargeId: string }> }
) {
  try {
    await requireAuth();
    const { chargeId } = await params;

    await prisma.bookingCharge.delete({
      where: { id: chargeId },
    });

    return NextResponse.json({ message: 'Charge deleted successfully' });
  } catch (error) {
    console.error('Error deleting charge:', error);
    return NextResponse.json({ error: 'Failed to delete charge' }, { status: 500 });
  }
}
