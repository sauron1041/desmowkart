// models/User.js
import { Customer } from 'modules/customer/model';
import { Employee } from 'modules/employee/model';
import { Person } from 'modules/person';
import { Table, Column, Model, DataType, ForeignKey, HasOne, BelongsTo } from 'sequelize-typescript';

@Table
class User extends Person {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.STRING(8), allowNull: false })
  code?: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  username?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password?: string;

  // @ForeignKey(() => Customer)
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // customerId?: number;

  // @ForeignKey(() => Employee)
  // @Column({ type: DataType.INTEGER, allowNull: true })
  // employeeId?: number;

  @Column({ type: DataType.STRING(255) })
  avatar?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status?: boolean;

  // @Column({ type: DataType.INTEGER })
  // customerId?: number;

  // @Column({ type: DataType.INTEGER })
  // employeeId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  // @HasOne(() => Customer, 'userId')
  // customer?: Customer;

  // @HasOne(() => Employee, 'userId')
  // employee?: Employee;

  // @BelongsTo(() => Customer, 'customerId')
  // customerData?: Customer;

  // @BelongsTo(() => Employee, 'employeeId')
  // employeeData?: Employee;

  // @HasOne(() => Customer)
  // customer?: Customer;


  // @HasOne(() => Employee)
  // employee?: Employee;

}

export default User;