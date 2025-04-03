import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from './dto/auth.request.dto';
import { TenantRepository } from '@metadata-db/metadata-db';
import { AuthResponse } from './dto/auth.response.dto';
import { decrypt } from '@utilities/utilities';
import { ConfigService } from '@nestjs/config';

export interface IAuthService {
    authenticate(authRequest: AuthRequestDto): Promise<AuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _tenantRepository: TenantRepository,
        private readonly _configService: ConfigService,
    ) { }

    async authenticate(authRequest: AuthRequestDto) {
        const tenant = await this._tenantRepository.findOneWithId(authRequest.clientId);
        const systemSecretKey = this._configService.getOrThrow('SECRET_KEY');

        // compare hashed secret
        if (!tenant || (await decrypt(tenant.secret, systemSecretKey)) !== authRequest.clientSecret) {
            throw new UnauthorizedException('Invalid client credentials');
        }

        const payload = {
            sub: tenant.id,
            tenantId: tenant.id,
        };

        return {
            accessToken: this._jwtService.sign(payload),
            tokenType: 'Bearer',
            expiresIn: 3600,
        };
    }
} 