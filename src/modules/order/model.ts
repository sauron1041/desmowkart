// models/Order.js
import Customer from 'modules/customer/model';
import OrderDetail from 'modules/orderDetail/model';
import Payment  from 'modules/payment/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';

@Table
class Order extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customerId?: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  name?: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 1 }) // 1: pending, 2: success, 3: cancel
  status?: number;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => Customer)
  customer?: Customer;

  @HasMany(() => OrderDetail)
  orderDetails?: OrderDetail[];

  @HasOne(() => Payment)
  payment?: Payment;
}

export default Order;
