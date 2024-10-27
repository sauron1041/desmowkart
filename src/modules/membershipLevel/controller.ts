import { Create } from "dtos/user/create.dto";
import { MembershipLevelService } from "./service";
import { MembershipLevel } from "./model";
import message from "@core/config/constants";
import { HttpException } from "@core/exceptions";
import { sendResponse } from "@core/utils";
import { Request, Response } from "express";
import { ISearchAndPagination } from "@core/types/express";
export class MembershipLevelController {
    private userService: MembershipLevelService;
    constructor() {
        this.userService = new MembershipLevelService();
    }
    public create = async (req: Request, res: Response) => {
        const model: MembershipLevel = req.body as any as MembershipLevel;
        try {
            const result = await this.userService.create(model);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.CREATE_SUCCESS, result);

        } catch (error) {
            return new HttpException(500, message.CREATE_FAILED);
        }
    }
    public update = async (req: Request, res: Response) => {
        const model: MembershipLevel = req.body as any as MembershipLevel;
        const id: number = req.params.id as any;
        try {
            const result = await this.userService.update(model, id);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.UPDATE_FAILED);
        }
    }
    public delete = async (req: Request, res: Response) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.userService.delete(id);
            if (result instanceof HttpException && result.field) {
                return sendResponse(res, result.status, result.message, null, result.field);
            }
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.DELETE_FAILED);
        }
    }
    public findAll = async (req: Request, res: Response) => {
        try {
            const model: MembershipLevel = req.query as any as MembershipLevel;
            const search: ISearchAndPagination = req.query as any as ISearchAndPagination;
            const result = await this.userService.findAll(model, search);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.FIND_ALL_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.FIND_ALL_FAILED);
        }
    }
    public findById = async (req: Request, res: Response) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.userService.findById(id);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.FIND_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.FIND_FAILED);
        }
    }
    public findOne = async (req: Request, res: Response) => {
        try {
            const model: MembershipLevel = req.query as any as MembershipLevel;
            const result = await this.userService.findOne(model);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.FIND_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.FIND_FAILED);
        }
    }
    public updateStatus = async (req: Request, res: Response) => {
        const id: number = req.params.id as any;
        try {
            const result = await this.userService.updateStatus(id);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.UPDATE_FAILED);
        }
    }
    public updateListStatus = async (req: Request, res: Response) => {
        const ids: number[] = req.body.ids as any;
        const status: boolean = req.body.status as any;
        try {
            const result = await this.userService.updateListStatus(ids, status);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.UPDATE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.UPDATE_FAILED);
        }
    }
    public deleteList = async (req: Request, res: Response) => {
        const ids: number[] = req.body.ids as any;
        try {
            const result = await this.userService.deleteList(ids);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.DELETE_FAILED);
        }
    }
}