// // models/User.js
// import { Table, Column, Model, DataType } from 'sequelize-typescript';

// @Table({ tableName: 'users' })
// class User extends Model {
//   @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
//   id?: number;

//   @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
//   username?: string;

//   @Column({ type: DataType.STRING(255), allowNull: false })
//   password?: string;

//   @Column({ type: DataType.STRING(255), allowNull: false })
//   name?: string;

//   @Column({ type: DataType.STRING(255), allowNull: false })
//   email?: string;

//   @Column({ type: DataType.STRING(10) })
//   phone?: string;

//   @Column({ type: DataType.STRING(10) })
//   gender?: string;

//   @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
//   loyaltyPoints?: number;

//   @Column({ type: DataType.STRING(255) })
//   avatar?: string;

//   @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
//   status?: boolean;

//   @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
//   role?: number;

//   @Column({ type: DataType.STRING(255) })
//   token?: string;

//   @Column({ type: DataType.INTEGER })
//   userId?: number;

//   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
//   createdAt?: Date;

//   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
//   updatedAt?: Date;

//   @Column({ type: DataType.BOOLEAN, defaultValue: false })
//   isRemoved?: boolean;
// }

// export default User;
