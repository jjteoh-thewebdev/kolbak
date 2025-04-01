import { Module } from '@nestjs/common';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { API_KEYS_SERVICE_TOKEN } from './api-keys.constants';

@Module({
    imports: [],
    controllers: [ApiKeysController],
    providers: [
        {
            provide: API_KEYS_SERVICE_TOKEN,
            useClass: ApiKeysService,
        },
    ],
})
export class ApiKeysModule { } 