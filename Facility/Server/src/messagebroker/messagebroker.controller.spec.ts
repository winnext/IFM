import { Test, TestingModule } from '@nestjs/testing';
import { MessagebrokerController } from './messagebroker.controller';

describe('MessagebrokerController', () => {
  let controller: MessagebrokerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagebrokerController],
    }).compile();

    controller = module.get<MessagebrokerController>(MessagebrokerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
