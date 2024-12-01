import Appointment from 'modules/appointment/model';
import MembershipLevel from 'modules/membershipLevel/model';
import Order from 'modules/order/model';
import { Person } from 'modules/person';
import User from 'modules/user/model';
import { Table, Column, DataType, ForeignKey, Model, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';

@Table
// @Table({ tableName: 'customer' })
export class Customer extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false })
    id?: number;
    // @Column({ type: DataType.STRING(100), allowNull: true, defaultValue: '' })
    // name?: string;

    @Column({ type: DataType.STRING(10), allowNull: false })
    code?: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    status?: boolean;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    loyaltyPoints?: number;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    updatedAt?: Date;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    isRemoved?: boolean;

    //24/10/2024
    // Liên kết với Appointment
    @HasMany(() => Appointment)
    appointments?: Appointment[];

    // @HasOne(() => MembershipLevel, { as: 'membershipLevelDetails' }) 
    @HasOne(() => MembershipLevel)
    membershipLevelDetails?: MembershipLevel;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
    userId?: number;

    @BelongsTo(() => User)
    user?: User;

    @HasOne(() => Order)
    order?: Order;

    @Column({ type: DataType.STRING(255), allowNull: true })
    avatar?: string;
  
    @Column({ type: DataType.STRING(255), allowNull: true })
    address?: string;
  
    @Column({ type: DataType.STRING(255), allowNull: true })
    city?: string;
  
    @Column({ type: DataType.STRING(255), allowNull: true })
    district?: string;
  
    @Column({ type: DataType.STRING(255), allowNull: true })
    ward?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    name?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    email?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    phone?: string;

    @Column({ type: DataType.STRING(255), allowNull: true })
    gender?: number

    @Column({ type: DataType.DATE, allowNull: true })   
    dateOfBirth?: Date;
}

export default Customer;