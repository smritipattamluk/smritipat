import { prisma } from '../lib/db';

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log('Users in database:');
  console.table(users);

  await prisma.$disconnect();
}

checkUsers().catch(console.error);
