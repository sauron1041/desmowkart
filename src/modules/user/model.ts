// models/User.js
import { Customer } from 'modules/customer/model';
import { Employee } from 'modules/employee/model';
import { Person } from 'modules/person';
import { Table, Column, Model, DataType, ForeignKey, HasOne, BelongsTo, HasMany } from 'sequelize-typescript';
import { AfterCreate } from 'sequelize-typescript';

@Table
class User extends Person {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;


  @Column({ type: DataType.STRING(100), allowNull: false })
  username?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  password?: string;

  // @Column({ type: DataType.STRING(255) })
  // avatar?: string;

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



  // @AfterCreate
  // async createAssociatedRole(instance: User) {
  //   if (instance.roleId == 1) {
  //     const customer : Customer = {
  //       userId: instance.id
  //     }
  //     await Customer.create({ userId: instance.id });
  //   } else if (instance.roleId == 2) {
  //     // Tạo Employee nếu roleId = 2
  //     await Employee.create({ userId: instance.id });
  //   }
  // }
}

export default User;
