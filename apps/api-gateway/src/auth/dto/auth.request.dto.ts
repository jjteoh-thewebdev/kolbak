import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AuthRequestDto {
    @IsEnum(['client_credentials'])
    grantType: 'client_credentials';

    @IsString()
    @IsNotEmpty()
    clientId: string;

    @IsString()
    @IsNotEmpty()
    clientSecret: string;
} 