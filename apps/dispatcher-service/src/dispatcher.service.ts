import { HttpStatus, Injectable } from "@nestjs/common";
import { EventDto } from "./dto/event.dto";
import { WebhookRepository } from "@metadata-db/metadata-db";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class DispatcherService {
    constructor(
        private readonly _webhookRepository: WebhookRepository,
        private readonly _httpService: HttpService,
    ) { }

    // dispatch event to webhook subscribers
    async dispatchEvent(event: EventDto) {
        const webhook = await this._webhookRepository.findOne({
            where: {
                id: event.webhook_id,
            },
        });

        if (!webhook) {
            throw new Error(`Webhook not found: ${event.webhook_id}`);
        }

        try {
            const response = await firstValueFrom(
                this._httpService.post(webhook.callbackUrl, event.payload)
            );

            // TODO: update delivery status to delivered


        } catch (error) {
            // TODO: update delivery status to failed
            console.log(`failed`)

            // TODO: implement retry logic
        }
    }
}