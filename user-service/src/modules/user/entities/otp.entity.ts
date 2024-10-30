import { BaseEntity } from "src/common/abectracts/baseEntity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityNames } from "src/common/enums/entitynames.enum";

@Entity(EntityNames.userOtp)
export class OtpEntity extends BaseEntity {
    @Column({type:'varchar',length:5,nullable:false})
    code:string
    @Column()
    expiresIn:Date
    @Column()
    userId:number
    // relations
    @OneToOne(()=>UserEntity,user=>user.otp,{onDelete:'CASCADE'})
    user:UserEntity
}