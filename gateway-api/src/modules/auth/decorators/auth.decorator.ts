import { applyDecorators, UseGuards } from "@nestjs/common";

import { ApiSecurity } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth.guard";




export const Auth=()=>applyDecorators(ApiSecurity('authorization'),UseGuards(AuthGuard))