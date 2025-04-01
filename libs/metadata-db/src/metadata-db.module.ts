import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import existing entities,alternatively you can use wildcard import
import { ApiKey } from './entities/api-key';
import { Tenant } from './entities/tenant';
import { Webhook } from './entities/webhook';

// Define all entities
const entities = [
  ApiKey,
  Tenant,
  Webhook,
];

/**
 * MetadataDbModule provides a centralized database access layer
 * for Kolbak, encapsulating all database entities.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],
  exports: [
    TypeOrmModule.forFeature(entities),
  ],
})
export class MetadataDbModule {
  /**
   * Import this module as a library without database connection setup.
   * Use this when the TypeORM connection is configured elsewhere.
   * 
   * @example
   * ```typescript
   * @Module({
   *   imports: [MetadataDbModule.register()],
   * })
   * export class YourModule {}
   * ```
   */
  static register(): DynamicModule {
    return {
      module: MetadataDbModule,
      imports: [
        TypeOrmModule.forFeature(entities),
      ],
      exports: [
        TypeOrmModule.forFeature(entities),
      ],
    };
  }

  /**
   * Import this module with database connection configuration.
   * Use this in your root module to set up the database connection.
   * 
   * @param options Override default database configuration options
   * 
   * @example
   * ```typescript
   * @Module({
   *   imports: [
   *     MetadataDbModule.forRoot({
   *       database: 'kolbak',
   *       synchronize: process.env.NODE_ENV !== 'production',
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(options: Record<string, any> = {}): DynamicModule {
    return {
      module: MetadataDbModule,
      global: true,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: options.type || configService.get('DB_TYPE') || 'postgres',
            host: options.host || configService.get('DB_HOST') || 'localhost',
            port: options.port || parseInt(configService.get('DB_PORT') || '5432', 10),
            username: options.username || configService.get('DB_USERNAME') || 'postgres',
            password: options.password || configService.get('DB_PASSWORD') || 'postgres',
            database: options.database || configService.get('DB_NAME') || 'kolbak',
            entities: entities,
            synchronize: options.synchronize !== undefined
              ? options.synchronize
              : configService.get('DB_SYNCHRONIZE') === 'true' || false,
            migrations: options.migrations || [],
            migrationsRun: options.migrationsRun !== undefined
              ? options.migrationsRun
              : configService.get('DB_MIGRATIONS_RUN') === 'true' || false,
            ssl: options.ssl !== undefined
              ? options.ssl
              : configService.get('DB_SSL') === 'true' || false,
          }),
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [
        TypeOrmModule.forFeature(entities),
      ],
    };
  }

  /**
   * Import this module with custom configuration factory
   * Use this for advanced configuration scenarios
   * 
   * @param options Configuration options including factory function
   * 
   * @example
   * ```typescript
   * @Module({
   *   imports: [
   *     MetadataDbModule.forRootAsync({
   *       imports: [ConfigModule],
   *       inject: [ConfigService],
   *       useFactory: (config: ConfigService) => ({
   *         type: 'postgres',
   *         url: config.get('DATABASE_URL'),
   *         ssl: { rejectUnauthorized: false },
   *       }),
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRootAsync(options: {
    imports?: any[];
    useFactory: (...args: any[]) => Record<string, any> | Promise<Record<string, any>>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: MetadataDbModule,
      global: true,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: options.imports || [ConfigModule],
          inject: options.inject || [ConfigService],
          useFactory: async (...args: any[]) => {
            const config = await options.useFactory(...args);
            return {
              ...config,
              entities: entities,
            };
          },
        }),
        TypeOrmModule.forFeature(entities),
      ],
      exports: [
        TypeOrmModule.forFeature(entities),
      ],
    };
  }
}
