import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from "typeorm";

@Entity("inventory")
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  product_id: string;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  reserved_quantity: number;

  @UpdateDateColumn()
  updated_at: Date;
}
