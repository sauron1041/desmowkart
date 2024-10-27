import { HttpException } from "@core/exceptions";
import User from "../user/model";
import errorMessages from "@core/config/constants";
import { checkExistSequelize } from "@core/utils/checkExist";
import jwt from 'jsonwebtoken';
import { TokenService } from "modules/token/service";
import bcryptjs from 'bcryptjs';
import ChangePasswordDto from "./dtos/changePassword.dto";

export class AuthService {
    private tokenService: TokenService;
    constructor() {
        this.tokenService = new TokenService();
    }
    public login = async (model: Partial<User>) => {
        try {
            let checkPhone;
            let checkUsername;
            if (model.username != undefined) {
                checkUsername = await checkExistSequelize(User, 'username', model.username!);
            }
            if (model.phone != undefined) {
                checkPhone = await checkExistSequelize(User, 'phone', model.phone!);
            }
            if (!checkUsername && !checkPhone && model.username != undefined || model.phone != undefined) {
                return new HttpException(404, errorMessages.ACCOUNT_NOT_EXISTED, 'username');
            }
            const user = checkUsername ? checkUsername : checkPhone;
            const id: number = user.dataValues.id;

            const validPassword = user && await bcryptjs.compare(model.password!, user.dataValues.password!);
            if (!validPassword) {
                return new HttpException(400, errorMessages.PASSWORD_INCORRECT, 'password');
            }
            const accessToken = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
            const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
            await this.tokenService.create({ token: refreshToken, userId: id });
            delete user.dataValues.password;
            return {
                data: {
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            }
        } catch (error) {
            return error;
        }
    }
    public logout = async (token: string) => {
        try {
            const result = await this.tokenService.deleteByToken(token);
            if (result instanceof Error) {
                return new HttpException(400, errorMessages.LOGOUT_FAILED);
            }
            return
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public changePassword = async (model: ChangePasswordDto) => {
        try {
            const user = await checkExistSequelize(User, 'id', model.id!);
            if (!user) {
                return new HttpException(404, errorMessages.NOT_EXISTED, 'id');
            }
            const validPassword = user && await bcryptjs.compare(model.password!, user.dataValues.password!);
            if (!validPassword) {
                return new HttpException(400, errorMessages.PASSWORD_INCORRECT, 'password');
            }
            const hashedNewPassword = await bcryptjs.hash(model.newPassword!, 10);
            const result = await User.update({ password: hashedNewPassword }, {
                where: {
                    id: model.id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, errorMessages.UPDATE_FAILED);
            }
            return
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public refreshToken = async (refreshToken: string) => {
        try {
            const check = await this.tokenService.findOne({ token: refreshToken });
            if (!check) {
                return new HttpException(404, errorMessages.NOT_EXISTED, 'token');
            } else {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: number };
                if (!decoded) {
                    return new HttpException(400, errorMessages.REFRESH_TOKEN_FAILED);
                } else {
                    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN });
                    return {
                        data: {
                            accessToken: accessToken
                        }
                    }
                }
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
}