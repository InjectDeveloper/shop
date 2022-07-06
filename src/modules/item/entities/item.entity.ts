import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserFavouriteItemsEntity } from "../../user/entities/user.favouriteItems.entity";
import { CategoryEntity } from "../../category/entities/category.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { Expose } from "class-transformer";
import { UserRolesEnum } from "../../user/constants/user.roles.enum";

@Entity("items")
export class ItemEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({
    type: "text",
  })
  public description: string;

  @ManyToOne(() => CategoryEntity, (category) => category.items, {
    eager: true
  })
  public category: CategoryEntity;

  @Column()
  public img: string;

  @Column()
  public bannerImg: string;

  @Column({
    type: "real",
  })
  public rating: number;

  @Column()
  public tag: string;

  @Column({
    type: "real",
  })
  public price: number;

  @Expose({ groups: [UserRolesEnum.ADMIN] })
  @OneToMany(
    () => UserFavouriteItemsEntity,
    (userFavourites) => userFavourites.item,
    { eager: true }
  )
  public byUserFavourites: UserFavouriteItemsEntity[];

  @Expose({ groups: [UserRolesEnum.ADMIN] })
  @OneToMany(() => ProductEntity, (product) => product.item, {
    eager: true
  })
  public products: ProductEntity[];
}
