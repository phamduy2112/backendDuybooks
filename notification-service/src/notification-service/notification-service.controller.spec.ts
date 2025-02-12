import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let controller: NotificationServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationServiceController],
      providers: [NotificationServiceService],
    }).compile();

    controller = module.get<NotificationServiceController>(NotificationServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
