import { Column, Model, DataType, Table } from 'sequelize-typescript';
@Table

export class Person extends Model {

    @Column({ type: DataType.STRING })
    name?: string;

    @Column({ type: DataType.STRING(10) })
    phone?: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    email?: string;

    @Column({ type: DataType.DATEONLY })
    dateOfBirth?: Date;

    @Column({ type: DataType.STRING(10) })
    gender?: string;
    
    @Column({ type: DataType.STRING })
    address?: string;
    
}