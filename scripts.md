-- create migration
pnpm run migration:gen libs/metadata-db/migrations/YOUR_MIGRATION_NAME -d ./orm.config.ts

-- migrate up
pnpm run migration:up -d ./orm.config.ts

-- migrate down
pnpm run migration:down -d ./orm.config.ts


-- bcrypt compatibility issue with node22
-- issue: https://github.com/kelektiv/node.bcrypt.js/issues/1192
-- solve with: https://github.com/kelektiv/node.bcrypt.js/issues/800
-- try this if you facing bcrypt module not found issue
cd node_modules/bcrypt
node-pre-gyp install --fallback-to-build