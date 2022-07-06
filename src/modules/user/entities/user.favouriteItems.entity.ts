import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemEntity } from "../../item/entities/item.entity";
import { UserEntity } from "./user.entity";

@Entity("users_favourite_items")
export class UserFavouriteItemsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => UserEntity, (user) => user.favouriteItems, {
    onDelete: "CASCADE"
  })
  public user: UserEntity;

  @ManyToOne(() => ItemEntity, (item) => item.byUserFavourites, {
    onDelete: "CASCADE",
    eager: true
  })
  public item: ItemEntity;

  @Column()
  public userId!: number

  @Column()
  public itemId!: number
}
