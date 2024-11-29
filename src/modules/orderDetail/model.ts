// models/OrderDetail.js
import Order from 'modules/order/model';
import Service from 'modules/service/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';

@Table
class OrderDetail extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId?: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER })
  serviceId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  quantity?: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  price?: number;

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

  @BelongsTo(() => Service)
  service?: Service;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  discount?: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  discountType?: number;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  pricePerSession?: number;
}

export default OrderDetail;
