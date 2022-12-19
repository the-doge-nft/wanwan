import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers, Wallet } from 'ethers';
import { S3Service } from './../src/s3/s3.service';

import { SiweMessage } from 'siwe';
import * as superRequest from 'supertest';
import { AppModule } from './../src/app.module';
import { getExpressRedisSession } from './../src/middleware/session';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let agent: any;
  let s3Service: S3Service;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    s3Service = moduleFixture.get<S3Service>(S3Service);

    app = moduleFixture.createNestApplication();

    // grab our middleware
    app.use(getExpressRedisSession(app));
    await app.init();
    server = app.getHttpServer();

    // grab a superagent
    agent = superRequest.agent(server);
  });

  const getNonceReq = () => {
    return agent.get('/auth/nonce').expect(200);
  };

  const getWallet = (): ethers.Wallet => {
    return ethers.Wallet.createRandom();
  };

  const getSiweMessage = async ({
    wallet,
    statement,
    nonce,
  }: {
    wallet: Wallet;
    statement: string;
    nonce: string;
  }) => {
    const address = wallet.address;
    const uri = 'http://secretmemeproject.com';
    const domain = 'secretmemeproject.com';
    const message = new SiweMessage({
      version: '1',
      chainId: 1,
      domain,
      uri,
      address,
      statement,
      nonce,
    });
    const preparedMessage = message.prepareMessage();
    const signature = await wallet.signMessage(preparedMessage);
    return {
      signature,
      message: preparedMessage,
    };
  };

  const getNewUser = () => {
    return getNonceReq().then(async ({ body: { nonce } }) => {
      const wallet = getWallet();
      const { message, signature } = await getSiweMessage({
        wallet,
        statement: 'Sign in with Ethereum',
        nonce,
      });
      return agent
        .post('/auth/verify')
        .send({ message, signature })
        .expect(201)
        .then((res) => {
          return { res, wallet };
        });
    });
  };

  const mockS3PutObject = () => {
    jest.spyOn(s3Service, 'putObject').mockImplementationOnce(async () => ({
      ETag: '1b2cf535f27731c974343645a3985328',
      $metadata: { httpStatusCode: 200 },
    }));
  };

  const postCompetition = async (
    wallet: Wallet,
    {
      name = 'A Brand New Compeition',
      description = 'Test this out',
      maxUserSubmissions = 1,
      endsAt = new Date(),
    } = {},
  ) => {
    return agent
      .post('/competition')
      .send({
        name,
        description,
        maxUserSubmissions,
        endsAt,
        curators: [wallet.address],
      })
      .expect((res) => {
        const { body } = res;
        expect(body.name).toEqual(name);
        expect(body.description).toEqual(description);
        expect(body.maxUserSubmissions).toEqual(maxUserSubmissions);
        expect(body.endsAt).toEqual(endsAt.toISOString());
      });
  };

  const postMeme = ({
    name = 'Sick meme',
    description = 'Check it out',
    pathToImage = 'test/fixtures/avatar.png',
  } = {}) => {
    return agent
      .post('/meme')
      .field('name', name)
      .field('description', description)
      .attach('file', pathToImage);
  };

  // it('/ (GET)', () => {
  //   return agent.get('/').expect(200).expect('Hello World!');
  // });

  // it('/auth/nonce (GET)', () => {
  //   return getNonceReq().expect((res) => {
  //     expect(res.body.nonce).toBeDefined();
  //   });
  // });

  // it('/auth/verify (POST)', () => {
  //   return getNewUser();
  // });

  // it('/user (GET)', async () => {
  //   const { wallet } = await getNewUser();
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
  //   await getNewUser();
  //   mockS3PutObject();
  //   return postMeme(details)
  //     .expect(201)
  //     .expect((res) => {
  //       const { body } = res;
  //       expect(body.name).toEqual(details.name);
  //       expect(body.description).toEqual(details.description);
  //     });
  // });

  // it('/meme (POST) not authenticated', async () => {
  //   return postMeme().expect(401);
  // });

  // it('/meme (POST) throws invalid mimetype', async () => {
  //   const details = {
  //     name: 'FAILURE',
  //     description: 'this should be rejected',
  //     pathToImage: 'test/fixtures/house.webp',
  //   };
  //   await getNewUser();
  //   mockS3PutObject();
  //   return postMeme(details)
  //     .expect(400)
  //     .expect((res) => {
  //       expect(res.body.message).toEqual(
  //         'Invalid mimetype. Only the following are accepted: image/jpeg, image/png, image/gif, image/svg+xml',
  //       );
  //     });
  // });

  // it('/meme (POST) throws multiple files', async () => {
  //   await getNewUser();
  //   mockS3PutObject();
  //   return postMeme().attach('file', 'test/fixtures/avatar.png').expect(400);
  // });

  it('/meme/:id/comment (POST) posts comment on meme', async () => {
    await getNewUser();
    mockS3PutObject();
    return postMeme()
      .expect(201)
      .then((_res) => {
        const { body } = _res;
        console.log('got body from posted meme', body);
        return agent
          .post(`/meme/${body.id}/comment`)
          .send({ body: 'Check out my comment yo' })
          .expect(201)
          .expect((res) => {
            const { body: commentBody } = res;
            return console.log('got comment body', commentBody);
          });
      });
  });

  // it('/competition (POST)', async () => {
  //   const { wallet } = await getNewUser();
  //   await postCompetition(wallet);
  // });

  // it('/competition (GET)', async () => {
  //   const { wallet } = await getNewUser();
  //   const details = {
  //     name: 'Cool Competition',
  //     description: 'Checkout this sick competition',
  //     maxUserSubmissions: 1,
  //     endsAt: new Date(),
  //   };
  //   await postCompetition(wallet, details);
  //   return agent
  //     .get('/competition')
  //     .expect(200)
  //     .expect((res) => {
  //       const { body } = res;
  //       expect(body.length).toBeGreaterThan(0);

  //       const competition = body[0];
  //       const curators = competition.curators;

  //       expect(curators.length).toEqual(1);
  //       expect(curators[0].address).toEqual(wallet.address);
  //       expect(curators[0].isSuperAdmin).toEqual(false);
  //       expect(curators[0].isVerified).toEqual(false);

  //       expect(competition.name).toEqual(details.name);
  //       expect(competition.description).toEqual(details.description);
  //       expect(competition.maxUserSubmissions).toEqual(
  //         details.maxUserSubmissions,
  //       );
  //       expect(competition.endsAt).toEqual(details.endsAt.toISOString());
  //     });
  // });

  afterAll(async () => {
    await app.close();
  });
});
