import { ValidationPipe } from '@nestjs/common';
import ValidationException from '../exceptions/validation.exception';

export class ValidationPipeError extends ValidationPipe {
  constructor() {
    super({
      validateCustomDecorators: true,
      whitelist: true,
      exceptionFactory(errors) {
        const formattedErrors = errors.flatMap(error =>
            Object.values(error.constraints)
          );

      
   

        return new ValidationException(formattedErrors);
      },
    });
  }
}
