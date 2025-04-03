import { IsArray, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { transformToArray } from '@utilities/utilities/parsers';

export class QueryApiKeysDto {
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @Type(() => String)
    ids?: string[];

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @Type(() => String)
    scopes?: string[];

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