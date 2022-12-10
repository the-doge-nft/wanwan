import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers, Wallet } from 'ethers';

import { SiweMessage } from 'siwe';
import * as superRequest from 'supertest';
import { AppModule } from './../src/app.module';
import { getExpressRedisSession } from './../src/middleware/session';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let request: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(getExpressRedisSession(app));
    await app.init();
    server = app.getHttpServer();
    // agent will persist sessions for us
    request = superRequest.agent(server);
  });

  const getNonceReq = () => {
    return request.get('/auth/nonce').expect(200);
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

  it('/ (GET)', () => {
    return request.get('/').expect(200).expect('Hello World!');
  });

  it('/auth/nonce (GET)', () => {
    return getNonceReq().expect((res) => {
      expect(res.body.nonce).toBeDefined();
    });
  });

  it('/auth/verify (POST)', () => {
    return getNonceReq().then(async ({ body: { nonce } }) => {
      const wallet = getWallet();
      const { message, signature } = await getSiweMessage({
        wallet,
        statement: 'Sign in with Ethereum',
        nonce,
      });
      return request
        .post('/auth/verify')
        .send({ message, signature })
        .expect(201);
    });
  });

  it('tests authentication', () => {
    return getNonceReq().then(async ({ body: { nonce } }) => {
      const wallet = getWallet();
      const { message, signature } = await getSiweMessage({
        wallet,
        statement: 'Sign in with Ethereum',
        nonce,
      });
      request.post('/auth/verify').send({ message, signature }).expect(201);
      return request.get('/test').expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
