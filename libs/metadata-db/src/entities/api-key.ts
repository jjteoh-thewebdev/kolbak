import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base";
import { Tenant } from "./tenant";

@Entity(`api_keys`)
export class ApiKey extends BaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: "last_accessed_at" })
    lastAccessedAt: Date;

    @Column("text", { array: true })
    scopes: string[];

    @Column({ name: "tenant_id" })
    tenantId: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.apiKeys)
    tenant: Tenant;
}