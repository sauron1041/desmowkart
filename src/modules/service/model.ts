import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import Category from 'modules/category/model';
import Branch from 'modules/branch/model';
import Appointment from 'modules/appointment/model';
import Employee from 'modules/employee/model';
import { OrderDetail } from 'modules/orderDetail';

@Table
class Service extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status!: boolean;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId!: number;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: false })
  branchId!: number;

  @Column({ type: DataType.INTEGER })
  totalSessions!: number;

  @Column({ type: DataType.INTEGER })
  userId!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved!: boolean;

  @HasMany(() => Appointment)
  appointments!: Appointment[];


  @BelongsTo(() => Category)
  category!: Category;

  @BelongsTo(() => Branch)
  branch!: Branch;

  @HasMany(() => OrderDetail) // Changed from HasOne to HasMany
  orderDetails!: OrderDetail[]; 
}

export default Service;
