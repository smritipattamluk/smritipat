import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';

const hallSchema = z.object({
  name: z.string().min(1),
  floor: z.enum(['GROUND', 'FIRST', 'BOTH']),
  capacity: z.number().int().positive(),
  baseRent: z.number().positive(),
  isActive: z.boolean().optional(),
});

// GET /api/halls - List all halls
export async function GET() {
  try {
    const halls = await prisma.hall.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(halls);
  } catch (error) {
    console.error('Error fetching halls:', error);
    return NextResponse.json({ error: 'Failed to fetch halls' }, { status: 500 });
  }
}

// POST /api/halls - Create a new hall (ADMIN/MANAGER only)
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(['ADMIN', 'MANAGER']);

    const body = await request.json();
    const validatedData = hallSchema.parse(body);

    const hall = await prisma.hall.create({
      data: validatedData,
    });

    // Log hall creation
    await logger.created('hall', hall.id, session.user?.id, {
      name: hall.name,
      floor: hall.floor,
      capacity: hall.capacity,
      ...getRequestInfo(request),
    });

    return NextResponse.json(hall, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating hall:', error);
    return NextResponse.json({ error: 'Failed to create hall' }, { status: 500 });
  }
}
