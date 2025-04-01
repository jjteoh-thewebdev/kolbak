import { NestFactory } from '@nestjs/core';
import { DispatcherServiceModule } from './dispatcher-service.module';

async function bootstrap() {
  const app = await NestFactory.create(DispatcherServiceModule);
  await app.listen(3000);
}
bootstrap();
