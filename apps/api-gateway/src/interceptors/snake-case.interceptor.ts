import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isObject, mapKeys, snakeCase } from 'lodash';

// convert all (response)keys to snake_case
@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => this.convertToSnakeCase(data)),
        );
    }

    private convertToSnakeCase(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item) => this.convertToSnakeCase(item));
        } else if (isObject(data)) {
            return mapKeys(data, (_, key) => snakeCase(key));
        }
        return data;
    }
}
