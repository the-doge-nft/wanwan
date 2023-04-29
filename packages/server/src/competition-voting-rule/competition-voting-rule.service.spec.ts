import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionVotingRuleService } from './competition-voting-rule.service';

describe('CompetitionVotingRuleService', () => {
  let service: CompetitionVotingRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionVotingRuleService],
    }).compile();

    service = module.get<CompetitionVotingRuleService>(CompetitionVotingRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
