import { IsString, IsObject, IsDateString } from "class-validator";

export class IngressEventDto {
    @IsString()
    id: string;

    @IsString()
    event: string;

    @IsObject()
    payload: Record<string, any>;

    @IsDateString()
    published_at: Date;
}