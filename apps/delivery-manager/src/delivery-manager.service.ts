import { WebhookRepository } from '@metadata-db/metadata-db';
import { Inject, Injectable } from '@nestjs/common';
import { IngressEventDto } from './dto/ingress-event.dto';
import { ClientKafka } from '@nestjs/microservices';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { timeout } from 'rxjs';

export interface IDeliveryManagerService {
  delegateEvent(dto: IngressEventDto): Promise<void>;
}

@Injectable()
export class DeliveryManagerService implements IDeliveryManagerService {
  constructor(
    private readonly _webhookRepository: WebhookRepository,
    @Inject(`KAFKA_DELEGATE_SERVICE`) private readonly _kafkaClient: ClientKafka,
  ) { }

  async delegateEvent(dto: IngressEventDto) {
    // get webhooks that subscribe to the event
    const webhooks = await this._webhookRepository.findByEvent(dto.event);

    // for each webhook, create new event with the webhook id and payload
    // and publish to kafka
    for (const webhook of webhooks) {
      const event = new WebhookEventDto(dto.id, webhook.id, dto.event, dto.payload, dto.published_at);
      this._kafkaClient.emit(`webhook.dispatch`, {
        key: webhook.id, // ensure messages for same webhook are sent to same partition, for enforce message order
        value: JSON.stringify(event),
        headers: {
          timestamp: new Date().toISOString()
        }
      }).pipe(timeout(5000));
    }
  }
}
