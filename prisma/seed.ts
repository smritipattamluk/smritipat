import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create System Settings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      currencySymbol: 'Rs.',
      defaultTaxRate: 0.18,
    },
  });
  console.log('✓ System settings created');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smritipat.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@smritipat.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✓ Admin user created (admin@smritipat.com / Admin@123)');

  // Create Manager User
  const managerPassword = await bcrypt.hash('Manager@123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@smritipat.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@smritipat.com',
      passwordHash: managerPassword,
      role: 'MANAGER',
      isActive: true,
    },
  });
  console.log('✓ Manager user created (manager@smritipat.com / Manager@123)');

  // Create Accountant User
  const accountantPassword = await bcrypt.hash('Accountant@123', 10);
  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@smritipat.com' },
    update: {},
    create: {
      name: 'Accountant User',
      email: 'accountant@smritipat.com',
      passwordHash: accountantPassword,
      role: 'ACCOUNTANT',
      isActive: true,
    },
  });
  console.log('✓ Accountant user created (accountant@smritipat.com / Accountant@123)');

  // Create Halls
  const groundFloorHall = await prisma.hall.upsert({
    where: { id: 'ground-floor-hall' },
    update: {},
    create: {
      id: 'ground-floor-hall',
      name: 'Smritipat Ground Floor',
      floor: 'GROUND',
      capacity: 100,
      baseRent: 15000,
      isActive: true,
    },
  });
  console.log('✓ Ground floor hall created (Smritipat Ground Floor)');

  const firstFloorHall = await prisma.hall.upsert({
    where: { id: 'first-floor-hall' },
    update: {},
    create: {
      id: 'first-floor-hall',
      name: 'Smritipat First Floor',
      floor: 'FIRST',
      capacity: 100,
      baseRent: 15000,
      isActive: true,
    },
  });
  console.log('✓ First floor hall created (Smritipat First Floor)');

  const bothFloorsHall = await prisma.hall.upsert({
    where: { id: 'both-floors-hall' },
    update: {},
    create: {
      id: 'both-floors-hall',
      name: 'Smritipat Both Floors',
      floor: 'BOTH',
      capacity: 200,
      baseRent: 25000,
      isActive: true,
    },
  });
  console.log('✓ Both floors hall created (Smritipat Both Floors)');

  // Update default hall in settings
  await prisma.systemSettings.update({
    where: { id: 'default' },
    data: { defaultHallId: bothFloorsHall.id },
  });

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📝 Default Users:');
  console.log('   Admin:      admin@smritipat.com / Admin@123');
  console.log('   Manager:    manager@smritipat.com / Manager@123');
  console.log('   Accountant: accountant@smritipat.com / Accountant@123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
