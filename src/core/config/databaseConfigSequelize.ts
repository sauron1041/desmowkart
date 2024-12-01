import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface IDatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    port: number;
    ssl: boolean;
}

const dbConfig: IDatabaseConfig = {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    ssl: true,
};

class Database {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize({
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            pool: {
                max: 10,
                min: 0,
                acquire: 60000,
                idle: 10000,
            },
            logging: console.log,
            // dialectOptions: dbConfig.ssl
            //     ? {
            //           ssl: {
            //               require: true,
            //               rejectUnauthorized: false,
            //               ca: fs.readFileSync(path.resolve(__dirname, "../../../ca.pem")),
            //           },
            //           connectTimeout: 60000,
            //       }
            //     : {
            //           connectTimeout: 60000,
            //       },
        });
    }

    async closeConnection() {
        try {
            await this.sequelize.close();
        } catch (error) {
            console.error('Error closing the connection:', error);
            throw error;
        }
    }

    async executeQuery(query: string, params?: any[]) {
        try {
            const [results] = await this.sequelize.query(query, { replacements: params });
            return results;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async queryOne(query: string, params?: any[]) {
        try {
            const [results] = await this.sequelize.query(query, { replacements: params });
            return results[0] || null;
        } catch (error) {
            console.error('Error executing single query:', error);
            throw error;
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}

export default new Database();