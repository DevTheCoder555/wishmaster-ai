import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user for instant testing
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'demo@wishmaster.ai' },
    update: {},
    create: {
      email: 'demo@wishmaster.ai',
      password: hashedPassword,
      name: 'Demo User',
      credits: 100,
    },
  });

  console.log('✅ Demo user created: demo@wishmaster.ai / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });