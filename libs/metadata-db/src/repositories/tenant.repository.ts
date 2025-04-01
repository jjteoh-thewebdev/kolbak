import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Tenant } from "../entities/tenant";

@Injectable()
export class TenantRepository extends Repository<Tenant> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Tenant, dataSource.createEntityManager());
    }

    findOneWithId(id: string) {
        return this.findOneBy({ id });
    }
}
