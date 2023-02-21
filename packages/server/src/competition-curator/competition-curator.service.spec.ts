import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionCuratorService } from './competition-curator.service';

describe('CompetitionCuratorService', () => {
  let service: CompetitionCuratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionCuratorService],
    }).compile();

    service = module.get<CompetitionCuratorService>(CompetitionCuratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
