import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { OrderItem } from "./orderItem";
import { PaymentTransaction } from "./paymentTransaction";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  customer_id: string;

  @Column({ length: 50 })
  status: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToOne(
    () => PaymentTransaction,
    (paymentTransaction) => paymentTransaction.order,
  )
  paymentTransaction: PaymentTransaction;
}
