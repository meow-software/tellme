import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventBusModule } from '@tellme/common';
import { EmailModule } from 'src/email/email.module';
import { EmailSubscriber } from './subscriber/email.subscriber';

@Module({
  imports: [EventBusModule, EmailModule],
  providers: [NotificationService, EmailSubscriber]
})
export class NotificationModule {}
