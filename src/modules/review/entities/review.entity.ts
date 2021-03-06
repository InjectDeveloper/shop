import { UserEntity } from "./../../user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn, PrimaryGeneratedColumn,
} from "typeorm";

@Entity("reviews")
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  public user: UserEntity;

  @Column({
    type: "text",
  })
  public text: string;

  @CreateDateColumn()
  public created_at: Date;
}
