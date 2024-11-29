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


import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { IRoute } from '@core/interfaces';
import cors from "cors";
import path from 'path';
import { databaseSequelize } from '@core/config/databaseSequelize';
import UserConnection from 'modules/socket/userConnection';
import eventEmitterInstance from '@core/pubSub/pubSub';
import { HandleQueue } from 'modules/queue/service';
import SocketService from 'modules/socket/service';

class App {
    public app: express.Application;
    public server: http.Server;
    public io: Server;
    // private connectedEmployees: Record<string, string> = {};
    // private userConnection: Record<string, string> = {};
    // private customerConnection: Record<string, string> = {};
    private queue = new HandleQueue
    private socketService = SocketService.getInstance();

    constructor(routes?: IRoute[]) {
        this.app = express();
        this.eventEmitter();
        this.server = http.createServer(this.app);  // Ensure you create the HTTP server
        this.initialMiddlewares();
        this.io = new Server(this.server, {
            // cors: {
            //     origin: "http://localhost:3003",  // Set the allowed origin
            //     methods: ["GET", "POST"],
            // },
            cors: { origin: true, credentials: true },
        });
        this.setUpSocketIo();
        this.listen();
        routes ? this.initialRoutes(routes) : '';
        this.connectMySql();
        this.handleQueue();
    }

    // Setup Socket.IO connection
    private setUpSocketIo() {

        this.socketService.setSocketIo(this.io);

        this.io.on('connection', (socket) => {
            console.log('A user connected', socket.id);
            // Example of emitting an event to the client
            socket.emit('welcome', 'Welcome to the Socket.IO server!');

            socket.on('connected', (user: any) => {
                // UserConnection.connect(userId, socket.id);
                if (user != undefined && user.roleId == 2) {
                    console.log("User connected", user);
                    // this.connectedEmployees[user.id] = socket.id;
                    this.socketService.addEmployeeConnection(user.id, socket.id);
                }
            })

            socket.on('employee-login', (employeeId: string) => {
                // console.log('Employee logged in:', employeeId);
                // this.connectedEmployees[employeeId] = socket.id;
                // console.log('Employees connected:', this.connectedEmployees);
            })

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });

            socket.on('employeeConnected', (employeeId: string) => {
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
    public listen() {
        this.server.listen(process.env.PORT || 3001, () => {
            console.log(`Server is running on port ${process.env.PORT || 3001}`);
        });
    }
    private async initialRoutes(routes: IRoute[]) {
        // routes.forEach(route => {
        //     this.app.use(process.env.API_VERSION!, route.router, this.getConfig)
        // })
        routes.forEach(route => {
            this.app.use(process.env.API_VERSION!, route.router);
        });
    }
    private initialMiddlewares() {
        this.app.use(cors({ origin: true, credentials: true }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use('/uploads', express.static(path.resolve('uploads/')));
    }
    private connectMySql() {
        // database.connectDB();
        databaseSequelize.connect();
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
    private eventEmitter() {
        eventEmitterInstance.emit('appStarted');
    }
    private handleQueue() {
        const queue = new HandleQueue();
    }
}

export default App;
