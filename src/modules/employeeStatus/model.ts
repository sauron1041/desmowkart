// models/EmployeeStatus.js
import Branch from 'modules/branch/model';
import Employee from 'modules/employee/model';
import Order from 'modules/order/model';
import Service from 'modules/service/model';
import ServiceRequest from 'modules/serviceRequest/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';

@Table
class EmployeeStatus extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  employeeStatus?: number; // 0: free, 1: busy, 2: break
  // 0 ranh, 1 ban, 2 nghi

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER })
  employeeId?: number;

  @BelongsTo(() => Employee)
  employee?: Employee;

  // @ForeignKey(() => ServiceRequest)
  // @Column({ type: DataType.INTEGER })
  // serviceRequestId?: number;

  // @BelongsTo(() => ServiceRequest)
  // serviceRequest?: ServiceRequest;

  @ForeignKey(() => Branch)
  @Column({ type: DataType.INTEGER })
  branchId?: number;

  // @BelongsTo(() => Branch)
  // branch?: Branch;

}

export default EmployeeStatus;
