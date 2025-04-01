import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MetadataDbModule } from '@metadata-db/metadata-db';
import { AUTH_SERVICE_TOKEN } from './auth.constants';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
        MetadataDbModule.register(),
    ],
    controllers: [AuthController],
    providers: [{ provide: AUTH_SERVICE_TOKEN, useClass: AuthService }],
})
export class AuthModule { }