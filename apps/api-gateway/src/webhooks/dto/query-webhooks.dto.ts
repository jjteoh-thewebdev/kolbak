import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryWebhooksDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    ids?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    events?: string[];

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;


    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    perPage?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;
} 