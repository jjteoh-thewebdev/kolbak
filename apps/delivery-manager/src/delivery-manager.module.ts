import { Module } from '@nestjs/common';
import { DeliveryManagerController } from './delivery-manager.controller';
import { DeliveryManagerService } from './delivery-manager.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MetadataDbModule } from '@metadata-db/metadata-db';
import { DELIVERY_MANAGER_SERVICE_TOKEN } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`./apps/delivery-manager/.env`],
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
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_DELEGATE_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'delivery-manager',
              brokers: configService.get('KAFKA_BROKERS').split(','),
            },
            producer: {
              // Enable idempotence for exactly-once delivery
              // Prevent duplicate messages
              idempotent: true,
              // Enable transactions if needed
              transactionalId: 'delivery-manager-tx',
              allowAutoTopicCreation: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DeliveryManagerController],
  providers: [{
    provide: DELIVERY_MANAGER_SERVICE_TOKEN,
    useClass: DeliveryManagerService,
  }],
})
export class DeliveryManagerModule { }
