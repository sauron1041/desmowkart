// models/Branch.js
import Appointment from 'modules/appointment/model';
import Employee from 'modules/employee/model';
import Service from 'modules/service/model';
import ServiceRequest from 'modules/serviceRequest/model';
import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript';

// @Table({ tableName: 'branch' })
@Table
class Branch extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name?: string;

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

  @HasOne(() => Appointment)
  appointment?: Appointment;

  @HasOne(() => Employee)
  employee?: Employee;


  @HasOne(() => ServiceRequest)
  serviceRequest?: ServiceRequest;

  @HasOne(() => Service)
  service?: Service;
}

export default Branch;