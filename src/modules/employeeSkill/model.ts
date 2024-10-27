// models/EmployeeSkill.js
import Employee from 'modules/employee/model';
import Skill from 'modules/skill/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

@Table
class EmployeeSkill extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Employee)
  @Column({ type: DataType.INTEGER, allowNull: false })
  employeeId?: number;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.INTEGER, allowNull: false })
  skillId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @BelongsTo(() => Skill)
  skill?: Skill;


}

export default EmployeeSkill;
