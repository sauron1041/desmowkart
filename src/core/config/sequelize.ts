// import { Sequelize } from 'sequelize-typescript';
// import { Dialect } from 'sequelize';
// import dotenv from 'dotenv';

// import User from 'modules/user/model';
// import Service from 'modules/service/model';
// import Token from 'modules/token/model';
// import Branch from 'modules/branch/model';
// import Category from 'modules/category/model';
// import Customer from 'modules/customer/model';
// import Employee from 'modules/employee/model';
// import MembershipLevel from 'modules/membershipLevel/model';
// import Appointment from 'modules/appointment/model';
// import ServiceRequest from 'modules/serviceRequest/model';
// import ServiceRequestImage from 'modules/serviceRequestImage/model';
// import Feedback from 'modules/feedback/model';
// import ServiceRequestStatusHistory from 'modules/serviceRequestHistory/model';
// import Order from 'modules/order/model';
// import OrderDetail from 'modules/orderDetail/model';
// import Payment from 'modules/payment/model';

// import EmployeeStatus from 'modules/EmployeeStatus/model';
// import Skill from 'modules/skill/model';
// import EmployeeSkill from 'modules/employeeSkill/model';
// import ServiceSkill from 'modules/serviceSkill/model';

// dotenv.config();

// interface IDatabaseConfig {
//     username: string;
//     password: string;
//     database: string;
//     host: string;
//     dialect: Dialect;
// }

// const dbConfig: IDatabaseConfig = {
//     username: process.env.DB_USERNAME || 'root',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME || 'my_database',
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
// };

// class Database {
//     private static instance: Sequelize;

//     private constructor() { } // Private constructor to prevent direct instantiation

//     public static getInstance(): Sequelize {
//         if (!Database.instance) {
//             Database.instance = new Sequelize({
//                 username: dbConfig.username,
//                 password: dbConfig.password,
//                 database: dbConfig.database,
//                 host: dbConfig.host,
//                 dialect: dbConfig.dialect,
//                 models: [
//                     User, Customer, Employee, Token, Branch, Category, Service, MembershipLevel, Appointment,
//                     ServiceRequest, ServiceRequestStatusHistory, ServiceRequestImage, Feedback, Order,
//                     OrderDetail, Payment, Skill, EmployeeStatus, EmployeeSkill, ServiceSkill
//                 ],
//                 // logging: console.log,
//             });

//             // Optional: Test connection
//             Database.instance.authenticate()
//                 .then(() => console.log('Database connected successfully.'))
//                 .catch((err) => console.error('Unable to connect to the database:', err));
//         }

//         return Database.instance;
//     }
// }

// export default Database.getInstance();



import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import User from 'modules/user/model';
import Service from 'modules/service/model';
import Token from 'modules/token/model';
import Branch from 'modules/branch/model';
import Category from 'modules/category/model';
import Customer from 'modules/customer/model';
import Employee from 'modules/employee/model';
import MembershipLevel from 'modules/membershipLevel/model';
import Appointment from 'modules/appointment/model';
import ServiceRequest from 'modules/serviceRequest/model';
import ServiceRequestImage from 'modules/serviceRequestImage/model';
import Feedback from 'modules/feedback/model';
import ServiceRequestStatusHistory from 'modules/serviceRequestHistory/model';
import Order from '@modules/order/model';
import OrderDetail from 'modules/orderDetail/model';
import Payment from 'modules/payment/model';
import EmployeeStatus from 'modules/employeeStatus/model';
import Skill from 'modules/skill/model';
import EmployeeSkill from 'modules/employeeSkill/model';
import ServiceSkill from 'modules/serviceSkill/model';

dotenv.config();

interface IDatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    port: number;
    dialect: Dialect;
    ssl: boolean;
}

const dbConfig: IDatabaseConfig = {
    username: process.env.DB_USERNAME || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_cPts5ZwTubT3zrn3s68',
    database: process.env.DB_NAME || 'defaultdb',
    host: process.env.DB_HOST || 'mysql-3dfd2c1e-tranminhthuan1268-b6c3.c.aivencloud.com',
    port: parseInt(process.env.DB_PORT || '12706'),
    dialect: 'mysql',
    ssl: process.env.DB_SSL === 'true',
};

class Database {
    private static instance: Sequelize;

    private constructor() {} // Private constructor to prevent direct instantiation

    public static getInstance(): Sequelize {
        if (!Database.instance) {
            Database.instance = new Sequelize({
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
                host: dbConfig.host,
                port: dbConfig.port,
                dialect: dbConfig.dialect,
                models: [
                    User, Customer, Employee, Token, Branch, Category, Service, MembershipLevel, Appointment,
                    ServiceRequest, ServiceRequestStatusHistory, ServiceRequestImage, Feedback, Order,
                    OrderDetail, Payment, Skill, EmployeeStatus, EmployeeSkill, ServiceSkill,
                ],
                dialectOptions: dbConfig.ssl
                    ? {
                          ssl: {
                              require: true,
                              rejectUnauthorized: false,
                              ca: fs.readFileSync(path.resolve(__dirname, "../../../ca.pem")),
                          },
                      }
                    : {},
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 60000,
                    idle: 10000,
                },
                logging: console.log,
            });

            // Optional: Test connection
            Database.instance.authenticate()
                .then(() => console.log('Database connected successfully.'))
                .catch((err) => console.error('Unable to connect to the database:', err));
        }

        return Database.instance;
    }
}

export default Database.getInstance();