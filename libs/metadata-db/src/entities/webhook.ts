import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Tenant } from "./tenant";
import { BaseEntity } from "./base";

@Entity(`webhooks`)
export class Webhook extends BaseEntity {
    @Column()
    description: string;

    @Column()
    event: string;

    @Column({ name: "callback_url" })
    callbackUrl: string;

    @Column({ name: "is_active" })
    isActive: boolean

    @Column()
    secret: string;

    @Column({ name: "tenant_id" })
    tenantId: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.webhooks, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'tenant_id' })
    @Index()
    tenant: Tenant;
}