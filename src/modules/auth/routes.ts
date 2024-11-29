import { AuthController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware, errorMiddleware } from "@core/middleware";
import LoginDto from "./dtos/login.dto";
import ChangePasswordDto from "./dtos/changePassword.dto";

export class AuthRoute implements IRoute {
    public path = '/auth';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/login', errorMiddleware(LoginDto, 'body', false), this.authController.login);
        this.router.post(this.path + '/logout', AuthMiddleware.authorization, this.authController.logout);
        this.router.post(this.path + '/refresh-token', AuthMiddleware.authorization, this.authController.refreshToken);
        this.router.put(this.path + '/change-password', AuthMiddleware.authorization, errorMiddleware(ChangePasswordDto, 'body', false), this.authController.changePassword);
    }
}