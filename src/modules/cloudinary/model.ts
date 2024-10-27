// models/ServiceRequestHistory.js
import { Service } from 'model/service';
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';

@Table
class ServiceRequestHistory extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  serviceId?: number;

  //status
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  status?: number;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;
}

export default ServiceRequestHistory;
