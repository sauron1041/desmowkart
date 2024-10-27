import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';

@Table({ tableName: 'service', timestamps: true })
export class Service extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  price!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  servicePackageId?: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  branchId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalSessions!: number;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW})
  updatedAt!: Date;

  
  
}
