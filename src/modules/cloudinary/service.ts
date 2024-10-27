import { HttpException } from "@core/exceptions";
import ServiceRequestHistory from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import streamifier from "streamifier";
import cloudinary from "@core/config/cloudinaryConfig";
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from "mysql2";

export class CloudDinaryService {
    public create = async (model: Partial<ServiceRequestHistory>) => {
        try {
            // const check = await checkExistSequelize(ServiceRequestHistory, 'name', model.name!);
            // if (check) {
            //     return new HttpException(400, errorMessages.EXISTED, 'name');
            // }
            const result = await ServiceRequestHistory.create(model);
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
                data: result
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
                    limit: limitNumber,
                    offset: offset,
                });
            } else {
                result = await ServiceRequestHistory.findAll({
                    where: searchConditions,
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
    public findAllServiceRequestHistoryByServiceId = async (serviceId: number) => {
        try {
            console.log("serviceId", serviceId);

            const result = await ServiceRequestHistory.findAll({
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
    public uploadImage = (file: Express.Multer.File, folder: string, name: string) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    public_id: name,
                    allowed_formats: ['jpg', 'png', 'jpeg']
                },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        })
    }

    public uploadImageCloud = async (file: Express.Multer.File) => {
        const name = uuidv4();
        const folder = 'uploadtest';

        const multerMiddleware = this.uploadImage(file, folder, name);
        console.log('multerMiddleware', multerMiddleware);

        return multerMiddleware;
    }
    public uploadSessionImageToCloud = async (file: Express.Multer.File, folder: string, name: string) => {
        name = uuidv4()+ new Date().getTime();
        // const folder = 'uploadtest';

        const multerMiddleware =  await this.uploadImage(file, folder, name);
        console.log('multerMiddleware', multerMiddleware);

        // let url = (multerMiddleware as RowDataPacket).then((result: any) => {
        //     return {
        //         url: result.secure_url
        //     }
        // });
        if(multerMiddleware instanceof Error) {
            return false;
        }
        let data = {
            url: (multerMiddleware as any).secure_url
        }

        return data;
        // return multerMiddleware
    }
}