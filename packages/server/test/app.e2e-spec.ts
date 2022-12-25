import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './../src/s3/s3.service';

import { getExpressRedisSession } from '../src/middleware/session';
import getValidationPipe from '../src/middleware/validation';
import { AppModule } from './../src/app.module';
import S3Fixture from './fixtures/services/s3.service.fixture';
import TestUser from './helpers/TestUser';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(S3Service)
      .useValue(S3Fixture)
      .compile();

    app = moduleFixture.createNestApplication();

    // grab our middleware
    app.use(getExpressRedisSession(app));
    app.useGlobalPipes(getValidationPipe());

    await app.init();
    server = app.getHttpServer();
  });

  // it('/ (GET)', () => {
  //   return superRequest
  //     .agent(server)
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  // it('/auth/nonce (GET)', () => {
  //   return getNonceReq(server).then(({ res }) => {
  //     expect(res.body.nonce).toBeDefined();
  //   });
  // });

  // it('/auth/verify (POST)', () => {
  //   return getNewUser(server);
  // });

  // it('/user (GET)', async () => {
  //   const { agent, wallet } = await getNewUser(server);
  //   return agent
  //     .get('/user')
  //     .expect(200)
  //     .then((res) => {
  //       const { user } = res.body;
  //       expect(wallet.address).toBe(user.address);
  //     });
  // });

  // it('/meme (POST)', async () => {
  //   const details = {
  //     name: 'TEST',
  //     description: 'memesbruh',
  //     pathToImage: 'test/fixtures/avatar.png',
  //   };
  //   const { agent } = await getNewUser(server);
  //   return postMeme(agent, details)
  //     .expect(201)
  //     .expect((res) => {
  //       const { body } = res;
  //       expect(body.name).toEqual(details.name);
  //       expect(body.description).toEqual(details.description);
  //     });
  // });

  // it('/meme (POST) not authenticated', async () => {
  //   return postMeme(getAgent(server)).expect(401);
  // });

  // it('/meme (POST) throws invalid mimetype', async () => {
  //   const details = {
  //     name: 'FAILURE',
  //     description: 'this should be rejected',
  //     pathToImage: 'test/fixtures/house.webp',
  //   };
  //   const { agent } = await getNewUser(server);
  //   return postMeme(agent, details)
  //     .expect(400)
  //     .expect((res) => {
  //       expect(res.body.message).toEqual(
  //         'Invalid mimetype. Only the following are accepted: image/jpeg, image/png, image/gif, image/svg+xml',
  //       );
  //     });
  // });

  // it('/meme (POST) throws multiple files', async () => {
  //   const { agent } = await getNewUser(server);
  //   return postMeme(agent)
  //     .attach('file', 'test/fixtures/avatar.png')
  //     .expect(400);
  // });

  // it('/meme/:id/comment (POST) posts comment on meme', async () => {
  //   const { agent } = await getNewUser(server);
  //   return postMeme(agent)
  //     .expect(201)
  //     .then((_res) => {
  //       const { body } = _res;
  //       return postComment(agent, {
  //         memeId: body.id,
  //         body: 'Dope meme bruh',
  //       }).expect(201);
  //     });
  // });

  // it('/meme/:id/comment (POST) posts comment and replies', async () => {
  //   const { agent } = await getNewUser(server);
  //   return postMeme(agent)
  //     .expect(201)
  //     .then((res) => {
  //       const { body } = res;
  //       return postComment(agent, {
  //         memeId: body.id,
  //         body: 'check it out yuh',
  //       }).then((res) => {
  //         return postComment(agent, {
  //           memeId: body.id,
  //           body: 'reply to your dank meme comment',
  //           parentCommentId: res.body.id,
  //         }).then((res) => console.log(res.body));
  //       });
  //     });
  // });

  // it('/competition (POST)', async () => {
  //   const user = await getNewUser(server);
  //   await postCompetition(user.agent, user.wallet).expect(201);
  // });

  // it('/competition (GET)', async () => {
  //   const { agent, wallet } = await getNewUser(server);
  //   const details = {
  //     name: 'Cool Competition',
  //     description: 'Checkout this sick competition',
  //     maxUserSubmissions: 1,
  //     endsAt: new Date(),
  //   };
  //   postCompetition(agent, wallet, details).expect((res) => {
  //     const { body } = res;
  //     expect(body.name).toEqual(details.name);
  //     expect(body.description).toEqual(details.description);
  //     expect(body.maxUserSubmissions).toEqual(details.maxUserSubmissions);
  //     expect(body.endsAt).toEqual(details.endsAt.toISOString());
  //     return agent
  //       .get('/competition')
  //       .expect(200)
  //       .expect((res) => {
  //         const { body } = res;
  //         expect(body.length).toBeGreaterThan(0);

  //         const competition = body.filter((item) => item.id === res.id)[0];
  //         const curators = competition.curators;

  //         expect(curators.length).toEqual(1);
  //         expect(curators[0].address).toEqual(wallet.address);
  //         expect(curators[0].isSuperAdmin).toEqual(false);
  //         expect(curators[0].isVerified).toEqual(false);

  //         expect(competition.name).toEqual(details.name);
  //         expect(competition.description).toEqual(details.description);
  //         expect(competition.maxUserSubmissions).toEqual(
  //           details.maxUserSubmissions,
  //         );
  //         expect(competition.endsAt).toEqual(details.endsAt.toISOString());
  //       });
  //   });
  // });

  it('/submission (POST)', async () => {
    jest.setTimeout(30000);

    const user1 = new TestUser(server);
    await user1.auth();
    console.log('user 1 wallet address', user1.address);

    const user2 = new TestUser(server);
    await user2.auth();

    const user3 = new TestUser(server);
    await user3.auth();

    return user1
      .postCompetition({
        name: 'The Doge NFT',
        description: 'For the Doge NFT',
        endsAt: new Date(),
        maxUserSubmissions: 2,
        curators: [user1.address, user2.address],
      })
      .expect(201)
      .then(({ body: competition }) => {
        console.log('competition', competition);
        return user3
          .postMeme({
            name: 'Sick meme',
            description: 'check it out',
            pathToFile: 'test/fixtures/avatar.png',
          })
          .expect(201)
          .then(({ body: meme }) => {
            return user3
              .postSubmission({
                competitionId: competition.id,
                memeId: meme.id,
              })
              .expect(201)
              .then(() => {
                return user3
                  .getCompetitionMemes(competition.id)
                  .then(({ body: competitionMemes }) => {
                    expect(competitionMemes.length).toBeGreaterThan(0);
                    const expectedMeme = competitionMemes.filter(
                      (item) => item.id === meme.id,
                    )[0];
                    expect(meme).toEqual(expectedMeme);
                  });
              });
          });
      });

    // return postCompetition(user1.agent, user1.wallet, {
    //   name: 'The Doge NFT',
    //   description: 'For the Doge NFT',
    //   maxUserSubmissions: 2,
    //   endsAt: new Date(),
    //   curators: [user1.wallet.address, user2.wallet.address],
    // })
    //   .expect(201)
    //   .then(({ body: competition }) => {
    //     return postMeme(user3.agent)
    //       .expect(201)
    //       .then(({ body: meme }) => {
    //         return postSubmission(user3.agent, {
    //           competitionId: competition.id,
    //           memeId: meme.id,
    //         })
    //           .expect(201)
    //           .then(() => {
    //             return user3.agent
    //               .get(`/competition/${competition.id}/meme`)
    //               .expect(200)
    //               .then(({ body: competitionMemes }) => {
    //                 expect(competitionMemes.length).toBeGreaterThan(0);
    //                 const expectedMeme = competitionMemes.filter(
    //                   (item) => item.id === meme.id,
    //                 )[0];
    //                 expect(meme).toEqual(expectedMeme);
    //               });
    //           });
    //       });
    //   });
  });

  afterAll(async () => {
    await app.close();
  });
});
