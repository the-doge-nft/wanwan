import { Test, TestingModule } from '@nestjs/testing';
import { Search } from './search';

describe('Search', () => {
  let provider: Search;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Search],
    }).compile();

    provider = module.get<Search>(Search);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
