// models/Payment.js
import Order from 'modules/order/model';
import Service from 'modules/service/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
class Payment extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderId?: number;

  @Column({ type: DataType.INTEGER })
  amount?: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  paymentMethod?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  paymentStatus?: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => Order)
  order?: Order;

}

export default Payment;
