import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { FastifyReply } from "fastify";

// standardize error response
/**
 * {
 *  data: null,
 *  error: string,
 *  pagination: null
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<FastifyReply>();
        const status = exception.getStatus();

        const errorResponse = {
            data: null,  // data is null for errors
            error: exception.message || 'An error occurred',
            pagination: null
        };

        response.status(status).send(errorResponse);
    }
}
