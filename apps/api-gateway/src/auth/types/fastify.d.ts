import { FastifyRequest as OriginalFastifyRequest } from 'fastify';

// custom type for verified user
// inject user object into request
declare module 'fastify' {
    export interface FastifyRequest extends OriginalFastifyRequest {
        user?: {
            id: string;
            tenantId: string;
            // [key: string]: any;
        };
    }
} 