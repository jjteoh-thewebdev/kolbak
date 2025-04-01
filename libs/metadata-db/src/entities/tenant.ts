import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base";
import { ApiKey } from "./api-key";
import { Webhook } from "./webhook";

@Entity(`tenants`)
export class Tenant extends BaseEntity {
    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column()
    secret: string;

    @OneToMany(() => ApiKey, (apiKey) => apiKey.tenant)
    apiKeys: ApiKey[];

    @OneToMany(() => Webhook, (webhook) => webhook.tenant)
    webhooks: Webhook[];
}