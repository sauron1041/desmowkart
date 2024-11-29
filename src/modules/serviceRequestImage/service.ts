import { HttpException } from "@core/exceptions";
import ServiceRequestImage from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import { CloudDinaryService } from "modules/cloudinary/service";

export class ServiceRequestImageService {
    private cloudinaryService = new CloudDinaryService();
    private folder = 'serviceRequestImage';

    // model: Partial<Skill & { note?: string }

    public create = async (model: Partial<ServiceRequestImage & {image?: any}>) => {
        // id, imageUrl, description, status, customerId, employeeId, uploadedAt, isRemoved, serviceRequestStatusHistoryId, createdAt, updatedAt
        
        // public create = async (model: Partial<ServiceRequestImage & {image?: any, serviceRequestCode?: string}>) => {
        try {
            let nameImage : string = '';
            // if (model.serviceId != undefined && model.customerId != undefined && model.serviceId != undefined && model.image != undefined && model.status != undefined) {
            //     nameImage = model.serviceId + '-' + model.customerId + '-' + model.serviceId + '-' + model.image + '-' + model.status + '-' + new Date().getTime() + '.png'
            // }
            if (model.image) {
                const image = model.image
                const url = await this.cloudinaryService.uploadSessionImageToCloud(image, this.folder, nameImage);
                
                if (url instanceof Error) {
                    return new HttpException(400, url.message);
                }
                model.imageUrl = (url as any).url as string;
            } 
            const result = await ServiceRequestImage.create(model);
            console.log(result);
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
    public update = async (model: Partial<ServiceRequestImage>, id: number) => {
        try {
            const check = await checkExistSequelize(ServiceRequestImage, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await ServiceRequestImage.update(model, {
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
            const check = await checkExistSequelize(ServiceRequestImage, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await ServiceRequestImage.update({ isRemoved: true }, {
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
    public findAll = async (model: ServiceRequestImage, search: Partial<ISearchAndPagination>) => {
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
                result = await ServiceRequestImage.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                    limit: limitNumber,
                    offset: offset,
                });
            } else {
                result = await ServiceRequestImage.findAll({
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
    public findOne = async (model: Partial<ServiceRequestImage>) => {
        try {
            const result = await ServiceRequestImage.findOne({
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
        const check = await checkExistSequelize(ServiceRequestImage, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await ServiceRequestImage.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(ServiceRequestImage, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await ServiceRequestImage.update({ status: status }, {
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
            const result = await checkExistSequelize(ServiceRequestImage, 'id', id);
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
                const check = await checkExistSequelize(ServiceRequestImage, 'id', id);
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
    public findAllServiceRequestImageByServiceId = async (serviceId: number) => {
        try {
            console.log("serviceId", serviceId);
            
            const result = await ServiceRequestImage.findAll({
                where: {
                    serviceId: serviceId
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
}