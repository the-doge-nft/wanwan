import { ethers, Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import CommentDto from 'src/dto/comment.dto';
import SubmissionDto from 'src/dto/submission.dto';
import VoteDto from 'src/dto/vote.dto';
import * as superRequest from 'supertest';
import { CompetitionDto } from '../../src/dto/competition.dto';
import { MemeDto } from '../../src/dto/meme.dto';

export default class TestUser {
  private readonly wallet: Wallet;
  private agent: superRequest.SuperAgentTest;

  static async createAuthed(server) {
    const user = new this(server);
    await user.auth();
    return user;
  }

  static createUnauthed(server) {
    return new this(server);
  }

  private constructor(server: any) {
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

  logout() {
    return this.agent.get('/auth/logout');
  }

  postCompetition(params: CompetitionDto) {
    return this.agent.post('/competition').send(params);
  }

  getCompetition() {
    return this.agent.get('/competition');
  }

  postMeme(
    params: MemeDto & { pathToFile: string } = {
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
    { memeId, body, parentCommentId }: CommentDto & { memeId: number } = {
      body: 'Sick',
      memeId: 0,
    },
  ) {
    return this.agent
      .post(`/meme/${memeId}/comment`)
      .send({ body, parentCommentId });
  }

  postSubmission(args: SubmissionDto) {
    return this.agent.post('/submission').send(args);
  }

  getCompetitionMemes(id: number) {
    return this.agent.get(`/competition/${id}/meme`);
  }

  getUser() {
    return this.agent.get('/user');
  }

  postVote({
    competitionId,
    memeId,
    score,
  }: VoteDto & { competitionId: number }) {
    return this.agent
      .post(`/competition/${competitionId}`)
      .send({ memeId, score });
  }
}
