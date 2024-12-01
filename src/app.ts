import { IRoute } from "@core/interfaces";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import errorMiddleware from "@core/middleware/error.middleware";
import Logger from "@core/utils/logger";
import path from "path";
const multer = require('multer');
import { glob } from "glob"
// import database from "@core/config/database";
import eventEmitterInstance from "@core/pubSub/pubSub";
import { databaseSequelize } from "@core/config/databaseSequelize";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataStorage } from 'class-validator';
import errorHandler from "@core/exceptions/error.handler";

class App {
    public app: express.Application
    public port: number | string = 10000;
    public production: boolean = process.env.NODE_ENV === 'production' ? true : false
    public swaggerDocs: object;

    constructor(routes?: IRoute[]) {
        this.swaggerDocs = swaggerJsDoc(this.swaggerOptions);
        this.app = express();
        this.port = 10000
        this.readRootPathProject();
        this.connectMySql();
        this.initialMiddlewares()
        routes ? this.initialRoutes(routes) : '';
        this.initialErrorMidlleware()
        this.eventEmitter();
        this.errorHandler();
    }
    private async initialRoutes(routes: IRoute[]) {
        // routes.forEach(route => {
        //     this.app.use(process.env.API_VERSION!, route.router, this.getConfig)
        // })
        routes.forEach(route => {
            this.app.use(process.env.API_VERSION!, route.router);
        });
    }
    public listen() {
        if (this.production) {
        } else {
            this.app.listen(this.port, () => {
                Logger.info(`Server is running on port ${this.port}`)
            })
        }
    }
    private initialMiddlewares() {
        if (this.production) {
            this.app.use(morgan('combined'))
            this.app.use(cors({ origin: 'localhost:5173', credentials: true }))
            this.app.use(helmet())
            this.app.use(hpp())
        } else {
            this.app.use(morgan('dev'))
            this.app.use(cors({ origin: true, credentials: true }))
        }
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use('/uploads', express.static(path.resolve('uploads/')));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));
    }
    private initialErrorMidlleware() {
        this.app.use(errorMiddleware);
        this.app.use(multer().single('file'));
    }
    private connectMySql() {
        // database.connectDB();
        databaseSequelize.connect();
        // databaseSequelize.syncModels();
    }
    private eventEmitter() {
        eventEmitterInstance.emit('appStarted');
    }
    private readRootPathProject = () => {
    }

    private customValidationToSchema = () => {
        const schemas = validationMetadatasToSchemas({
            classValidatorMetadataStorage: getMetadataStorage(),
        });
        Object.keys(schemas).forEach(schemaKey => {
            const schema = schemas[schemaKey];
            if (schema.properties) {
                Object.keys(schema.properties).forEach(propKey => {
                    const prop = schema.properties![propKey]
                    if ('required' in prop && !prop.required) {
                        (prop as any).required = []
                    }
                });
            }
        });

        return schemas;
    };

    public swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Documentation',
                version: '1.0.0',
                description: 'API cho ứng dụng Node.js sử dụng Sequelize và Swagger',
            },
            servers: [
                {
                    url: 'http://localhost:8080/api/v1',
                },
            ],
            components: {
                // schemas: {
                //     ...validationMetadatasToSchemas({
                //         classValidatorMetadataStorage: getMetadataStorage(),
                //     }),
                // },
                schemas: {
                    ...this.customValidationToSchema(),
                },

            },
        },
        apis: ["./src/modules/**/routes.ts", "./src/modules/**/dtos/**.ts", "./src/modules/**/model.ts"],
        paths: {}


    }
    public getConfig() {
        return this.swaggerOptions;
    }
    public errorHandler() {
        return errorHandler;
    }
}

export default App;