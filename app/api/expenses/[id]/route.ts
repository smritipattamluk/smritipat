import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';

const updateExpenseSchema = z.object({
  category: z
    .enum([
      'ELECTRICITY',
      'WATER',
      'SALARY',
      'REPAIR_MAINTENANCE',
      'CLEANING',
      'DECORATION_MATERIAL',
      'CATERING_MATERIAL',
      'GENERATOR_FUEL',
      'RENT',
      'MISC',
    ])
    .optional(),
  relatedBookingId: z.string().optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  expenseDate: z.string().optional(),
});

// GET /api/expenses/[id] - Get expense by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        relatedBooking: true,
        createdBy: { select: { name: true, email: true } },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
  }
}

// PATCH /api/expenses/[id] - Update expense
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const validatedData = updateExpenseSchema.parse(body);

    const updateData: any = { ...validatedData };
    if (validatedData.expenseDate) {
      updateData.expenseDate = new Date(validatedData.expenseDate);
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        relatedBooking: true,
        createdBy: { select: { name: true } },
      },
    });

    // Log expense update
    await logger.updated('expense', expense.id, session.user?.id, {
      ...validatedData,
      ...getRequestInfo(request),
    });

    return NextResponse.json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Get expense details before deletion
    const expense = await prisma.expense.findUnique({
      where: { id },
      select: { category: true, amount: true, description: true },
    });

    await prisma.expense.delete({
      where: { id },
    });

    // Log expense deletion
    if (expense) {
      await logger.deleted('expense', id, session.user?.id, {
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        ...getRequestInfo(request),
      });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
