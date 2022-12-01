import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
}

async function seedUsers() {
  console.log('seeding users');
  const one = await prisma.user.upsert({
    where: { address: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5' },
    update: {},
    create: {
      address: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
      description: 'test user',
      externalUrl: 'https://gainor.xyz',
      twitterUsername: 'gainor',
      lastAuthedAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
