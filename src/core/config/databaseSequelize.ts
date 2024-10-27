import { Sequelize } from 'sequelize-typescript';
import sequelize from './sequelize';

class Database {
  private sequelize: Sequelize;
    QueryTypes: any;

  constructor() {
    this.sequelize = sequelize;
  }

  // Phương thức kết nối cơ sở dữ liệu
  async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  // Phương thức để đồng bộ hóa các model với cơ sở dữ liệu
  async syncModels(): Promise<void> {
    try {
      // await this.sequelize.sync({ force: true }); // Đồng bộ model với DB, có thể dùng force: true để xóa bảng cũ
      await this.sequelize.sync({ alter: true }); // Đồng bộ model với DB, có thể dùng force: true để xóa bảng cũ
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error syncing models:', error);
    }
  }

  // Phương thức để đóng kết nối với cơ sở dữ liệu
  async close(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('Connection closed successfully.');
    } catch (error) {
      console.error('Error closing the connection:', error);
    }
  }

  // Phương thức để lấy ra đối tượng Sequelize
  getSequelize(): Sequelize {
    return this.sequelize;
  }

  // Phương thức để lấy ra đối tượng QueryTypes
  // getQueryTypes(): any {
  //   return this.sequelize.QueryTypes;
  // }

  // Phương thức để lấy ra đối tượng QueryTypes

  getQueryInterface(): any {
    return this.sequelize.getQueryInterface();
  }

  // Phương thức để lấy ra đối tượng QueryTypes

}

export const databaseSequelize = new Database();