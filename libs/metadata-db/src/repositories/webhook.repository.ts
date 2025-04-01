import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Webhook } from "../entities/webhook";

@Injectable()
export class WebhookRepository extends Repository<Webhook> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Webhook, dataSource.createEntityManager());
    }

    async findOneWithId(id: string) {
        return this.findOneBy({ id });
    }
}