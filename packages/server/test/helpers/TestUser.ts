import { ethers, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import * as superRequest from 'supertest';

export default class TestUser {
  private readonly wallet: Wallet;
  private agent: superRequest.SuperAgentTest;

  constructor(server: any) {
    this.agent = superRequest.agent(server);
    this.wallet = ethers.Wallet.createRandom();
  }

  private async getSiweMessage({
    statement,
    nonce,
  }: {
    statement: string;
    nonce: string;
  }) {
    const uri = 'http://secretmemeproject.com';
    const domain = 'secretmemeproject.com';
    const message = new SiweMessage({
      version: '1',
      chainId: 1,
      domain,
      uri,
      address: this.wallet.address,
      statement,
      nonce,
    });
    const preparedMessage = message.prepareMessage();
    const signature = await this.wallet.signMessage(preparedMessage);
    return {
      signature,
      message: preparedMessage,
    };
  }

  private getNonceReq() {
    return this.agent.get('/auth/nonce');
  }

  get address() {
    return this.wallet.address;
  }

  auth(): any {
    return this.getNonceReq().then(async (res) => {
      expect(res.status).toEqual(200);
      const {
        body: { nonce },
      } = res;
      const { message, signature } = await this.getSiweMessage({
        statement: 'Sign in with Ethereum',
        nonce,
      });
      return this.agent
        .post('/auth/verify')
        .send({ message, signature })
        .expect(201);
    });
  }

  postCompetition(params: {
    name: string;
    description: string;
    endsAt: Date;
    curators: string[];
    maxUserSubmissions: number;
  }) {
    return this.agent.post('/competition').send(params);
  }

  postMeme(params: { name: string; description: string; pathToFile: string }) {
    return this.agent
      .post('/meme')
      .field('name', params.name)
      .field('description', params.description)
      .attach('file', params.pathToFile);
  }

  postComment(
    {
      memeId,
      body,
      parentCommentId,
    }: {
      body: string;
      memeId: number;
      parentCommentId?: number;
    } = { body: 'Sick', memeId: 0 },
  ) {
    return this.agent
      .post(`/meme/${memeId}/comment`)
      .send({ body, parentCommentId });
  }

  postSubmission(args: { memeId: string; competitionId: number }) {
    return this.agent.post('/submission').send(args);
  }

  getCompetitionMemes(id: number) {
    return this.agent.get(`/competition/${id}/meme`);
  }
}
