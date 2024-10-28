// models/Skill.js
import ServiceSkill from 'modules/serviceSkill/model';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import EmployeeSkill from 'modules/employeeSkill/model';
@Table
class Skill extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @Column({ type: DataType.STRING(255), allowNull: false })
  name?: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  level?: number;

  @Column({ type: DataType.STRING(255) })
  category?: string;

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


  @HasMany(() => EmployeeSkill)
  employeeSkills?: EmployeeSkill[];

  @HasMany(() => ServiceSkill)
  serviceSkills?: ServiceSkill[];
}

export default Skill;
