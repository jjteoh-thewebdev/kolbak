import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from './dto/auth.request.dto';
import { TenantRepository } from '@metadata-db/metadata-db';
import { AuthResponse } from './dto/auth.response.dto';
import * as bcrypt from 'bcrypt';

export interface IAuthService {
    authenticate(authRequest: AuthRequestDto): Promise<AuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tenantRepository: TenantRepository,
    ) { }

    async authenticate(authRequest: AuthRequestDto) {
        const tenant = await this.tenantRepository.findOneWithId(authRequest.clientId);

        // compare hashed secret
        if (!tenant || !(await bcrypt.compare(authRequest.clientSecret, tenant.secret))) {
            throw new UnauthorizedException('Invalid client credentials');
        }

        const payload = {
            sub: tenant.id,
            tenantId: tenant.id,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            tokenType: 'Bearer',
            expiresIn: 3600,
        };
    }
} 