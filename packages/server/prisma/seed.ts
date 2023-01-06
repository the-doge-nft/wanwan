import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await seedUsers();
  console.log('users', users);
  // const competitions = await seedCompetitions();
  // console.log('competitions', competitions);
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
  console.log('🌱🌱🌱seeding memes🌱🌱🌱');
  const users = await prisma.user.findMany();

  const media: Prisma.MediaCreateArgs['data'] = {
    width: 100,
    height: 100,
    filename: 'test',
    filesize: 100,
    s3BucketName: '',
    createdById: users[0].id,
  };

  // const seedMemes: Prisma.MemeCreateInput[] = [
  //   {
  //     name: 'dope meme',
  //     description: 'not a dope meme',
  //   },
  // ];
  const dbMemes = [];
  for (const user of users) {
  }
  // for (const meme of seedMemes) {
  //   dbMemes.push(await prisma.meme.create({ data: meme }));
  // }
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
