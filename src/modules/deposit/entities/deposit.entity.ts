import { DepositStatusesEnum } from "./../constants/deposit.statuses.enum";
import { DepositTypesEnum } from "./../constants/deposit.types.enum";
import { UserEntity } from "./../../user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("deposits")
export class DepositEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @ManyToOne(() => UserEntity, (user) => user.deposits)
  public user: UserEntity;

  @Column({
    type: "real",
    default: 0,
  })
  public sum: number;

  @Column()
  public data: string;

  @Column({
    type: "enum",
    enum: DepositTypesEnum,
  })
  public type: DepositTypesEnum;

  @Column({
    type: "enum",
    enum: DepositStatusesEnum,
    default: DepositStatusesEnum.IN_PROCESS,
  })
  public status?: DepositStatusesEnum;

  @Column()
  public expires_in: Date;

  @CreateDateColumn()
  public created_at?: Date;
}
