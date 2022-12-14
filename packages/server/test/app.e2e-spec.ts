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
  let agent: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(getExpressRedisSession(app));
    await app.init();
    server = app.getHttpServer();
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

  it('/post (POST)', async () => {
    const { wallet } = await getNewUser();
    return agent.post('/upload').attach('file', 'test/fixtures/avatar.png');
  });

  afterAll(async () => {
    await app.close();
  });
});
