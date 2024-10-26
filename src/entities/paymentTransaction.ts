import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { Order } from "../entities";

@Entity("payment_transaction")
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50 })
  status: string;

  @Column({ type: "uuid" })
  transaction_id: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Order, (order) => order.paymentTransaction)
  @JoinColumn({ name: "order_id" })
  order: Order;
}
