import { HttpException } from "@core/exceptions";
import ServiceRequestHistory from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import ServiceRequestStatus from "modules/serviceRequest/interface";
import { ServiceRequestImageService } from "modules/serviceRequestImage/service";
import ServiceRequestImages from "modules/serviceRequestImage/model";

export class ServiceRequestHistoryService {
    private serviceRequestImageService = new ServiceRequestImageService();

    constructor() {
        this.serviceRequestImageService = new ServiceRequestImageService();
    }
    public create = async (model: Partial<ServiceRequestHistory>) => {
        try {
            // const check = await checkExistSequelize(ServiceRequestHistory, 'name', model.name!);
            // if (check) {
            //     return new HttpException(400, errorMessages.EXISTED, 'name');
            // }
            model.status != undefined ? model.status = model.status : model.status = ServiceRequestStatus.PENDING;
            const result = await ServiceRequestHistory.create(model);
            
            console.log(result);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            if(model.serviceRequestImages != undefined  ) {
                for (const image of model.serviceRequestImages) {
                    image.serviceRequestStatusHistoryId = result.id;
                    image.employeeId = model.userId;
                    await this.serviceRequestImageService.create(image);
                }
            }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public update = async (model: Partial<ServiceRequestHistory>, id: number) => {
        try {
            const check = await checkExistSequelize(ServiceRequestHistory, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await ServiceRequestHistory.update(model, {
                where: {
                    id: id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: {
                    id: result[0],
                    ...model
                }
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public delete = async (id: number) => {
        try {
            const check = await checkExistSequelize(ServiceRequestHistory, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await ServiceRequestHistory.update({ isRemoved: true }, {
                where: {
                    id: id
                }
            });
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public findAll = async (model: ServiceRequestHistory, search: Partial<ISearchAndPagination>) => {
        try {
            let result;
            const { page, limit, key, ...filteredModel } = model as any;
            const searchConditions: any = {
                [Op.and]: [{}, { ...filteredModel }]
            };

            if (key) {
                searchConditions[Op.and].push({
                    [Op.or]: [
                        { name: { [Op.like]: `%${key}%` } },
                        { phone: { [Op.like]: `%${key}%` } },
                    ]
                });
            }

            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                result = await ServiceRequestHistory.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                    limit: limitNumber,
                    offset: offset,
                });
            } else {
                result = await ServiceRequestHistory.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                });
            }

            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            return {
                data: result,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: result.length
                } : null
            };
        } catch (error) {
            console.log(error);

            return {
                error: error
            };
        }
    }
    public findOne = async (model: Partial<ServiceRequestHistory>) => {
        try {
            const result = await ServiceRequestHistory.findOne({
                where: model
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public updateStatus = async (id: number) => {
        const check = await checkExistSequelize(ServiceRequestHistory, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await ServiceRequestHistory.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(ServiceRequestHistory, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await ServiceRequestHistory.update({ status: status }, {
                    where: {
                        id: id
                    }
                });
            }
            return {
                data: ids
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public findById = async (id: number) => {
        try {
            const result = await checkExistSequelize(ServiceRequestHistory, 'id', id);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if(!result) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public deleteList = async (ids: number[]) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(ServiceRequestHistory, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await this.delete(id);
            }
            return {
                data: ids
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public findAllServiceRequestHistoryByServiceRequestId = async (serviceRequestId: number) => {
        try {
            console.log("serviceId", serviceRequestId);

            const result = await ServiceRequestHistory.findAll({
                where: {
                    serviceRequestId: serviceRequestId
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public checkStatusHistoryExist = async (serviceRequestId: number, status: ServiceRequestStatus, note?: string) => {
        try {
            const result = await ServiceRequestHistory.findOne({
                where: {
                    serviceRequestId: serviceRequestId,
                    status: status
                }
            });
            if (result == null) {
                return false
            }
            if (note && result.dataValues.note != note) {
                await this.update({ note: note }, result.dataValues.id);
            }
            return {
                data: result
            }
        } catch (error) {
            return error;
        }
    }

    public getStatusHistory = async (serviceRequestId: number) => {
        try {
            const result = await ServiceRequestHistory.findAll({
                where: { serviceRequestId },
                order: [['createdAt', 'DESC']],
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }

    public getStatusHistoryAndImagesList = async (serviceRequestId: number) => {
        try {
            const result = await ServiceRequestHistory.findAll({
                where: { serviceRequestId },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: ServiceRequestImages,
                        as: 'serviceRequestImages',
                        required: false,
                    }
                ]
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
}