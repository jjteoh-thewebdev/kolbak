import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiKeyRepository, TenantRepository } from '@metadata-db/metadata-db';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { QueryApiKeysDto } from './dto/query-api-keys.dto';
import { nanoid } from 'nanoid';
import { AuthUser } from '../types/user';

export interface IApiKeysService {
    findOne(id: string, user: AuthUser): Promise<any>;
    findAll(query: QueryApiKeysDto, user: AuthUser): Promise<any>;
    create(createApiKeyDto: CreateApiKeyDto, user: AuthUser): Promise<any>;
    update(id: string, updateApiKeyDto: UpdateApiKeyDto, user: AuthUser): Promise<any>;
    remove(id: string, user: AuthUser): Promise<void>;
}

@Injectable()
export class ApiKeysService implements IApiKeysService {
    constructor(
        private readonly apiKeyRepository: ApiKeyRepository,
    ) { }

    async findOne(id: string, user: AuthUser) {
        const apiKey = await this.apiKeyRepository.findOneWithId(id);

        if (!apiKey) {
            throw new NotFoundException(`API key ${id} not found`);
        }

        // Check if the API key belongs to the user's tenant
        if (apiKey.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to access this API key');
        }

        return {
            data: apiKey,
            error: null,
            pagination: null,
        };
    }

    async findAll(query: QueryApiKeysDto, user: AuthUser) {
        const where: any = {
            tenantId: user.tenantId, // Only return API keys for the user's tenant
        };

        if (query.ids?.length) {
            where.id = query.ids;
        }
        if (query.scopes?.length) {
            where.scopes = query.scopes;
        }

        const [apiKeys, total] = await this.apiKeyRepository.find(where);

        return {
            data: apiKeys ?? [],
            error: null,
            pagination: {
                limit: 20,
                offset: 0,
                total: total ?? 0,
            },
        };
    }

    async create(createApiKeyDto: CreateApiKeyDto, user: AuthUser) {
        const apiKey = await this.apiKeyRepository.create({
            ...createApiKeyDto,
            id: `APIE${nanoid().toUpperCase()}`,
            tenantId: user.tenantId, // Associate the API key with the user's tenant
        });

        await this.apiKeyRepository.save(apiKey);

        return {
            data: apiKey,
            error: null,
            pagination: null,
        };
    }

    async update(id: string, updateApiKeyDto: UpdateApiKeyDto, user: AuthUser) {
        const apiKey = await this.apiKeyRepository.findOneWithId(id);

        if (!apiKey) {
            throw new NotFoundException(`API key ${id} not found`);
        }

        // Check if the API key belongs to the user's tenant
        if (apiKey.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to update this API key');
        }

        const updatedApiKey = await this.apiKeyRepository.update(id, updateApiKeyDto);

        return {
            data: updatedApiKey,
            error: null,
            pagination: null,
        };
    }

    async remove(id: string, user: AuthUser) {
        const apiKey = await this.apiKeyRepository.findOneWithId(id);
        if (!apiKey) {
            throw new NotFoundException(`API key with ID ${id} not found`);
        }

        // Check if the API key belongs to the user's tenant
        if (apiKey.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to delete this API key');
        }

        await this.apiKeyRepository.delete(id);
    }
} 