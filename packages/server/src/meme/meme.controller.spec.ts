import { Test, TestingModule } from '@nestjs/testing';
import { MemeController } from './meme.controller';

describe('MemeController', () => {
  let controller: MemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemeController],
    }).compile();

    controller = module.get<MemeController>(MemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
