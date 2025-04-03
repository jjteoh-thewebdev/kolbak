import { NestFactory } from '@nestjs/core';
import { DeliveryManagerModule } from './delivery-manager.module';
import { ConfigService } from '@nestjs/config';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(DeliveryManagerModule,
    {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'delivery-service',
            brokers: configService.getOrThrow('KAFKA_BROKERS').split(','),
            connectionTimeout: 8000,
            retry: {
              initialRetryTime: 300,
              retries: 10,
              maxRetryTime: 30000,
            },
          },
          consumer: {
            groupId: configService.getOrThrow('KAFKA_CONSUMER_GROUP_ID'),
            allowAutoTopicCreation: true,
            sessionTimeout: 30000,
            heartbeatInterval: 3000,
            // retry: {
            //   initialRetryTime: 1000,
            //   retries: 10,
            // },
            // Run in batches for better performance while maintaining order
            // runningInBatchMode: true,
            // maxWaitTimeInMs: 500,
            // maxBatchSize: 100,
          },
          subscribe: {
            topics: ['event.ingress'],
            fromBeginning: true,
          }
        },
      }),
      inject: [ConfigService],
    }
  );

  app.listen()

  console.log('delivery manager started');
}
bootstrap();
