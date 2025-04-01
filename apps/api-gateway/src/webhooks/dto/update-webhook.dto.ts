import { IsString, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWebhookDto {
    @IsString()
    @IsOptional()
    event?: string;

    @IsUrl({
        require_tld: false, // allow localhost
    })
    @IsOptional()
    callbackUrl?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
} 