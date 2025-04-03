import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { WebhookRepository, TenantRepository } from '@metadata-db/metadata-db';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { QueryWebhooksDto } from './dto/query-webhooks.dto';
import { AuthUser } from '../types/user';
import { ulid } from 'ulid';
import { In } from 'typeorm';


export interface IWebhooksService {
    findOne(id: string, user: AuthUser): Promise<any>;
    findAll(query: QueryWebhooksDto, user: AuthUser): Promise<any>;
    create(createWebhookDto: CreateWebhookDto, user: AuthUser): Promise<any>;
    update(id: string, updateWebhookDto: UpdateWebhookDto, user: AuthUser): Promise<any>;
    remove(id: string, user: AuthUser): Promise<void>;
}

@Injectable()
export class WebhooksService implements IWebhooksService {
    constructor(
        private readonly webhookRepository: WebhookRepository,
        private readonly tenantRepository: TenantRepository,
    ) { }

    async findOne(id: string, user: AuthUser) {
        const webhook = await this.webhookRepository.findOneWithId(id);

        if (!webhook) {
            throw new NotFoundException(`Webhook ${id} not found`);
        }

        // Check if the webhook belongs to the user's tenant
        if (webhook.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to access this webhook');
        }

        return {
            data: webhook,
            error: null,
            pagination: null,
        };
    }

    async findAll(query: QueryWebhooksDto, user: AuthUser) {
        let { perPage: per_page, page } = query;
        per_page = per_page ?? 10;
        page = page ?? 1;

        const where: any = {
            tenantId: user.tenantId, // Only return webhooks for the user's tenant
        };

        if (query.ids?.length) {
            where.id = In(query.ids);
        }
        if (query.events?.length) {
            where.event = In(query.events);
        }
        if (query.isActive !== undefined) {
            where.is_active = query.isActive;
        }

        const [webhooks, total] = await this.webhookRepository.findAndCount({
            where,
            skip: (page - 1) * per_page,
            take: per_page,
        });

        return {
            data: webhooks ?? [],
            error: null,
            pagination: {
                per_page,
                page,
                total: total ?? 0,
            },
        };
    }

    async create(createWebhookDto: CreateWebhookDto, user: AuthUser) {
        const webhook = await this.webhookRepository.create({
            ...createWebhookDto,
            id: `WH${ulid()}`,
            tenantId: user.tenantId,
            isActive: createWebhookDto.isActive ?? true,
        });

        await this.webhookRepository.save(webhook);

        return {
            data: await this.webhookRepository.findOneWithId(webhook.id),
            error: null,
            pagination: null,
        };
    }

    async update(id: string, updateWebhookDto: UpdateWebhookDto, user: AuthUser) {
        const webhook = await this.webhookRepository.findOneWithId(id);

        if (!webhook) {
            throw new NotFoundException(`Webhook ${id} not found`);
        }

        // Check if the webhook belongs to the user's tenant
        if (webhook.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to update this webhook');
        }

        await this.webhookRepository.update(id, updateWebhookDto);

        return {
            data: await this.webhookRepository.findOneWithId(id),
            error: null,
            pagination: null,
        };
    }

    async remove(id: string, user: AuthUser) {
        const webhook = await this.webhookRepository.findOneWithId(id);
        if (!webhook) {
            throw new NotFoundException(`Webhook with ID ${id} not found`);
        }

        // Check if the webhook belongs to the user's tenant
        if (webhook.tenantId !== user.tenantId) {
            throw new ForbiddenException('You do not have permission to delete this webhook');
        }

        await this.webhookRepository.delete(id);
    }
} 