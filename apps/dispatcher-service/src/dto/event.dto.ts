import { IsDateString, IsObject, IsString } from "class-validator";

export class EventDto {
    @IsString()
    id: string;

    @IsString()
    webhook_id: string;

    @IsString()
    event: string;

    @IsObject()
    payload: Record<string, any>;

    @IsDateString()
    published_at: Date;
}