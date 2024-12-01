// models/Category.js
import Service from 'modules/service/model';
import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';

@Table
// @Table({ tableName: 'category' })
class Category extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  status?: boolean;

  @Column({ type: DataType.INTEGER })
  userId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @HasOne(() => Service)
  service?: Service;
}

export default Category;
