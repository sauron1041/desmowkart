import { AuthService } from "./service";
import User from "../user/model"
import message from "@core/config/constants";
import { HttpException } from "@core/exceptions";
import { sendResponse } from "@core/utils";
import { Request, Response } from "express";
import ChangePasswordDto from "./dtos/changePassword.dto";
export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }
    public login = async (req: Request, res: Response) => {
        const model: User = req.body as any as User;
        try {
            const result = await this.authService.login(model as any);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.LOGIN_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.LOGIN_FAILED);
        }
    }
    public logout = async (req: Request, res: Response) => {
        const token: string = req.body.refreshToken as any;
        try {
            const result = await this.authService.logout(token);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.LOGOUT_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.LOGOUT_FAILED);
        }
    }
    public changePassword = async (req: Request, res: Response) => {
        const model: ChangePasswordDto = req.body;
        const id: number = req.id as any;
        model.id = id;
        try {
            const result = await this.authService.changePassword(model);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.CHANGE_PASSWORD_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.CHANGE_PASSWORD_FAILED);
        }
    }
    public refreshToken = async (req: Request, res: Response) => {
        const token: string = req.body.refreshToken as any;
        try {
            const result = await this.authService.refreshToken(token);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.REFRESH_TOKEN_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.REFRESH_TOKEN_FAILED);
        }
    }
}