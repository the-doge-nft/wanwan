import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as superRequest from 'supertest';
import { S3Service } from './../src/s3/s3.service';

import { getExpressRedisSession } from '../src/middleware/session';
import getValidationPipe from '../src/middleware/validation';
import { AppModule } from './../src/app.module';
import S3Fixture from './fixtures/services/s3.service.fixture';
import {
  commentKeys,
  competitionKeys,
  mediaKeys,
  memeKeys,
  userKeys,
  voteKeys,
} from './helpers/expectedKeys';
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

  it('/ (GET)', () => {
    return superRequest
      .agent(server)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/nonce (GET)', () => {
    const user = new TestUser(server);
    return user.getAuthNonce().then(({ body }) => {
      expect(body.nonce).toBeDefined();
    });
  });

  it('/auth/verify (POST)', () => {
    const user = new TestUser(server);
    return user.auth().then((res) => {
      expect(res.status).toEqual(201);
      const { body } = res;
      userKeys.forEach((key) => expect(body).toHaveProperty(key));
    });
  });

  it('/user (GET)', async () => {
    const user = await TestUser.createAuthed(server);

    return user
      .getUser()
      .expect(200)
      .then(({ body }) => {
        userKeys.forEach((key) => expect(body).toHaveProperty(key));
        expect(body.address).toEqual(user.address);
      });
  });

  it('/meme (POST)', async () => {
    const user = await TestUser.createAuthed(server);
    const details = {
      name: 'TEST',
      description: 'memesbruh',
      pathToFile: 'test/fixtures/avatar.png',
    };

    return user
      .postMeme(details)
      .expect(201)
      .expect((res) => {
        const { body } = res;
        expect(body.name).toEqual(details.name);
        expect(body.description).toEqual(details.description);
        memeKeys.forEach((key) => expect(body).toHaveProperty(key));
        mediaKeys.forEach((key) => expect(body.media).toHaveProperty(key));
      });
  });

  it('/meme (POST) not authenticated', async () => {
    const user = new TestUser(server);
    return user.postMeme().expect(401);
  });

  it('/meme (POST) throws invalid mimetype', async () => {
    const details = {
      name: 'FAILURE',
      description: 'this should be rejected',
      pathToFile: 'test/fixtures/house.webp',
    };
    const user = await TestUser.createAuthed(server);
    return user
      .postMeme(details)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          'Invalid mimetype. Only the following are accepted: image/jpeg, image/png, image/gif, image/svg+xml',
        );
      });
  });

  it('/meme (POST) throws multiple files', async () => {
    const user = await TestUser.createAuthed(server);
    return user
      .postMeme()
      .attach('file', 'test/fixtures/avatar.png')
      .expect(400);
  });

  it('/meme/:id/comment (POST) posts comment on meme', async () => {
    const user = await TestUser.createAuthed(server);
    return user
      .postMeme()
      .expect(201)
      .then((res) => {
        const { body } = res;
        return user
          .postComment({ memeId: body.id, body: 'Dope meme bruh' })
          .expect(201);
      });
  });

  it('/meme/:id/comment (POST) posts comment and replies', async () => {
    const user = await TestUser.createAuthed(server);
    return user
      .postMeme()
      .expect(201)
      .expect(({ body: memeBody }) => {
        return user
          .postComment({
            memeId: memeBody.id,
            body: 'Check it out yo',
          })
          .expect(201)
          .expect(({ body: commentBody }) => {
            commentKeys.forEach((key) =>
              expect(commentBody).toHaveProperty(key),
            );
            return user
              .postComment({
                memeId: memeBody.id,
                body: 'replying to this dank comment',
                parentCommentId: commentBody.id,
              })
              .expect(201);
          });
      });
  });

  it('/competition (POST)', async () => {
    const user = await TestUser.createAuthed(server);
    return user
      .postCompetition({
        name: 'The Doge NFT',
        description: 'A cool competition',
        endsAt: new Date(),
        curators: [user.address],
        maxUserSubmissions: 1,
      })
      .expect(201)
      .expect(({ body }) => {
        competitionKeys.forEach((key) => expect(body).toHaveProperty(key));
      });
  });

  it('/competition (GET)', async () => {
    const user = await TestUser.createAuthed(server);
    const details = {
      name: 'Cool Competition',
      description: 'Checkout this sick competition',
      maxUserSubmissions: 1,
      endsAt: new Date(),
      curators: [user.address],
    };
    return user.postCompetition(details).expect(({ body: competitionBody }) => {
      expect(competitionBody.name).toEqual(details.name);
      expect(competitionBody.description).toEqual(details.description);
      expect(competitionBody.maxUserSubmissions).toEqual(
        details.maxUserSubmissions,
      );
      expect(competitionBody.endsAt).toEqual(details.endsAt.toISOString());
      return user
        .getCompetition()
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toBeGreaterThan(0);

          const competition = body.filter(
            (item) => item.id === competitionBody.id,
          )[0];
          competitionKeys.forEach((key) =>
            expect(competition).toHaveProperty(key),
          );

          const curators = competition.curators;

          expect(curators.length).toEqual(1);
          expect(curators[0].address).toEqual(user.address);
          expect(curators[0].isSuperAdmin).toEqual(false);
          expect(curators[0].isVerified).toEqual(false);

          expect(competition.name).toEqual(details.name);
          expect(competition.description).toEqual(details.description);
          expect(competition.maxUserSubmissions).toEqual(
            details.maxUserSubmissions,
          );
          expect(competition.endsAt).toEqual(details.endsAt.toISOString());
        });
    });
  });

  it('/submission (POST)', async () => {
    jest.setTimeout(30000);

    const user1 = await TestUser.createAuthed(server);
    const user2 = await TestUser.createAuthed(server);
    const user3 = await TestUser.createAuthed(server);

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
                    competitionMemes.forEach((meme) => {
                      memeKeys.forEach((key) =>
                        expect(meme).toHaveProperty(key),
                      );
                      mediaKeys.forEach((key) =>
                        expect(meme.media).toHaveProperty(key),
                      );
                    });
                    expect(competitionMemes.length).toBeGreaterThan(0);
                    const expectedMeme = competitionMemes.filter(
                      (item) => item.id === meme.id,
                    )[0];
                    expect(meme).toEqual(expectedMeme);
                  });
              });
          });
      });
  });

  it('/vote POST', async () => {
    const user1 = await TestUser.createAuthed(server);
    const user2 = await TestUser.createAuthed(server);
    const user3 = await TestUser.createAuthed(server);
    return user1
      .postCompetition({
        name: 'Another meme competition',
        description: 'Checkout this sick competition',
        endsAt: new Date(),
        curators: [user1.address],
        maxUserSubmissions: 1,
      })
      .then(({ body: competition }) => {
        return user2
          .postMeme()
          .expect(201)
          .then(({ body: meme }) => {
            return user2
              .postSubmission({
                memeId: meme.id,
                competitionId: competition.id,
              })
              .expect(201)
              .then(() => {
                return user3
                  .postVote({
                    competitionId: competition.id,
                    memeId: meme.id,
                    score: 1,
                  })
                  .expect(200)
                  .expect(({ body: vote }) => {
                    voteKeys.forEach((key) => expect(vote).toHaveProperty(key));
                  });
              });
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
