import { BaseEntity } from 'src/common/abectracts/baseEntity';

import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { OtpEntity } from './otp.entity';
import { EntityNames } from 'src/common/enums/entitynames.enum';
import { ProfileEntity } from './profile.entity';
import { AddressEntity } from './address.entity';

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ nullable: true })
  fullname: string;
  @Column({ nullable: false, unique: true })
  phone: string;
  @Column({ default: false })
  isBlocked: boolean;
  @Column({ default: false })
  phone_verify: boolean;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column({nullable:true})
  otpId:number
  @Column({nullable:true})
  profileId:number
  @Column({nullable:true})
  addressId:number
  // relesions
  @OneToOne(()=>OtpEntity,otp=>otp.user)
  @JoinColumn({name:'otpId'})
  otp:OtpEntity
  @OneToOne(()=>ProfileEntity,profile=>profile.user)
  @JoinColumn({name:'profileId'})
  profile:ProfileEntity
  @OneToOne(()=>AddressEntity,address=>address.user)
  @JoinColumn({name:'addressId'})
  address:AddressEntity
}
