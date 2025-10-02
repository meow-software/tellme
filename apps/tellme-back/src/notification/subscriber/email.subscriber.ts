import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { EB, EVENT_BUS, type IEventBus } from '@tellme/common';

@Injectable()
export class EmailSubscriber implements OnModuleInit {
  private readonly logger = new Logger(EmailSubscriber.name);
  constructor(
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
    private readonly notificationService: NotificationService,
  ) {
  }

  onModuleInit() {
    this.eventBus.subscribe(EB.CHANNEL.EMAIL, async (message) => {
      const { type, data } = message;
      if (type === EB.EMAIL_AUTH.CONFIRM_EMAIL) {
        await this.notificationService.sendConfirmEmail(data);
      }
    });
    this.eventBus.subscribe(EB.CHANNEL.EMAIL, async (message) => {
      const { type, data } = message;
      if (type === EB.EMAIL_AUTH.RESET_PASSWORD) {
        await this.notificationService.sendConfirmEmail(data);
      }
    }); 
    // faire email confirmed, password edited
  }
}
