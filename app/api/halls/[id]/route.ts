import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';

const updateHallSchema = z.object({
  name: z.string().min(1).optional(),
  floor: z.enum(['GROUND', 'FIRST', 'BOTH']).optional(),
  capacity: z.number().int().positive().optional(),
  baseRent: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

// GET /api/halls/[id] - Get hall by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const hall = await prisma.hall.findUnique({
      where: { id },
    });

    if (!hall) {
      return NextResponse.json({ error: 'Hall not found' }, { status: 404 });
    }

    return NextResponse.json(hall);
  } catch (error) {
    console.error('Error fetching hall:', error);
    return NextResponse.json({ error: 'Failed to fetch hall' }, { status: 500 });
  }
}

// PATCH /api/halls/[id] - Update hall (ADMIN/MANAGER only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(['ADMIN', 'MANAGER']);
    const { id } = await params;

    const body = await request.json();
    const validatedData = updateHallSchema.parse(body);

    const hall = await prisma.hall.update({
      where: { id },
      data: validatedData,
    });

    // Log hall update
    await logger.updated('hall', hall.id, session.user?.id, {
      ...validatedData,
      ...getRequestInfo(request),
    });

    return NextResponse.json(hall);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating hall:', error);
    return NextResponse.json({ error: 'Failed to update hall' }, { status: 500 });
  }
}

// DELETE /api/halls/[id] - Delete hall (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(['ADMIN']);
    const { id } = await params;

    // Check if hall has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { hallId: id },
    });

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete hall with existing bookings. Set it to inactive instead.' },
        { status: 400 }
      );
    }

    // Get hall details before deletion
    const hall = await prisma.hall.findUnique({
      where: { id },
      select: { name: true, floor: true },
    });

    await prisma.hall.delete({
      where: { id },
    });

    // Log hall deletion
    if (hall) {
      await logger.deleted('hall', id, session.user?.id, {
        name: hall.name,
        floor: hall.floor,
        ...getRequestInfo(request),
      });
    }

    return NextResponse.json({ message: 'Hall deleted successfully' });
  } catch (error) {
    console.error('Error deleting hall:', error);
    return NextResponse.json({ error: 'Failed to delete hall' }, { status: 500 });
  }
}
