import { IsNumber } from "class-validator";


export class UpdateProfile {

    @IsNumber()
    userId:number
    
}