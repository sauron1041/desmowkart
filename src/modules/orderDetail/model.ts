// models/OrderDetail.js
import Order from 'modules/order/model';
import Service from 'modules/service/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
class OrderDetail extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderId?: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER })
  serviceId?: number;

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
}

export default OrderDetail;
