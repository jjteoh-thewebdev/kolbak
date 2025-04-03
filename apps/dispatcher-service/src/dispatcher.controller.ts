import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { EventDto } from "./dto/event.dto";

@Controller()
export class DispatcherController {
    @EventPattern(`webhook.dispatch-*`)
    async handleEventIngress(@Payload() data: EventDto, @Ctx() context: KafkaContext) {
        console.log(`context`, context);
        console.log(data);
        // TODO: dispatch event to webhook subscribers
    }
}