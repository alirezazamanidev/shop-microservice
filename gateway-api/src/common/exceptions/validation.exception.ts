import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

export default class ValidationException extends BadRequestException {
  constructor(public validationErrors: object[] | string[] | string) {
    super();
  }
}
