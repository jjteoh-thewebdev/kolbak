import { BeforeInsert, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ulid } from "ulid";

@Entity()
export class BaseEntity {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({name: "deleted_at"})
    deletedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = ulid();
    }
}