import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.city.createMany({
    data: [
      { name: 'London' },
      { name: 'Manchester' },
    ],
  });

  await prisma.brand.createMany({
    data: [
      { name: "McDonald's" },
      { name: 'Burger King' },
    ],
  });

  await prisma.dishType.createMany({
    data: [
      { name: 'Sushi' },
      { name: 'Pizza' },
    ],
  });

  await prisma.diet.createMany({
    data: [
      { name: 'Vegan' },
      { name: 'Vegetarian' },
    ],
  });
}

main()
  .then(() => {
    console.log('Database seeded!');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
