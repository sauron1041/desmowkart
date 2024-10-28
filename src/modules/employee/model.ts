import Appointment from 'modules/appointment/model';
import Branch from 'modules/branch/model';
import EmployeeStatus from 'modules/employeeStatus/model';
import { Person } from 'modules/person';
import { User } from 'modules/user';
import { Table, Column, DataType, ForeignKey, Model, HasOne, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';

@Table
export class Employee extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id?: number;

    // @Column({ type: DataType.STRING(100), allowNull: true, defaultValue: '' })
    // name?: string;

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


    // @ForeignKey(() => User)
    // @Column({ type: DataType.INTEGER })
    // userId?: number;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved?: boolean;

    // @BelongsTo(() => User, 'employeeId')
    // user?: User;


    //       @BelongsTo(() => Customer, 'customerId')
    //   customerData?: Customer;

    //   @BelongsTo(() => Employee, 'employeeId')
    //   employeeData?: Employee;

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

}
export default Employee;