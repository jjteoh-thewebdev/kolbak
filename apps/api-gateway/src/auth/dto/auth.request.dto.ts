import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AuthRequestDto {
    @IsEnum(['client_credentials'])
    grant_type: 'client_credentials';

    @IsString()
    @IsNotEmpty()
    client_id: string;

    @IsString()
    @IsNotEmpty()
    client_secret: string;
} 