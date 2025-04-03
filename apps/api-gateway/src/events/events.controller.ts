import { Body, Controller, Inject, Post, UseGuards, Req } from '@nestjs/common';
import { IEventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EVENTS_SERVICE_TOKEN } from './events.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FastifyRequest } from 'fastify';

@Controller({
    path: 'events',
    version: '1'
})
@UseGuards(JwtAuthGuard)
export class EventsController {
    constructor(
        @Inject(EVENTS_SERVICE_TOKEN) private readonly eventsService: IEventsService,
    ) { }

    @Post()
    async create(@Body() createEventDto: CreateEventDto, @Req() req: FastifyRequest) {
        return this.eventsService.create(createEventDto, req.user);
    }
}