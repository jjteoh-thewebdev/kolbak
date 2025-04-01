import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ApiKey } from "../entities/api-key";

@Injectable()
export class ApiKeyRepository extends Repository<ApiKey> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(ApiKey, dataSource.createEntityManager());
    }

    async findOneWithId(id: string) {
        return this.findOneBy({ id });
    }
}