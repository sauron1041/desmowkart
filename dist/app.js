"use strict";
// import { IRoute } from "@core/interfaces";
// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import helmet from "helmet";
// import hpp from "hpp";
// import errorMiddleware from "@core/middleware/error.middleware";
// import Logger from "@core/utils/logger";
// import path from "path";
// const multer = require('multer');
// import { glob } from "glob"
// // import database from "@core/config/database";
// import eventEmitterInstance from "@core/pubSub/pubSub";
// import { databaseSequelize } from "@core/config/databaseSequelize";
// import swaggerJsDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
// import { getMetadataStorage } from 'class-validator';
// import errorHandler from "@core/exceptions/error.handler";
// import { HandleQueue } from "modules/queue/service";
// import socketIo from "socket.io";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server } from 'socket.io';
// import http from 'http';
// class App {
//     public app: express.Application
//     public port: number | string
//     public production: boolean = process.env.NODE_ENV === 'production' ? true : false
//     public io: Server;
//     private connectedEmployees: Record<string, string> = {};
//     constructor(routes?: IRoute[]) {
//         this.app = express();
//         this.port = process.env.PORT || 3001;
//         this.readRootPathProject();
//         this.connectMySql();
//         this.initialMiddlewares()
//         routes ? this.initialRoutes(routes) : '';
//         this.initialErrorMidlleware()
//         // this.eventEmitter();
//         this.errorHandler();
//         this.queue();
//         this.io = new Server(http.createServer(this.app));
//     }
//     private async initialRoutes(routes: IRoute[]) {
//         // routes.forEach(route => {
//         //     this.app.use(process.env.API_VERSION!, route.router, this.getConfig)
//         // })
//         routes.forEach(route => {
//             this.app.use(process.env.API_VERSION!, route.router);
//         });
//     }
//     public listen() {
//         if (this.production) {
//         } else {
//             this.app.listen(this.port, () => {
//                 Logger.info(`Server is running on port ${this.port}`)
//             })
//         }
//     }
//     private initialMiddlewares() {
//         if (this.production) {
//             this.app.use(morgan('combined'))
//             this.app.use(cors({ origin: 'localhost:5173', credentials: true }))
//             this.app.use(helmet())
//             this.app.use(hpp())
//         } else {
//             this.app.use(morgan('dev'))
//             this.app.use(cors({ origin: true, credentials: true }))
//         }
//         this.app.use(express.json())
//         this.app.use(express.urlencoded({ extended: true }))
//         this.app.use('/uploads', express.static(path.resolve('uploads/')));
//     }
//     private initialErrorMidlleware() {
//         this.app.use(errorMiddleware);
//         this.app.use(multer().single('file'));
//     }
//     private connectMySql() {
//         // database.connectDB();
//         databaseSequelize.connect();
//         // databaseSequelize.syncModels();
//     }
//     private eventEmitter() {
//         console.log("eventEmitterInstance", eventEmitterInstance);
//         eventEmitterInstance.emit('appStarted');
//     }
//     private readRootPathProject = () => {
//     }
//     private queue() {
//         const queue = new HandleQueue()
//     }
//     public errorHandler() {
//         return errorHandler;
//     }
//     public setUpSocketIo() {
//     }
// }
// export default App;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const databaseSequelize_1 = require("@core/config/databaseSequelize");
const pubSub_1 = __importDefault(require("@core/pubSub/pubSub"));
const service_1 = require("modules/queue/service");
const service_2 = __importDefault(require("modules/socket/service"));
class App {
    constructor(routes, port) {
        // private connectedEmployees: Record<string, string> = {};
        // private userConnection: Record<string, string> = {};
        // private customerConnection: Record<string, string> = {};
        this.queue = new service_1.HandleQueue;
        this.socketService = service_2.default.getInstance();
        this.app = (0, express_1.default)();
        this.port = port;
        this.eventEmitter();
        this.server = http_1.default.createServer(this.app); // Ensure you create the HTTP server
        this.initialMiddlewares();
        this.io = new socket_io_1.Server(this.server, {
            // cors: {
            //     origin: "http://localhost:3003",  // Set the allowed origin
            //     methods: ["GET", "POST"],
            // },
            cors: { origin: true, credentials: true },
        });
        this.setUpSocketIo();
        // this.listen();
        routes ? this.initialRoutes(routes) : '';
        this.connectMySql();
        this.handleQueue();
    }
    envConfig() {
        const env = process.env.NODE_ENV || 'development';
        require('dotenv').config({ path: path_1.default.resolve(`.env_${env}`) });
        return env;
    }
    // Setup Socket.IO connection
    setUpSocketIo() {
        this.socketService.setSocketIo(this.io);
        this.io.on('connection', (socket) => {
            console.log('A user connected', socket.id);
            // Example of emitting an event to the client
            socket.emit('welcome', 'Welcome to the Socket.IO server!');
            socket.on('connected', (user) => {
                // UserConnection.connect(userId, socket.id);
                if (user != undefined && user.roleId == 2) {
                    console.log("User connected", user);
                    // this.connectedEmployees[user.id] = socket.id;
                    this.socketService.addEmployeeConnection(user.id, socket.id);
                }
            });
            socket.on('employee-login', (employeeId) => {
                // console.log('Employee logged in:', employeeId);
                // this.connectedEmployees[employeeId] = socket.id;
                // console.log('Employees connected:', this.connectedEmployees);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
            socket.on('employeeConnected', (employeeId) => {
                // this.connectedEmployees[employeeId] = socket.id;
                // console.log('Employees connected:', this.connectedEmployees);
            });
            // socket.on('sendNotification', (employeeId: string, message: string) => {
            //     const socketId = this.connectedEmployees[employeeId];
            //     if (socketId) {
            //         this.io.to(socketId).emit('notification', message);
            //     }
            // });
            // socket.on('disconnect', () => {
            //     for (const [id, socketId] of Object.entries(this.connectedEmployees)) {
            //         if (socketId === socket.id) {
            //             delete this.connectedEmployees[id]; // Xóa kết nối khỏi danh sách
            //             console.log(`Employee with ID ${id} disconnected.`);
            //             break;
            //         }
            //     }
            //     console.log('Updated connected employees:', this.connectedEmployees);
            // });
        });
    }
    // Start the express server
    listen() {
        this.server.listen(Number(process.env.PORT) || 10000, '0.0.0.0', () => {
            console.log(`Server is running on port ${process.env.PORT || 10000}`);
        });
    }
    initialRoutes(routes) {
        return __awaiter(this, void 0, void 0, function* () {
            // routes.forEach(route => {
            //     this.app.use(process.env.API_VERSION!, route.router, this.getConfig)
            // })
            routes.forEach(route => {
                this.app.use(process.env.API_VERSION, route.router);
            });
        });
    }
    initialMiddlewares() {
        this.app.use((0, cors_1.default)({ origin: true, credentials: true }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads/')));
    }
    connectMySql() {
        // database.connectDB();
        databaseSequelize_1.databaseSequelize.connect();
        // databaseSequelize.syncModels();
    }
    // public sendNotification(employeeId: number, message: string) {
    //     const socketId = this.connectedEmployees[employeeId];
    //     if (socketId) {
    //         this.io.to(socketId).emit('notification', message);
    //     }
    // }
    // public sendNewServiceRequestNotification(employeeId: number, message: string) {
    //     console.log("sendNewServiceRequestNotification", employeeId, message);
    //     const socketId = this.connectedEmployees[employeeId];
    //     if (socketId) {
    //         this.io.to(socketId).emit('newServiceRequest', message);
    //     }
    // }
    eventEmitter() {
        pubSub_1.default.emit('appStarted');
    }
    handleQueue() {
        const queue = new service_1.HandleQueue();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map