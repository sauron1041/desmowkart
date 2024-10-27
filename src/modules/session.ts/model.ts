import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
// @Table({ tableName: 'session', timestamps: true })
export class Session extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id?: number;

    @Column({ type: DataType.STRING(255), allowNull: false })
    name?: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    serviceId?: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    customerId?: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    staffId?: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    status?: boolean;

    @Column({ type: DataType.INTEGER })
    userId?: number;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;
}