import { HttpException } from "@core/exceptions";
import Skill from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op, Sequelize, where } from 'sequelize';
import { ServiceRequestHistoryService } from "modules/serviceRequestHistory/service";
import ServiceRequestHistoryModel from "modules/serviceRequestHistory/model";
import { RowDataPacket } from "mysql2";
import ServiceRequestStatus from "./interface";
import { generateCodePrefixChar } from "@core/utils/gennerate.code";
import ServiceRequestImages from "modules/serviceRequestImage/model";

export class ServiceRequestService {
    // private static instance: ServiceRequestService;

    // private serviceRequestHistoryService: ServiceRequestHistoryService = ServiceRequestHistoryService.Instance;
    private serviceRequestHistoryService: ServiceRequestHistoryService = new ServiceRequestHistoryService()

    // public static get Instance() {
    //     if (!this.instance) {
    //         this.instance = new ServiceRequestService();
    //     }

    //     return this.instance;
    // }
    // private constructor() { }
    public create = async (model: Partial<Skill>) => {
        try {
            model.currentStatus != undefined ? model.currentStatus = model.currentStatus : model.currentStatus = ServiceRequestStatus.PENDING;
            model.code = await generateCodePrefixChar('ServiceRequests', 'YC', 8);
            const result = await Skill.create(model);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            const serviceRequestHistory = {
                status: model.currentStatus,
                userId: model.userId,
                serviceRequestId: (result as RowDataPacket).id
            }
            await this.serviceRequestHistoryService.create(serviceRequestHistory)
            // if(model.currentStatus === ServiceRequestStatus.APPROVED) {
            //     // send notification to user
            // }
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public update = async (model: Partial<Skill & { note?: string }>, id: number) => {
        try {
            const check = await checkExistSequelize(Skill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Skill.update(model, {
                where: {
                    id: id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if (model.currentStatus != undefined) {
                const checkStatusHistoryExist = await this.serviceRequestHistoryService.checkStatusHistoryExist(id, model.currentStatus, model.note!);
                if (!checkStatusHistoryExist) {
                    const serviceRequestHistory = {
                        status: model.currentStatus,
                        userId: model.userId,
                        serviceRequestId: id,
                        note: model.note
                    }
                    await this.serviceRequestHistoryService.create(serviceRequestHistory)
                }
            }
            return {
                data: {
                    ...check.dataValues,
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
            const check = await checkExistSequelize(Skill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Skill.update({ isRemoved: true }, {
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
    public findAll = async (model: Skill, search: Partial<ISearchAndPagination>) => {
        console.log("model", model);

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

            const options: any = {
                where: searchConditions,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: ServiceRequestHistoryModel,
                        as: 'statusHistory',
                        required: false,
                        // order: [
                        //     // ['createdAt', 'DESC'],
                        //     ['id', 'DESC']
                        // ],
                        // images
                        include: [
                            {
                                model: ServiceRequestImages,
                                as: 'serviceRequestImages',
                                required: false,
                                where: {
                                    status: {
                                        [Op.eq]: Sequelize.col('statusHistory.status')
                                    }
                                }
                            }
                        ]
                    },

                ]
            }

            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                // result = await Skill.findAll({
                //     where: searchConditions,
                //     limit: limitNumber,
                //     offset: offset,
                // });
                options.limit = limitNumber;
                options.offset = offset;

                // result = await Skill.findAll(options);
            }
            //  else {
            //     // result = await Skill.findAll({
            //     //     where: searchConditions,
            //     // });
            //     result = await Skill.findAll(options);
            // }
            result = await Skill.findAll(options);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            // find all service request history
            // for (const item of result) {
            //     const serviceRequestHistories = await this.serviceRequestHistoryService.findAllServiceRequestHistoryByServiceRequestId((item as RowDataPacket).id as number);
            //     console.log('serviceRequestHistories', serviceRequestHistories);

            //     item.setDataValue('serviceRequestHistories', (serviceRequestHistories as RowDataPacket).data);
            // }

            for (const item of result) {
                const statusHistory = item.getDataValue('statusHistory');
                // sap xep
                statusHistory.sort((a: any, b: any) => {
                    return b.createdAt - a.createdAt;
                });
                item.setDataValue('statusHistory', statusHistory);
            }
            const count = await Skill.count({
                where: options.where
            });

            return {
                data: result,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: result.length,
                    totalPages: Math.ceil(count / Number(search.limit)),
                } : null
            };
        } catch (error) {
            console.log(error);

            return {
                error: error
            };
        }
    }
    public findOne = async (model: Partial<Skill>) => {
        try {
            const result = await Skill.findOne({
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
        const check = await checkExistSequelize(Skill, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await Skill.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Skill, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await Skill.update({ status: status }, {
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
            const result = await checkExistSequelize(Skill, 'id', id);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if (!result) {
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
                const check = await checkExistSequelize(Skill, 'id', id);
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
}