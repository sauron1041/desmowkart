// models/ServiceRequestHistory.js

import ServiceRequest from 'modules/serviceRequest/model';
import ServiceRequestImages from 'modules/serviceRequestImage/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany } from 'sequelize-typescript';
import constantStatus from '@core/config/constantStatus';


// trang thai
@Table
class ServiceRequestStatusHistory extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  // @ForeignKey(() => Service)
  // @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  // serviceId?: number;

  //status
  // @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 0 })
  // status?: number;

  @Column({
    type: DataType.INTEGER, // Sử dụng STRING cho trạng thái
    allowNull: true,
    // defaultValue: constantStatus.CHECKED_IN, // Sử dụng enum ở đây
  })
  status?: number;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  note?: string;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @ForeignKey(() => ServiceRequest)
  @Column({ type: DataType.INTEGER, allowNull: false })
  serviceRequestId?: number;

  @BelongsTo(() => ServiceRequest)
  serviceRequest?: ServiceRequest;


  // @HasOne(() => ServiceRequestImages)
  // serviceRequestImages?: ServiceRequestImages;


  @HasMany(() => ServiceRequestImages)
  serviceRequestImages?: ServiceRequestImages[];

}

export default ServiceRequestStatusHistory;
