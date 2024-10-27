import Customer from 'modules/customer/model';
import { Table, Column, DataType, ForeignKey, Model, BelongsTo } from 'sequelize-typescript';

@Table
// @Table({ tableName: 'MembershipLevel' })
export class MembershipLevel extends Model {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id?: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    status?: boolean;

    @Column({ type: DataType.TEXT })
    benefits?: string;

    @Column({ type: DataType.DECIMAL(10, 2) })
    discountPercent?: number;

    @Column({ type: DataType.INTEGER })
    userId?: number;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved?: boolean;
    
    @ForeignKey(() => Customer)
    @Column({ type: DataType.INTEGER, allowNull: true })
    customerId?: number;

    @BelongsTo(() => Customer)
    customer?: Customer;


}
export default MembershipLevel;