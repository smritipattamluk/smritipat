import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { logger, getRequestInfo } from '@/lib/audit-logger';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'ACCOUNTANT', 'VIEWER']).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6),
});

// GET /api/users/[id] - Get user by ID (ADMIN only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['ADMIN']);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user (ADMIN only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(['ADMIN']);
    const { id } = await params;

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const updateData: any = {};
    
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.role) updateData.role = validatedData.role;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    
    // Hash password if provided
    if (validatedData.password) {
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Log user update
    const logMetadata: any = { ...getRequestInfo(request) };
    if (validatedData.name) logMetadata.name = validatedData.name;
    if (validatedData.email) logMetadata.email = validatedData.email;
    if (validatedData.role) logMetadata.role = validatedData.role;
    if (validatedData.isActive !== undefined) logMetadata.isActive = validatedData.isActive;
    if (validatedData.password) logMetadata.passwordChanged = true;

    await logger.updated('user', user.id, session.user?.id, logMetadata);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole(['ADMIN']);
    const { id } = await params;

    // Prevent deleting your own account
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get user details before deletion
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true, role: true },
    });

    await prisma.user.delete({
      where: { id },
    });

    // Log user deletion
    if (user) {
      await logger.deleted('user', id, session.user?.id, {
        name: user.name,
        email: user.email,
        role: user.role,
        ...getRequestInfo(request),
      });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
