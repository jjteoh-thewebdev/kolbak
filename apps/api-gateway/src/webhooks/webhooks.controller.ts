import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { IWebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { QueryWebhooksDto } from './dto/query-webhooks.dto';
import { WEBHOOKS_SERVICE_TOKEN } from './webhooks.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FastifyRequest } from 'fastify';

@Controller({
    path: 'webhooks',
    version: '1'
})
@UseGuards(JwtAuthGuard)
export class WebhooksController {
    constructor(
        @Inject(WEBHOOKS_SERVICE_TOKEN) private readonly webhooksService: IWebhooksService,
    ) { }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
        return this.webhooksService.findOne(id, req.user);
    }

    @Get()
    async findAll(@Query() query: QueryWebhooksDto, @Req() req: FastifyRequest) {
        return this.webhooksService.findAll(query, req.user);
    }

    @Post()
    async create(@Body() createWebhookDto: CreateWebhookDto, @Req() req: FastifyRequest) {
        return this.webhooksService.create(createWebhookDto, req.user);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto, @Req() req: FastifyRequest) {
        return this.webhooksService.update(id, updateWebhookDto, req.user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: FastifyRequest) {
        return this.webhooksService.remove(id, req.user);
    }
} 