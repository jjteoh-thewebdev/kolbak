import { MetadataDbModule } from '@metadata-db/metadata-db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import * as path from 'path';

console.log(path.resolve(__dirname, '../.env.api-gateway'))

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`./apps/api-gateway/.env`],
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
  controllers: [ApiGatewayController],
})
export class ApiGatewayModule { }
