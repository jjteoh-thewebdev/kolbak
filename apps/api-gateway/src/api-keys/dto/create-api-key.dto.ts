import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateApiKeyDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    scopes: string[];
} 