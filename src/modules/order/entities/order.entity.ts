import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => UserEntity, (user) => user.history)
  public user: UserEntity

  @Column({
    type: "real",
    nullable: true
  })
  public sum: number;

  @OneToMany(() => ProductEntity, (product) => product.inOrder, {
    eager: true, nullable: true, onDelete: "CASCADE"
  })
  public products: ProductEntity[];
}
