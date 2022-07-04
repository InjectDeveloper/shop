import { UserRolesEnum } from './../constants/user.roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable
} from 'typeorm';


@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({nullable: true})
  public password?: string;

  @Column({ default: false })
  public isRegisteredWithGoogle?: boolean;

  @Column({nullable: true})
  public refreshToken: string

  @Column()
  public avatar: string

  @Column({
    type: "real",
    default: 0
  })
  public balance?: number

  @Column({
    nullable: true
  })
  public deposits?: string

  @Column({
    nullable: true
  })
  public favouriteItems?: string

  @Column({
    nullable: true
  })
  public history?: string

  @Column({
    nullable: true
  })
  public reviews?: string

  @Column({
    type: "enum",
    enum: UserRolesEnum,
    default: UserRolesEnum.USER
  })
  public role: UserRolesEnum

  @CreateDateColumn()
  public created_at?: Date
}