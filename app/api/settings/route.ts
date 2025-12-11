import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth-utils';
import { z } from 'zod';

const settingsSchema = z.object({
  currencySymbol: z.string().min(1).optional(),
  defaultTaxRate: z.number().min(0).max(1).optional(),
  defaultHallId: z.string().optional(),
});

// GET /api/settings - Get system settings
export async function GET() {
  try {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.systemSettings.create({
        data: {
          currencySymbol: '₹',
          defaultTaxRate: 0.18,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH /api/settings - Update system settings (ADMIN only)
export async function PATCH(request: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: validatedData,
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: validatedData,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
