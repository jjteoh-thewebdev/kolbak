import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { ConfigModule } from '@nestjs/config';
import { DispatcherController } from './dispatcher.controller';
import { HttpModule } from '@nestjs/axios';
import { MetadataDbModule } from '@metadata-db/metadata-db';
import { DISPATCHER_SERVICE_TOKEN } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`./apps/dispatcher-service/.env`],
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    MetadataDbModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
    }),
  ],
  controllers: [DispatcherController],
  providers: [
    {
      provide: DISPATCHER_SERVICE_TOKEN,
      useClass: DispatcherService,
    },
  ],
})
export class DispatcherServiceModule {}
