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

  const getWallet = () => {
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

  it('/ (GET)', () => {
    return agent.get('/').expect(200).expect('Hello World!');
  });

  it('/auth/nonce (GET)', () => {
    return getNonceReq().expect((res) => {
      expect(res.body.nonce).toBeDefined();
    });
  });

  it('/auth/verify (POST)', () => {
    return getNewUser();
  });

  it('/user (GET)', async () => {
    const { wallet } = await getNewUser();
    return agent
      .get('/user')
      .expect(200)
      .then((res) => {
        const { user } = res.body;
        expect(wallet.address).toBe(user.address);
      });
  });

  it('/meme (POST)', async () => {
    await getNewUser();
    mockS3PutObject();
    return agent
      .post('/meme')
      .field('name', 'TESS')
      .field('description', 'memesbruh')
      .attach('file', 'test/fixtures/avatar.png')
      .expect(200)
      .expect((res) => {
        console.log(res.body);
      });
  });

  it('/meme (POST) throws invalid mimetype', async () => {
    await getNewUser();
    mockS3PutObject();
    return agent
      .post('/meme')
      .field('name', 'this meme should be rejected')
      .attach('file', 'test/fixtures/house.webp')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          'Invalid mimetype. Only the following are accepted: image/jpeg, image/png, image/gif, image/svg+xml',
        );
      });
  });

  it('/meme (POST) throws multiple files', async () => {
    await getNewUser();
    mockS3PutObject();
    return agent
      .post('/meme')
      .field('name', 'this meme should be rejected')
      .attach('file', 'test/fixtures/avatar.png')
      .attach('file', 'test/fixtures/avatar.png')
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
