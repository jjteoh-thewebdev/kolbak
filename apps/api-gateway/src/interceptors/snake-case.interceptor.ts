import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isObject, mapKeys, snakeCase, camelCase } from 'lodash';

// convert all (request)keys to camelCase
// convert all (response)keys to snake_case
@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // Transform incoming request body
        if (request.body) {
            request.body = this.transformKeysToCamelCase(request.body);
        }

        // Transform incoming request query
        if (request.query) {
            request.query = this.transformKeysToCamelCase(request.query);
        }

        return next.handle().pipe(
            map((data) => this.convertToSnakeCase(data)),
        );
    }

    private transformKeysToCamelCase(data: any): any {
        if (Array.isArray(data)) {
            return data.map(this.transformKeysToCamelCase);
        } else if (isObject(data) && !(data instanceof Date)) {
            return Object.keys(data).reduce((result, key) => {
                const camelKey = camelCase(key); // Convert current key
                result[camelKey] = this.transformKeysToCamelCase(data[key]); // Recursively transform value
                return result;
            }, {} as any);
        }
        return data; // Return value as is if not an object/array
    }

    private convertToSnakeCase(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item) => this.convertToSnakeCase(item));
        } else if (isObject(data) && !(data instanceof Date)) {
            return mapKeys(data, (_, key) => snakeCase(key));
        }
        return data;
    }
}
