// models/CreateEmpoyeeDto.js
import { Customer } from 'modules/customer/model';
import { Employee } from 'modules/employee/model';
import { Person } from 'modules/person';
import { Table, Column, Model, DataType, ForeignKey, HasOne, BelongsTo, HasMany } from 'sequelize-typescript';
import EmployeeSkill from 'modules/employeeSkill/model';

@Table
class CreateEmpoyeeDto extends Person {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id?: number;

    @Column({ type: DataType.STRING(8), allowNull: false })
    code?: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    username?: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    password?: string;

    @Column({ type: DataType.STRING(255) })
    avatar?: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    status?: boolean;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved?: boolean;

    @Column({ type: DataType.INTEGER })
    roleId?: number; // Role 1: Admin, 2: Employee, 3: Customer

    employeeSkill?: EmployeeSkill[];

    branchId?: number;

    @Column({ type: DataType.STRING(255), allowNull: true })
    address?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    city?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    district?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    ward?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    name?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    email?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    phone?: string;

    @Column({ type: DataType.DATE, allowNull: true })
    dateOfBirth?: Date;

}

export default CreateEmpoyeeDto;