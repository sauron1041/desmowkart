import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'session_tracking', timestamps: true })
export class SessionTracking extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  customerId?: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  sessionId?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1, comment: '1: bắt đầu, 2: đang xử lý, 3: hoàn thành' })
  process?: number;

  @Column({ type: DataType.TEXT })
  note?: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  branchId?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status?: boolean;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;
}