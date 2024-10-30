import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { Request, Response } from "express";
import ValidationException from "../exceptions/validation.exception";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {

    catch(exception:ValidationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res: Response = ctx.getResponse<Response>();
        const req=ctx.getRequest<Request>();        
    
         let statusCode = exception.getStatus();
         res.status(statusCode).json({
            statusCode,
            timestamp: new Date().toISOString(),
            path:req.url,
            message:exception.message,
            errors:exception.validationErrors || [],
         })
    }
}