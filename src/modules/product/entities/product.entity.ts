import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemEntity } from "../../item/entities/item.entity";
import { OrderEntity } from "../../order/entities/order.entity";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => ItemEntity, (item) => item.products)
  public item: ItemEntity;

  @Column()
  public data: string;

  @Column()
  public isSale: boolean;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  public inOrder: OrderEntity;
}
