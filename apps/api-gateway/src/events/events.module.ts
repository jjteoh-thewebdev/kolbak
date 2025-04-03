import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EVENTS_SERVICE_TOKEN } from './events.constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_EVENTS_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: configService.getOrThrow('KAFKA_CLIENT_ID'),
                            brokers: configService.getOrThrow<string>('KAFKA_BROKERS').split(','),
                            retry: {
                                // retries: 10,
                                factor: 2,
                                initialRetryTime: 1000,
                                minTimeout: 1000,
                                maxTimeout: 10000,
                            }
                        },
                        consumer: {
                            groupId: configService.getOrThrow('KAFKA_CONSUMER_GROUP_ID'),
                        },
                        producer: {
                            allowAutoTopicCreation: true,
                            idempotent: true
                        }
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [EventsController],
    providers: [
        {
            provide: EVENTS_SERVICE_TOKEN,
            useClass: EventsService,
        },
    ],
})
export class EventsModule { }