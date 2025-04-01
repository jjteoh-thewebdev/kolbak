import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { IApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { QueryApiKeysDto } from './dto/query-api-keys.dto';
import { API_KEYS_SERVICE_TOKEN } from './api-keys.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FastifyRequest } from 'fastify';

@Controller({
    path: 'keys',
    version: '1'
})
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
    constructor(
        @Inject(API_KEYS_SERVICE_TOKEN) private readonly apiKeysService: IApiKeysService,
    ) { }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: FastifyRequest) {
        return this.apiKeysService.findOne(id, req.user);
    }

    @Get()
    async findAll(@Query() query: QueryApiKeysDto, @Req() req: FastifyRequest) {
        return this.apiKeysService.findAll(query, req.user);
    }

    @Post()
    async create(@Body() createApiKeyDto: CreateApiKeyDto, @Req() req: FastifyRequest) {
        return this.apiKeysService.create(createApiKeyDto, req.user);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateApiKeyDto: UpdateApiKeyDto, @Req() req: FastifyRequest) {
        return this.apiKeysService.update(id, updateApiKeyDto, req.user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: FastifyRequest) {
        return this.apiKeysService.remove(id, req.user);
    }
} 