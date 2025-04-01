import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ApiKeyRepository } from '@metadata-db/metadata-db';

@Injectable()
export class JWTorAPIKeyAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private apiKeyRepository: ApiKeyRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        // Try JWT authentication first
        const jwtToken = this.extractJwtToken(request);
        if (jwtToken) {
            try {
                const payload = await this.jwtService.verifyAsync(jwtToken);
                request.user = payload;
                return true;
            } catch {
                return false;
            }
        }

        // Try API key authentication
        const apiKey = this.extractApiKey(request);
        if (apiKey) {
            const key = await this.apiKeyRepository.findOneWithId(apiKey);
            if (key) {
                request.user = {
                    tenantId: key.tenantId,
                    id: key.id,
                };

                // update last used at
                await this.apiKeyRepository.update(key.id, { lastAccessedAt: new Date() });

                return true;
            }
        }

        // If no authentication is provided, throw an error
        throw new UnauthorizedException('Invalid authentication credentials');
    }

    private extractJwtToken(request: FastifyRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractApiKey(request: FastifyRequest): string | undefined {
        return request.headers['x-api-key'] as string | undefined;
    }
} 