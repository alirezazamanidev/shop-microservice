import { BaseFileEntity } from 'src/common/abstracts/baseFileEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { EntityNames } from 'src/common/enums/entitynames.enum';

@Entity(EntityNames.ProductFile)
export class ProductFileEntity extends BaseFileEntity {
  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product:ProductEntity
}
