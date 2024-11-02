import Logger from "@core/utils/logger";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
class Database {
    private pool: mysql.Pool | null = null;

    async connectDB() {
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT, DB_PORT } = process.env;
        try {
            this.pool = mysql.createPool({
                host: DB_HOST,
                user: DB_USER,
                port: DB_PORT ? parseInt(DB_PORT) : 3306,
                password: DB_PASSWORD,
                database: DB_NAME,
                waitForConnections: true,
                // connectionLimit: DB_CONNECTION_LIMIT ? parseInt(DB_CONNECTION_LIMIT) : 10,
                connectTimeout: 60000,
                queueLimit: 0,
                // ssl: {
                //     ca: fs.readFileSync(path.resolve(__dirname, "../../../ca.pem"))
                // }
            }
            );
            await this.getConnection()
            Logger.info("Connected to DB successfully");
        } catch (error) {
            Logger.error("Failed to connect to DB", error);
            throw error;
        }
    }
    async getConnection() {
        if (this.pool)
            return await this.pool.getConnection();
        throw new Error("get connection failed");
    }
    async closeConnection(connection: mysql.PoolConnection) {
        try {
            if (connection) {
                connection.release();
            }
        } catch (error) {
            Logger.error("close connection failed");
            throw error;
        }
    }
    async executeQuery(query: string, params?: any[]) {
        let connection: mysql.PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            const [results] = await connection.execute(query, params);
            return results;
        } catch (error) {
            Logger.error("execute query failed", error);
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }
    // async query(query: string, params?: any[]) {
    //     let connection: mysql.PoolConnection | null = null;
    //     try {
    //         connection = await this.getConnection();
    //         const [results] = await connection.query(query, params);
    //         return results;
    //     } catch (error) {
    //         Logger.error("query failed");
    //         throw error;
    //     } finally {
    //         if (connection) {
    //             await this.closeConnection(connection);
    //         }
    //     }
    // }
    async queryOne(query: string, params?: any[]) {
        let connection: mysql.PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            const result = await connection.query(query, params);
            return result
        } catch (error) {
            Logger.error("query one failed");
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }
    async beginTransaction() {
        let connection: mysql.PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            await connection.beginTransaction();
            return connection;
        } catch (error) {
            Logger.error("begin transaction failed");
            throw error;
        }
    }
    async commitTransaction(connection: mysql.PoolConnection) {
        try {
            await connection.commit();
        } catch (error) {
            Logger.error("commit transaction failed");
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }
    async rollbackTransaction(connection: mysql.PoolConnection) {
        try {
            await connection.rollback();
        } catch (error) {
            Logger.error("rollback transaction failed");
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }
    async  createTransaction() {
        let connection: mysql.PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            await connection.beginTransaction();
            return connection;
        } catch (error) {
            Logger.error("create transaction failed");
            throw error;
        }
    }
    async endTransaction(connection: mysql.PoolConnection) {
        try {
            await connection.commit();
        } catch (error) {
            Logger.error("end transaction failed");
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }
    async transaction(connection: mysql.PoolConnection, query: string, params?: any[]) {
        try {
            await connection.query(query, params);
        } catch (error) {
            Logger.error("transaction failed");
            throw error;
        }
    }
    // const result = await sequelize.query(
    //     `SELECT * FROM orders WHERE id IN (SELECT orderId FROM orderDetails WHERE id = ${orderDetailId})`,
    //     { type: sequelize.QueryTypes.SELECT }
    
    async query(query: string, params?: any[]) {
        let connection: mysql.PoolConnection | null = null;
        try {
            connection = await this.getConnection();
            const [results] = await connection.query(query, params);
            return results;
        } catch (error) {
            Logger.error("query failed");
            throw error;
        } finally {
            if (connection) {
                await this.closeConnection(connection);
            }
        }
    }

}

export default new Database();
