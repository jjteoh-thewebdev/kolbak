import { Injectable } from "@nestjs/common";
import { EventDto } from "./dto/event.dto";
import { TenantRepository, WebhookRepository } from "@metadata-db/metadata-db";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import { decrypt, encrypt, signPaylaod } from "@utilities/utilities";
import { ulid } from "ulid";
import { nanoid } from "nanoid";

export interface IDispatcherService {
    dispatchEvent(event: EventDto): Promise<void>;
}

@Injectable()
export class DispatcherService implements IDispatcherService {
    constructor(
        private readonly _webhookRepository: WebhookRepository,
        private readonly _tenantRepository: TenantRepository,
        private readonly _configService: ConfigService,
        private readonly _httpService: HttpService,
    ) { }

    // dispatch event to webhook subscribers
    async dispatchEvent(event: EventDto) {
        try {
            const webhook = await this._webhookRepository.findOne({
                where: {
                    id: event.webhook_id,
                },
            });

            if (!webhook) {
                throw new Error(`Webhook not found: ${event.webhook_id}`);
            }

            // parse to payload
            const payload = {
                // unique message id
                id: `${ulid()}-${nanoid(16)}`,
                event: event.event,
                reference_id: event.id, // refer back to the event that emitted this webhook
                webhook_id: event.webhook_id,
                data: event.payload,
                published_at: new Date().toISOString(),
            }


            // decrypt tenant's secret key with system secret key
            const secretKey = await this._getTenantSecretKey(webhook.tenantId);
            const sign = signPaylaod(payload, secretKey);

            await firstValueFrom(
                // inject sign in header as x-signature
                this._httpService.post(webhook.callbackUrl, payload, {
                    headers: {
                        'x-signature': sign,
                    },
                })
            );

            // TODO: update delivery status to delivered


        } catch (error) {
            // TODO: update delivery status to failed
            console.log(`failed`, error)

            // TODO: implement retry logic
        }
    }

    private async _getTenantSecretKey(tenantId: string): Promise<string> {
        const tenant = await this._tenantRepository.findOneWithId(tenantId);
        const systemSecretKey = this._configService.getOrThrow('SECRET_KEY');

        // decrypt tenant's secret key with system secret key
        return decrypt(tenant.secret, systemSecretKey);
    }

}