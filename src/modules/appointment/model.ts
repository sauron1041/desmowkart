import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, HasMany, HasOne, BelongsTo } from 'sequelize-typescript';
import Service from 'modules/service/model';
import Customer from 'modules/customer/model';
import { InferAttributes, InferCreationAttributes } from 'sequelize/types/model';
import ServiceRequest from 'modules/serviceRequest/model';
import Employee from 'modules/employee/model';
import Feedback from 'modules/feedback/model';
import Branch from 'modules/branch/model';
import constantStatus from '@core/config/constantStatus';
import AppointmentStatus from './interface';
@Table
class Appointment extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @Column({ type: DataType.STRING(10), allowNull: true })
    code?: string;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    time!: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: AppointmentStatus.WAITING
    })
    status?: AppointmentStatus;

    @Column({ type: DataType.TEXT })
    note!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: 0 })
    reminderSent!: boolean;

    @ForeignKey(() => Branch)
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
    branchId!: number;

    @Column({ type: DataType.INTEGER })
    userId!: number;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt!: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt!: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved!: boolean;

    @ForeignKey(() => Customer)
    @Column({ type: DataType.INTEGER })
    customerId!: number;

    @ForeignKey(() => Employee)
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
    employeeId?: number;

    @ForeignKey(() => Service)
    @Column({ type: DataType.INTEGER })
    serviceId!: number;

    @HasOne(() => ServiceRequest)
    serviceRequest!: ServiceRequest;

    @BelongsTo(() => Branch)
    branch!: Branch;

    @BelongsTo(() => Customer)
    customer!: Customer;

    @BelongsTo(() => Employee)
    employee!: Employee;

    @BelongsTo(() => Service)
    service!: Service;
}

export default Appointment;
