import { Prisma, PrismaClient } from '@prisma/client';
import { getRandomIntInclusive } from '../src/helpers/numbers';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedMemes();
}

async function seedUsers() {
  console.log('🌱🌱🌱seeding users🌱🌱🌱');
  const seedUsers: Prisma.UserCreateInput[] = [
    {
      address: '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5',
      description: 'its me yo',
      externalUrl: 'https://gainor.xyz',
      twitterUsername: 'gainor',
      lastAuthedAt: new Date('2023-01-05T13:23:00Z'),
    },
    {
      address: '0x901e7cbA2605CD3C125dFeD78d139A26bEf23325',
      lastAuthedAt: new Date(),
    },
    {
      address: '0x23d52C74fe2969092d39A70af5Cf1b1a6fcB8264',
      lastAuthedAt: new Date(),
    },
  ];
  const dbUsers = [];
  for (const user of seedUsers) {
    dbUsers.push(
      await prisma.user.upsert({
        where: { address: user.address },
        update: {},
        create: user,
      }),
    );
  }
  return dbUsers;
}

async function seedMemes() {
  console.log('🌱🌱🌱seeding a meme for each user🌱🌱🌱');
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new Error('Must seed users first.');
  }

  const media: Omit<Prisma.MediaCreateArgs['data'], 'user'>[] = [
    {
      width: 160,
      height: 160,
      filename: '1-9abe42fb6870cc1de2d3b3fe8b6d5e70-2023-01-07.png',
      filesize: 34574,
      s3BucketName: 'dev-meme-media',
    },
    {
      width: 1019,
      height: 1080,
      filename: '1-51dc414ddaf78cbd229dff1a8684504c-2023-01-07.jpg',
      filesize: 128748,
      s3BucketName: 'dev-meme-media',
    },
  ];

  const dbMemes = [];
  for (const user of users) {
    const dbMedia = await prisma.media.create({
      data: {
        ...media[getRandomIntInclusive(0, media.length - 1)],
        createdById: user.id as number,
      },
    });
    dbMemes.push(
      await prisma.meme.create({
        data: {
          name: 'A good meme',
          description: 'Description of a good meme',
          mediaId: dbMedia.id,
          createdById: user.id,
        },
      }),
    );
  }
}

async function seedCompetitions() {
  console.log('🌱🌱🌱seeding competitions🌱🌱🌱');
  const seedCompetitions: Prisma.CompetitionCreateInput[] = [];
  const dbCompetitions = [];
  for (const comp of seedCompetitions) {
    dbCompetitions.push(await prisma.competition.create({ data: comp }));
  }
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
