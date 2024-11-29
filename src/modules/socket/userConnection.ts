import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

@Table
class UserConnection extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id?: number;

    @Column({ type: DataType.INTEGER })
    userId?: number;

    @Column({ type: DataType.STRING(255) })
    socketId?: string;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    connectedAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

}

export default UserConnection;
