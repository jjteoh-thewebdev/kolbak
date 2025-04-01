import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WEBHOOKS_SERVICE_TOKEN } from './webhooks.constants';
import { JWTorAPIKeyAuthGuard } from '../auth/guards/jwt-or-api-key-auth.guard';

@Module({
    imports: [],
    controllers: [WebhooksController],
    providers: [
        {
            provide: WEBHOOKS_SERVICE_TOKEN,
            useClass: WebhooksService,
        },
        JWTorAPIKeyAuthGuard,
    ],
})
export class WebhooksModule { } 