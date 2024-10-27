// models/Order.js
import Customer from 'modules/customer/model';
import OrderDetail from 'modules/orderDetail/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';

@Table
class Order extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customerId?: number;


  @Column({ type: DataType.STRING(255), allowNull: false })
  name?: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  level?: number;

  @Column({ type: DataType.STRING(255) })
  category?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status?: boolean;

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
  orderDetail?: OrderDetail;

}

export default Order;
