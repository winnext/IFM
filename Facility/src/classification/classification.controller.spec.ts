import { Test, TestingModule } from '@nestjs/testing';
import { ClassificationController } from './classification.controller';
import { ClassificationService } from './classification.service';

describe('ClassificationController', () => {
  let controller: ClassificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassificationController],
      providers: [ClassificationService],
    }).compile();

    controller = module.get<ClassificationController>(ClassificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
