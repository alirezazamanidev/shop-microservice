import { ValidationPipe,ValidationError } from '@nestjs/common';
import ValidationException from '../exceptions/validation.exception';

export class ValidationPipeError extends ValidationPipe {
  constructor() {
    super({
      
       transform:true,
      exceptionFactory(errors:ValidationError[]) {
        const formattedErrors = errors.flatMap(error =>
          Object.values(error.constraints || {}).map(message =>
            `${error.property}: ${message}`
          )
        );


        return new ValidationException(formattedErrors);
      },
    });
  }
}
