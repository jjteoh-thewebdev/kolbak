import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MetadataDbModule } from '@metadata-db/metadata-db';
import { AUTH_SERVICE_TOKEN } from './auth.constants';

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [{ provide: AUTH_SERVICE_TOKEN, useClass: AuthService }],
})
export class AuthModule { }