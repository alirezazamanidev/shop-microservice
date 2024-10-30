import { ExceptionFilter, HttpException } from "@nestjs/common";
import { AllExceptionFilter } from "./all-exception.filter";
import { HttpAdapterHost } from "@nestjs/core";
import { ValidationExceptionFilter } from "./validation-exception.filter";

export const getGlobalFilters = (
    httpAdapter: HttpAdapterHost
  ): ExceptionFilter<any>[] => [

      new AllExceptionFilter(httpAdapter),
      new ValidationExceptionFilter(),
  ];
  