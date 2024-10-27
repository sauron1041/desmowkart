// models/ServiceRequestHistory.js
import { Service } from 'model/service';
import { Customer } from 'modules/customer/model';
import { Employee } from 'modules/employee/model';
import ServiceRequest from 'modules/serviceRequest/model';
import ServiceRequestStatusHistory from 'modules/serviceRequestHistory/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
class ServiceRequestImages extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  // @ForeignKey(() => Service)
  // @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  // serviceId?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  imageUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  status?: number;

  // @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  customerId?: number;

  // @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null, comment: 'nguoi tai len' })
  employeeId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  uploadedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @ForeignKey(() => ServiceRequestStatusHistory)
  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  serviceRequestStatusHistoryId?: number;

  @BelongsTo(() => ServiceRequestStatusHistory)
  serviceRequestStatusHistory?: ServiceRequestStatusHistory;


  // @ForeignKey(() => ServiceRequest)
  // @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  // serviceRequestId?: number;

  // @BelongsTo(() => ServiceRequest)
  // serviceRequest?: ServiceRequest;
}

export default ServiceRequestImages;
