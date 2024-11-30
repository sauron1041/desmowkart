// models/ServiceRequest.js
import Appointment from 'modules/appointment/model';
import Branch from 'modules/branch/model';
import EmployeeStatus from 'modules/employeeStatus/model';
import Feedback from 'modules/feedback/model';
import ServiceRequestStatusHistory from 'modules/serviceRequestHistory/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany } from 'sequelize-typescript';
import ServiceRequestStatus from './interface';
import { ServiceRequestImage } from 'modules/serviceRequestImage';

@Table
class ServiceRequest extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.STRING(10), allowNull: false })
  code?: string;

  @ForeignKey(() => Appointment)
  @Column({ type: DataType.INTEGER, allowNull: false })
  appointmentId?: number;

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: ServiceRequestStatus.PENDING })
  currentStatus?:  ServiceRequestStatus;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
  checkInTime?: Date;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  completedTime?: Date;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => Appointment)
  appointment!: Appointment;

  @HasMany(() => ServiceRequestStatusHistory)
  statusHistory?: ServiceRequestStatusHistory[];

  @HasOne(() => Feedback)
  feedback!: Feedback;

  // @HasMany(() => EmployeeStatus)
  // employeeStatus?: EmployeeStatus[];

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  branchId?: number;


  // @HasMany(() => ServiceRequestImage)
  // images?: ServiceRequestImage[];
}

export default ServiceRequest;
