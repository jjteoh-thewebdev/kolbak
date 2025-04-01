import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiGatewayModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix(`api`);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', '3001');

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
bootstrap();
