-- create migration
pnpm run migration:gen -- libs/metadata-db/src/migrations/YOUR_MIGRATION_NAME -d ./orm.config.ts

-- migrate up
pnpm run migration:up -d ./orm.config.ts

-- migrate down
pnpm run migration:down -d ./orm.config.ts

