import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { MetadataDbModule } from '@metadata-db/metadata-db';
import { WEBHOOKS_SERVICE_TOKEN } from './webhooks.constants';

@Module({
    imports: [],
    controllers: [WebhooksController],
    providers: [
        {
            provide: WEBHOOKS_SERVICE_TOKEN,
            useClass: WebhooksService,
        },
    ],
})
export class WebhooksModule { } 