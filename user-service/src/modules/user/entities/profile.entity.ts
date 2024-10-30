import { BaseEntity } from 'src/common/abectracts/baseEntity';
import { EntityNames } from 'src/common/enums/entitynames.enum';
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(EntityNames.userProfile)
export class ProfileEntity extends BaseEntity {
  @Column({ nullable: true })
  nationalNumber: string;
  @Column()
  userId:number
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  // reletions
  @OneToOne(()=>UserEntity,user=>user.profile,{onDelete:'CASCADE'})
  user:UserEntity


}
