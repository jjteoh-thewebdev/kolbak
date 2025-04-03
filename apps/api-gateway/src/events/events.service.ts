import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthUser } from '../types/user';
import { ulid } from 'ulid';
import { nanoid } from 'nanoid';
import { ClientKafka } from '@nestjs/microservices';
import { timeout } from 'rxjs';

export interface IEventsService {
    create(createEventDto: CreateEventDto, user: AuthUser): Promise<any>;
}

@Injectable()
export class EventsService implements IEventsService, OnModuleInit, OnApplicationShutdown {
    constructor(
        @Inject('KAFKA_EVENTS_SERVICE')
        private readonly _kafkaProducer: ClientKafka,
    ) { }

    async onApplicationShutdown() {
        await this._kafkaProducer.close();
        console.log('Kafka client closed');
    }

    async onModuleInit() {
        await this._kafkaProducer.connect();
        console.log('Kafka client connected');
    }

    async create(createEventDto: CreateEventDto, user: AuthUser) {
        try {
            createEventDto.id = createEventDto.id || `${ulid()}-${nanoid(16)}`;

            // TODO: log the producer
            console.log(`Received event from ${user.tenantId}, dto: ${JSON.stringify(createEventDto)}`);

            const event = {
                ...createEventDto,
                published_at: new Date().toISOString(),
            };

            // Publish to Kafka
            await this._kafkaProducer.emit(`event.ingress`, {
                key: createEventDto.id,
                value: JSON.stringify(event),
                headers: {
                    timestamp: event.published_at
                }
            }).pipe(timeout(5000))

            return {
                data: {
                    id: createEventDto.id,
                    message: 'Event accepted for processing.',
                },
                error: null,
                pagination: null,
            };
        } catch (error) {
            console.error(`kafka error`, error);

            // TODO: maybe can throw a custom error
        }

    }
}
