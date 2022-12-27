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

  getAuthNonce() {
    return this.agent.get('/auth/nonce');
  }

  get address() {
    return this.wallet.address;
  }

  auth(): any {
    return this.getAuthNonce()
      .expect(200)
      .then((res) => {
        return this.getSiweMessage({
          statement: 'Sign in with Ethereum',
          nonce: res.body.nonce,
        }).then(({ message, signature }) => {
          return this.agent.post('/auth/login').send({ message, signature });
        });
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

  getCompetition() {
    return this.agent.get('/competition');
  }

  postMeme(
    params: { name: string; description: string; pathToFile: string } = {
      name: 'test',
      description: 'test',
      pathToFile: 'test/fixtures/avatar.png',
    },
  ) {
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

  getUser() {
    return this.agent.get('/user');
  }

  static async createAuthed(server) {
    const user = new this(server);
    await user.auth();
    return user;
  }
}
