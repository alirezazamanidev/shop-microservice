import { BaseEntity } from 'src/common/abstracts/baseEntity';
import { EntityNames } from 'src/common/enums/entitynames.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { ProductFileEntity } from './product-file.entity';
@Entity(EntityNames.Product)
export class ProductEntity extends BaseEntity {
  @Column({ default: false })
  show: boolean;
  @Column()
  title: string;
  @Column()
  slug: string;
  @Column()
  description: string;
  @Column()
  count: string;
  @Column({ type: 'numeric' })
  price: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  // relations
  @OneToMany(()=>ProductFileEntity,images=>images.product)
  images:ProductFileEntity
  @OneToOne(()=>ProductFileEntity,image=>image.product,{onDelete:'CASCADE'})
  coverImage:string
}
