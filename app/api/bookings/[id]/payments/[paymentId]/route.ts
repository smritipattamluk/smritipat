import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';

const updatePaymentSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['ADVANCE', 'FINAL', 'REFUND']).optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'UPI', 'OTHER']).optional(),
  paymentDate: z.string().optional(),
  reference: z.string().optional(),
});

// PATCH /api/bookings/[id]/payments/[paymentId] - Update a payment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  try {
    await requireAuth();
    const { paymentId } = await params;

    const body = await request.json();
    const validatedData = updatePaymentSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.paymentDate) {
      updateData.paymentDate = new Date(validatedData.paymentDate);
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
    });

    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]/payments/[paymentId] - Delete a payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  try {
    await requireAuth();
    const { paymentId } = await params;

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
