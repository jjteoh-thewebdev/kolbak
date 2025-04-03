import { IsString, IsOptional, IsObject, Matches } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    event: string;

    @IsObject()
    payload: Record<string, any>;
} 