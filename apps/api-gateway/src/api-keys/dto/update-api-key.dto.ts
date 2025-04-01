import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateApiKeyDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    scopes?: string[];
} 