import { Controller, Inject } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { EventDto } from "./dto/event.dto";
import { DISPATCHER_SERVICE_TOKEN } from "./constants";
import { IDispatcherService } from "./dispatcher.service";

@Controller()
export class DispatcherController {
    constructor(
        @Inject(DISPATCHER_SERVICE_TOKEN)
        private readonly _dispatcherService: IDispatcherService,
    ) { }

    @EventPattern(`webhook.dispatch`)
    async handleWebhookDispatch(@Payload() data: EventDto, @Ctx() context: KafkaContext) {
        console.log(`context`, context);
        console.log(data);
        await this._dispatcherService.dispatchEvent(data);
    }
}