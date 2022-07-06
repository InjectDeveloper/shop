import { UserAvatarsArray } from "./../constants/user.avatars.array";
import { ReviewEntity } from "./../../review/entities/review.entity";
import { DepositEntity } from "./../../deposit/entities/deposit.entity";
import { UserRolesEnum } from "./../constants/user.roles.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { UserFavouriteItemsEntity } from "./user.favouriteItems.entity";
import { Expose } from "class-transformer";
import { OrderEntity } from "../../order/entities/order.entity";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Expose({ groups: [UserRolesEnum.ADMIN] })
  @Column({ nullable: true })
  public password?: string;

  @Column({ default: false })
  public isRegisteredWithGoogle?: boolean;

  @Expose({ groups: [UserRolesEnum.ADMIN] })
  @Column({ nullable: true })
  public refreshToken: string;

  @Column()
  public avatar: string;

  @Column({
    type: "real",
    default: 0,
  })
  public balance?: number;

  @OneToMany(() => DepositEntity, (deposit) => deposit.user, {
    eager: true
  })
  public deposits?: DepositEntity[];

  @OneToMany(
    () => UserFavouriteItemsEntity, (userFavourites) => userFavourites.user, {
      eager: true,
      onDelete: "CASCADE"
  })
  public favouriteItems?: UserFavouriteItemsEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user, {
    eager: true
  })
  public history?: OrderEntity[]

  @OneToMany(() => ReviewEntity, (review) => review.user, {
      eager: true
  })
  public reviews?: ReviewEntity[];

  @Column({
    type: "enum",
    enum: UserRolesEnum,
    default: UserRolesEnum.USER,
  })
  public role: UserRolesEnum;

  @CreateDateColumn()
  public created_at?: Date;
}
