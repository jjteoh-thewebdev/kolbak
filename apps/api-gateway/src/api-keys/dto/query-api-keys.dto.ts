import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryApiKeysDto {
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.split(','))
    ids?: string[];

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.split(','))
    scopes?: string[];
} 