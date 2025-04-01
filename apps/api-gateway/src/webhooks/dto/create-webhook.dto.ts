import { IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class CreateWebhookDto {
    @IsString()
    event: string;

    @IsUrl({
        require_tld: false,
    })
    callbackUrl: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 