import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { decrypt, encrypt } from "@utilities/utilities";

@Controller()
export class ApiGatewayController {
    constructor(
        private readonly _configService: ConfigService,
    ) { }

    @Get()
    getHello(): string {
        return "Hello World";
    }

    // non-production endpoint, for testing purposes
    @HttpCode(HttpStatus.OK)
    @Post()
    dummy(@Body() dto: any) {
        console.log(dto);

        return {
            success: true,
        }
    }

    // non-production endpoint, for testing purposes
    @Post(`/encrypt`)
    encryptKey(@Body(`key`) key: string) {
        const systemSecretKey = this._configService.getOrThrow('SECRET_KEY');
        return encrypt(key, systemSecretKey);
    }

    // non-production endpoint, for testing purposes
    @Post(`/decrypt`)
    decryptKey(@Body(`key`) key: string) {
        const systemSecretKey = this._configService.getOrThrow('SECRET_KEY');
        return decrypt(key, systemSecretKey);
    }
}