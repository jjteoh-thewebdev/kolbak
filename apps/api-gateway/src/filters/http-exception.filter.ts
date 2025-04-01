import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ValidationError } from "class-validator";

// standardize error response
/**
 * {
 *  data: null,
 *  error: string | ValidationError[],
 *  pagination: null
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<FastifyReply>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let errorMessage: string | ValidationError[] = exception.message || 'An error occurred';

        console.log(exceptionResponse);

        // Handle class-validator errors
        // TODO: handling nested errors
        if (Array.isArray(exceptionResponse.message) &&
            exceptionResponse.message.length > 0) {
            errorMessage = exceptionResponse.message;
        }

        const errorResponse = {
            data: null,  // data is null for errors
            error: errorMessage,
            pagination: null
        };

        response.status(status).send(errorResponse);
    }
}
