import { BaseEntity } from 'src/common/abectracts/baseEntity';
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityNames } from 'src/common/enums/entitynames.enum';

@Entity(EntityNames.UserAddress)
export class AddressEntity extends BaseEntity {
  @Column()
  postalCode: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  province: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column()
  userId:number
  @OneToOne(()=>UserEntity,user=>user.address,{onDelete:'CASCADE'})
  user:UserEntity
}
