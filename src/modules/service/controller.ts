import { Create } from "dtos/user/create.dto";
import { ServiceService } from "./service";
import User from "./model";
import message from "@core/config/constants";
import { HttpException } from "@core/exceptions";
import { sendResponse } from "@core/utils";
import { Request, Response } from "express";
import { ISearchAndPagination } from "@core/types/express";
export class ServiceController {
    private serviceService: ServiceService;
    constructor() {
        this.serviceService = new ServiceService();
    }
    public create = async (req: Request, res: Response) => {
        const model: User = req.body as any as User;
        try {
            const result = await this.serviceService.create(model);
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
        const model: User = req.body as any as User;
        const id: number = req.params.id as any;
        try {
            const result = await this.serviceService.update(model, id);
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
            const result = await this.serviceService.delete(id);
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
            const model: User = req.query as any as User;
            const search: ISearchAndPagination = req.query as any as ISearchAndPagination;
            const result = await this.serviceService.findAll(model, search);
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
            const result = await this.serviceService.findById(id);
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
            const model: User = req.query as any as User;
            const result = await this.serviceService.findOne(model);
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
            const result = await this.serviceService.updateStatus(id);
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
            const result = await this.serviceService.updateListStatus(ids, status);
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
            const result = await this.serviceService.deleteList(ids);
            if (result instanceof HttpException) {
                return sendResponse(res, result.status, result.message);
            }
            return sendResponse(res, 200, message.DELETE_SUCCESS, result);
        } catch (error) {
            return new HttpException(500, message.DELETE_FAILED);
        }
    }
}