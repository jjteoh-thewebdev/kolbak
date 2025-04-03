import { Controller, Inject } from '@nestjs/common';
import { IDeliveryManagerService } from './delivery-manager.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IngressEventDto } from './dto/ingress-event.dto';
import { DELIVERY_MANAGER_SERVICE_TOKEN } from './constants';

@Controller()
export class DeliveryManagerController {
  constructor(
    @Inject(DELIVERY_MANAGER_SERVICE_TOKEN)
    private readonly _deliveryManagerService: IDeliveryManagerService) { }

  @EventPattern(`event.ingress`)
  async handleEventIngress(@Payload() data: IngressEventDto) {
    await this._deliveryManagerService.delegateEvent(data);
  }
}
