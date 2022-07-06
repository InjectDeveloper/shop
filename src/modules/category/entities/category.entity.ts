import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemEntity } from "../../item/entities/item.entity";

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public img: string;

  @OneToMany(() => ItemEntity, (item) => item.category)
  public items: ItemEntity[];
}
