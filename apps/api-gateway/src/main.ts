import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnakeCaseInterceptor } from './interceptors/snake-case.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import fastifyHelmet from '@fastify/helmet';
import * as qs from 'qs';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiGatewayModule,
    new FastifyAdapter({
      // custom querystring parser, to parse arrays(e.g. ids[]=1&ids[]=2, which works fine with Express but not Fastify)
      querystringParser: (str) => qs.parse(str)
    })
  );

  await app.register(fastifyHelmet)

  app.setGlobalPrefix(`api`);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // useContainer(app.select(ApiGatewayModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new SnakeCaseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', '3001');

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
}
bootstrap();
