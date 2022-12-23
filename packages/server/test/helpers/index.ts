import { TestingModule } from '@nestjs/testing';
import { ethers, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import { SuperAgentTest } from 'supertest';
import { S3Service } from '../../src/s3/s3.service';

export const getNonceReq = (agent: SuperAgentTest) => {
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

//@next type annotations for return
export const getNewUser = (agent: SuperAgentTest): any => {
  return getNonceReq(agent).then(async ({ body: { nonce } }) => {
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
        return { agent: agent, wallet };
      });
  });
};

export const mockS3PutObject = (testingModule: TestingModule) => {
  const s3Service = testingModule.get<S3Service>(S3Service);
  jest.spyOn(s3Service, 'putObject').mockImplementation(async () => ({
    ETag: '1b2cf535f27731c974343645a3985328',
    $metadata: { httpStatusCode: 200 },
  }));
};

//@next type annotations for return
export const postCompetition = (
  agent: SuperAgentTest,
  wallet: Wallet,
  {
    name = 'A Brand New Compeition',
    description = 'Test this out',
    maxUserSubmissions = 1,
    endsAt = new Date(),
  } = {},
): any => {
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

export const postMeme = (
  agent: SuperAgentTest,
  {
    name = 'Sick meme',
    description = 'Check it out',
    pathToImage = 'test/fixtures/avatar.png',
  } = {},
) => {
  return agent
    .post('/meme')
    .field('name', name)
    .field('description', description)
    .attach('file', pathToImage);
};

export const postComment = (
  agent: SuperAgentTest,
  { body = 'Nice dank meme', memeId = 0, parentCommentId = undefined } = {},
) => {
  return agent
    .post(`/meme/${memeId}/comment`)
    .send({ body, parentCommentId })
    .expect((res) => {
      const { body: commentBody } = res;
      expect(commentBody.body).toEqual(body);
      expect(commentBody.memeId).toEqual(memeId);
      if (parentCommentId) {
        expect(commentBody.parentCommentId).toEqual(parentCommentId);
      }
    });
};
