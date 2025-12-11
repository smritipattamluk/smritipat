import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';

const expenseSchema = z.object({
  category: z.enum([
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
  ]),
  relatedBookingId: z.string().optional(),
  description: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string(), // ISO date string
});

// GET /api/expenses - List expenses with filters
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const bookingId = searchParams.get('bookingId');

    const where: any = {};

    if (category) where.category = category;
    if (bookingId) where.relatedBookingId = bookingId;
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        relatedBooking: {
          select: {
            id: true,
            customerName: true,
            eventDate: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { expenseDate: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const body = await request.json();
    const validatedData = expenseSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        category: validatedData.category,
        relatedBookingId: validatedData.relatedBookingId || null,
        description: validatedData.description,
        amount: validatedData.amount,
        expenseDate: new Date(validatedData.expenseDate),
        createdByUserId: session.user.id,
      },
      include: {
        relatedBooking: {
          select: {
            customerName: true,
            eventDate: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
      },
    });

    // Log expense creation
    await logger.created('expense', expense.id, session.user.id, {
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      ...getRequestInfo(request),
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
