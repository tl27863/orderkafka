import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

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

  @OneToMany(
    () => PaymentTransaction,
    (paymentTransaction) => paymentTransaction.order,
  )
  paymentTransactions: PaymentTransaction[];
}

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column({ type: "uuid" })
  product_id: string;

  @Column()
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: "order_id" })
  order: Order;
}

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

@Entity("payment_transactions")
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

  @ManyToOne(() => Order, (order) => order.paymentTransactions)
  @JoinColumn({ name: "order_id" })
  order: Order;
}
