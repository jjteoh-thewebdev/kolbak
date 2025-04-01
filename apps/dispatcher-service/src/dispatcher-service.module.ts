import { Module } from '@nestjs/common';
import { DispatcherServiceController } from './dispatcher-service.controller';
import { DispatcherServiceService } from './dispatcher-service.service';

@Module({
  imports: [],
  controllers: [DispatcherServiceController],
  providers: [DispatcherServiceService],
})
export class DispatcherServiceModule {}
