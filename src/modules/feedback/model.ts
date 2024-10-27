// models/Feedback.js
import { Customer } from 'modules/customer/model';
import { Employee } from 'modules/employee/model';
import { Person } from 'modules/person';
import ServiceRequest from 'modules/serviceRequest/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
// @Table({ tableName: 'users' })
class Feedback extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;


  // service request
  @ForeignKey(() => ServiceRequest)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  serviceRequestId?: number;


  @Column({ type: DataType.STRING(10), allowNull: false })
  code?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  title?: string;

  @Column({ type: DataType.TEXT })
  content?: string;

  // @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER, allowNull: true })
  customerId?: number;

  // @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: true })
  employeeId?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status?: number;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => ServiceRequest)
  serviceRequest?: ServiceRequest;
}

export default Feedback;