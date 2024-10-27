// models/ServiceSkill.js
import Service from 'modules/service/model';
import Skill from 'modules/skill/model';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

@Table
// @Table({ tableName: 'service_skill' })
class ServiceSkill extends Model {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id?: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  serviceId?: number;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.INTEGER, allowNull: false })
  skillId?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRemoved?: boolean;

  @BelongsTo(() => Service)
  service?: Service;

  @BelongsTo(() => Skill)
  skill?: Skill;


}

export default ServiceSkill;
