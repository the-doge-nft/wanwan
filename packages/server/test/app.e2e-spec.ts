import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const getNonceReq = () => {
    return request(app.getHttpServer()).get('/auth/nonce').expect(200);
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
    const message = new SiweMessage({
      domain: 'test',
      uri: 'test',
      version: '1',
      chainId: 1,
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
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
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
      request(app.getHttpServer())
        .post('/auth/verify')
        .send({ message, signature })
        .expect(200);
      console.log(message, signature);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
