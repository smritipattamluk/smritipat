import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';

// GET /api/logs - Get audit logs (ADMIN only)
export async function GET(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const where: any = {};

    if (level) where.level = level;
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

// DELETE /api/logs - Clear old logs (ADMIN only)
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const { searchParams } = new URL(request.url);
    const daysToKeep = parseInt(searchParams.get('daysToKeep') || '90');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return NextResponse.json({
      message: `Deleted ${result.count} log entries older than ${daysToKeep} days`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error deleting logs:', error);
    return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });
  }
}
