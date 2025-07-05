import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Hash the admin password
    const adminPassword = 'admin123'; // Replace with a secure password
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // 10 is the salt rounds

    // Create or update the admin user
    await prisma.admin.upsert({
      where: { name: 'admin' }, // 'name' is the unique field in your Admin model
      update: {}, // No updates if user exists
      create: {
        name: 'admin',
        password: hashedPassword,
        email: 'admin@example.com', // Optional
      },
    });

    console.log('Admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();