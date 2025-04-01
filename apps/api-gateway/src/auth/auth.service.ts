import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from './dto/auth.request.dto';
import { TenantRepository } from '@metadata-db/metadata-db';
import { IAuthResponse } from './dto/auth.response.dto';
import * as bcrypt from 'bcrypt';

export interface IAuthService {
    authenticate(authRequest: AuthRequestDto): Promise<IAuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tenantRepository: TenantRepository,
    ) { }

    async authenticate(authRequest: AuthRequestDto) {
        const tenant = await this.tenantRepository.findOneBy({
            id: authRequest.client_id
        });

        // compare hashed secret
        if (!tenant || !(await bcrypt.compare(authRequest.client_secret, tenant.secret))) {
            throw new UnauthorizedException('Invalid client credentials');
        }

        const payload = {
            sub: tenant.id,
            tenantId: tenant.id,
        };

        return {
            access_token: this.jwtService.sign(payload),
            token_type: 'Bearer',
            expires_in: 3600,
        };
    }
} 