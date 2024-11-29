import Appointment from 'modules/appointment/model';
import Branch from 'modules/branch/model';
import EmployeeSkill from 'modules/employeeSkill/model';
import EmployeeStatus from 'modules/employeeStatus/model';
import { Person } from 'modules/person';
import ServiceRequest from 'modules/serviceRequest/model';
import { User } from 'modules/user';
import { Table, Column, DataType, ForeignKey, Model, HasOne, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';

@Table
export class Employee extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
    id?: number;

    @Column({ type: DataType.STRING(8), allowNull: false })
    code?: string;

    @Column({ type: DataType.STRING })
    position?: string;

    @Column({ type: DataType.DATE, allowNull: true, defaultValue: DataType.NOW })
    startTime?: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    endTime?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    status?: boolean;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved?: boolean;

    @ForeignKey(() => Branch)
    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
    branchId?: number;

    @BelongsTo(() => Branch)
    branch?: Branch;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    userId?: number;

    @BelongsTo(() => User)
    user?: User;

    @HasMany(() => EmployeeStatus)
    employeeStatus?: EmployeeStatus[];

    @HasOne(() => Appointment)
    appointment?: Appointment;

    @HasMany(() => EmployeeSkill)
    employeeSkill?: EmployeeSkill[];

    @Column({ type: DataType.STRING(255), allowNull: true })
    avatar?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    address?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    city?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    district?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    ward?: string;

    @HasOne(() => ServiceRequest)
    serviceRequest?: ServiceRequest;

    @Column({ type: DataType.STRING(255), allowNull: true })
    name?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    email?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    phone?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    gender?: number

    @Column({ type: DataType.DATE, allowNull: true })
    dateOfBirth?: Date;
}
export default Employee;