import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1743512869819 implements MigrationInterface {
    name = 'Initial1743512869819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_keys" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "last_accessed_at" TIMESTAMP NOT NULL, "scopes" text array NOT NULL, "tenant_id" character varying NOT NULL, CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3ac18429c8d27858d79432e0dd" ON "api_keys" ("tenant_id") `);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "secret" character varying NOT NULL, CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "webhooks" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying NOT NULL, "event" character varying NOT NULL, "callback_url" character varying NOT NULL, "is_active" boolean NOT NULL, "secret" character varying NOT NULL, "tenant_id" character varying NOT NULL, CONSTRAINT "PK_9e8795cfc899ab7bdaa831e8527" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d6fcde4ac5ca1d5823f51aa18" ON "webhooks" ("tenant_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4d6fcde4ac5ca1d5823f51aa18"`);
        await queryRunner.query(`DROP TABLE "webhooks"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ac18429c8d27858d79432e0dd"`);
        await queryRunner.query(`DROP TABLE "api_keys"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
