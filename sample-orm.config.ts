import * as path from "path";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const entitiesDir = path.join(__dirname, 'libs/metadata-db/src/entities/**/*.ts');
const migrationsDir = path.join(__dirname, 'libs/metadata-db/migrations/**/*.ts');

console.log(`entitiesDir: ${entitiesDir}`);
console.log(`migrationsDir: ${migrationsDir}`);

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5430,
    username: 'postgres',
    password: 'postgres123',
    database: 'metadata-db',
    entities: [entitiesDir],
    migrations: [migrationsDir],
    // migrationsTableName: 'migrations',
    synchronize: false,
}

const ds = new DataSource(config);

export default ds;

