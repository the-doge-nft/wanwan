import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as superRequest from 'supertest';
import { getExpressRedisSession } from '../src/middleware/session';
import getValidationPipe from '../src/middleware/validation';
import { AppModule } from './../src/app.module';
import {
  getNewUser,
  getNonceReq,
  mockS3PutObject,
  postComment,
  postCompetition,
  postMeme,
} from './helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let superAgent: superRequest.SuperAgentTest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // mock all s3 put object requests used for storing media
    mockS3PutObject(moduleFixture);

    app = moduleFixture.createNestApplication();

    // grab our middleware
    app.use(getExpressRedisSession(app));
    app.useGlobalPipes(getValidationPipe());

    await app.init();
    server = app.getHttpServer();
    superAgent = superRequest.agent(server);
  });

  it('/ (GET)', () => {
    return superAgent.get('/').expect(200).expect('Hello World!');
  });

  it('/auth/nonce (GET)', () => {
    return getNonceReq(superAgent).expect((res) => {
      expect(res.body.nonce).toBeDefined();
    });
  });

  it('/auth/verify (POST)', () => {
    return getNewUser(superAgent);
  });

  it('/user (GET)', async () => {
    const { agent, wallet } = await getNewUser(superAgent);
    return agent
      .get('/user')
      .expect(200)
      .then((res) => {
        const { user } = res.body;
        expect(wallet.address).toBe(user.address);
      });
  });

  it('/meme (POST)', async () => {
    const details = {
      name: 'TEST',
      description: 'memesbruh',
      pathToImage: 'test/fixtures/avatar.png',
    };
    const { agent } = await getNewUser(superAgent);
    return postMeme(agent, details)
      .expect(201)
      .expect((res) => {
        const { body } = res;
        expect(body.name).toEqual(details.name);
        expect(body.description).toEqual(details.description);
      });
  });

  it('/meme (POST) not authenticated', async () => {
    return postMeme(superAgent).expect(401);
  });

  it('/meme (POST) throws invalid mimetype', async () => {
    const details = {
      name: 'FAILURE',
      description: 'this should be rejected',
      pathToImage: 'test/fixtures/house.webp',
    };
    const { agent } = await getNewUser(superAgent);
    return postMeme(agent, details)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          'Invalid mimetype. Only the following are accepted: image/jpeg, image/png, image/gif, image/svg+xml',
        );
      });
  });

  it('/meme (POST) throws multiple files', async () => {
    const { agent } = await getNewUser(superAgent);
    return postMeme(agent)
      .attach('file', 'test/fixtures/avatar.png')
      .expect(400);
  });

  it('/meme/:id/comment (POST) posts comment on meme', async () => {
    const { agent } = await getNewUser(superAgent);
    return postMeme(agent)
      .expect(201)
      .then((_res) => {
        const { body } = _res;
        return postComment(agent, {
          memeId: body.id,
          body: 'Dope meme bruh',
        }).expect(201);
      });
  });

  it('/meme/:id/comment (POST) posts comment and replies', async () => {
    const { agent } = await getNewUser(superAgent);
    return postMeme(agent)
      .expect(201)
      .then((res) => {
        const { body } = res;
        return postComment(agent, {
          memeId: body.id,
          body: 'check it out yuh',
        }).then((res) => {
          return postComment(agent, {
            memeId: body.id,
            body: 'reply to your dank meme comment',
            parentCommentId: res.body.id,
          }).then((res) => console.log(res.body));
        });
      });
  });

  it('/competition (POST)', async () => {
    const user = await getNewUser(superAgent);
    await postCompetition(user.agent, user.wallet).expect(201);
  });

  it('/competition (GET)', async () => {
    const { agent, wallet } = await getNewUser(superAgent);
    const details = {
      name: 'Cool Competition',
      description: 'Checkout this sick competition',
      maxUserSubmissions: 1,
      endsAt: new Date(),
    };
    await postCompetition(agent, wallet, details);
    return agent
      .get('/competition')
      .expect(200)
      .expect((res) => {
        const { body } = res;
        expect(body.length).toBeGreaterThan(0);

        const competition = body[0];
        const curators = competition.curators;

        expect(curators.length).toEqual(1);
        expect(curators[0].address).toEqual(wallet.address);
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

  afterAll(async () => {
    await app.close();
  });
});
