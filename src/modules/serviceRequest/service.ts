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
import AppointmentModel from "modules/appointment/model";
import CustomerModel from "modules/customer/model";
import EmployeeModel from "modules/employee/model";
import eventEmitterInstance from "@core/pubSub/pubSub";
import { EmployeeSkillService } from "modules/employeeSkill/service";
import { EmployeeStatusService } from "modules/employeeStatus/service";
import { getEmployeesForService } from "modules/handle/handleSkills";
import { off } from "process";
import ServiceRequestDto from "./dtos/create";
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
    private employeeSkillService: EmployeeSkillService = new EmployeeSkillService();
    private employeeStatusService: EmployeeStatusService = new EmployeeStatusService();
    public constructor() {
        this.listenToEvent();
    }
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

            //emit event
            console.log("emit even11111t");

            const serviceRequestId = (result as RowDataPacket).id;
            eventEmitterInstance.emit('NEW_SERVICE_REQUEST', {
                serviceRequestId
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
    // public update = async (model: Partial<Skill & { note?: string }>, id: number) => {
    //     try {
    //         const check = await checkExistSequelize(Skill, 'id', id);
    //         if (!check) {
    //             return new HttpException(404, errorMessages.NOT_FOUND, 'id');
    //         }
    //         const result = await Skill.update(model, {
    //             where: {
    //                 id: id
    //             }
    //         });
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }
    //         if (model.currentStatus != undefined) {
    //             const checkStatusHistoryExist = await this.serviceRequestHistoryService.checkStatusHistoryExist(id, model.currentStatus, model.note!);
    //             if (!checkStatusHistoryExist) {
    //                 const serviceRequestHistory = {
    //                     status: model.currentStatus,
    //                     userId: model.userId,
    //                     serviceRequestId: id,
    //                     note: model.note
    //                 }
    //                 await this.serviceRequestHistoryService.create(serviceRequestHistory)
    //             }
    //         }
    //         return {
    //             data: {
    //                 ...check.dataValues,
    //                 ...model
    //             }
    //         }
    //     } catch (error) {
    //         return {
    //             error: error
    //         }
    //     }
    // }
    public createUpdate = async (model: Partial<ServiceRequestDto>, id: number) => {
        // id, code, appointmentId, currentStatus, checkInTime, completedTime, userId, createdAt, updatedAt, isRemoved, branchId, employeeId
        try {
            // const result = await Skill.create(model);
            // if (result instanceof Error) {
            //     return new HttpException(400, result.message);
            // }

            const check = await checkExistSequelize(Skill, 'id', id);

            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }

            if (model.statusHistory != undefined) {
                for (const item of model.statusHistory) {
                    item.serviceRequestId = check.id;
                    await this.serviceRequestHistoryService.createUpdate(item);
                }
            }

        } catch (error) {

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

    // public findAllUpdate = async (model: Skill, search: Partial<ISearchAndPagination>) => {
    //     console.log("model", model);

    //     try {
    //         let result;
    //         const { page, limit, key, ...filteredModel } = model as any;
    //         const searchConditions: any = {
    //             [Op.and]: [{}, { ...filteredModel }]
    //         };

    //         if (key) {
    //             searchConditions[Op.and].push({
    //                 [Op.or]: [
    //                     { name: { [Op.like]: `%${key}%` } },
    //                     { phone: { [Op.like]: `%${key}%` } },
    //                 ]
    //             });
    //         }

    //         const options: any = {
    //             where: searchConditions,
    //             order: [['id', 'DESC']],
    //             include: [
    //                 {
    //                     model: AppointmentModel,
    //                     as: 'appointment',
    //                     required: false,
    //                     attributes: ['id', 'code', 'customerId'],
    //                     include: [
    //                         {
    //                             model: CustomerModel,
    //                             as: 'customer',
    //                             required: false,
    //                             attributes: ['id', 'code', 'name', 'phone', 'email']
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     model: ServiceRequestHistoryModel,
    //                     as: 'statusHistory',
    //                     required: false,
    //                     // order: [
    //                     //     // ['createdAt', 'DESC'],
    //                     //     ['id', 'DESC']
    //                     // ],
    //                     // images
    //                     include: [
    //                         {
    //                             model: ServiceRequestImages,
    //                             as: 'serviceRequestImages',
    //                             required: false,
    //                             where: {
    //                                 status: {
    //                                     [Op.eq]: Sequelize.col('statusHistory.status')
    //                                 }
    //                             }
    //                         }
    //                     ]
    //                 },

    //             ]
    //         }

    //         if (search.page && search.limit) {
    //             const pageNumber = parseInt(search.page.toString(), 10);
    //             const limitNumber = parseInt(search.limit.toString(), 10);
    //             const offset = (pageNumber - 1) * limitNumber;
    //             // result = await Skill.findAll({
    //             //     where: searchConditions,
    //             //     limit: limitNumber,
    //             //     offset: offset,
    //             // });
    //             options.limit = limitNumber;
    //             options.offset = offset;

    //             // result = await Skill.findAll(options);
    //         }
    //         //  else {
    //         //     // result = await Skill.findAll({
    //         //     //     where: searchConditions,
    //         //     // });
    //         //     result = await Skill.findAll(options);
    //         // }
    //         result = await Skill.findAll(options);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }

    //         // find all service request history
    //         // for (const item of result) {
    //         //     const serviceRequestHistories = await this.serviceRequestHistoryService.findAllServiceRequestHistoryByServiceRequestId((item as RowDataPacket).id as number);
    //         //     console.log('serviceRequestHistories', serviceRequestHistories);

    //         //     item.setDataValue('serviceRequestHistories', (serviceRequestHistories as RowDataPacket).data);
    //         // }

    //         for (const item of result) {
    //             const statusHistory = item.getDataValue('statusHistory');
    //             // sap xep
    //             statusHistory.sort((a: any, b: any) => {
    //                 return b.createdAt - a.createdAt;
    //             });
    //             item.setDataValue('statusHistory', statusHistory);
    //         }
    //         const count = await Skill.count({
    //             where: options.where
    //         });

    //         return {
    //             data: result,
    //             pagination: search.page && search.limit ? {
    //                 page: Number(search.page),
    //                 limit: Number(search.limit),
    //                 totalRecords: result.length,
    //                 totalPages: Math.ceil(count / Number(search.limit)),
    //             } : null
    //         };
    //     } catch (error) {
    //         console.log(error);

    //         return {
    //             error: error
    //         };
    //     }
    // }
    public findAllUpdate = async (model: Skill, search: Partial<ISearchAndPagination>) => {
        console.log("model", model);

        try {
            // let result: any = [];
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
                        model: EmployeeModel,
                        as: 'employee',
                        required: false,
                        attributes: ['id', 'code', 'name']
                    },
                    {
                        model: AppointmentModel,
                        as: 'appointment',
                        required: false,
                        attributes: ['id', 'code', 'customerId'],
                        include: [
                            {
                                model: CustomerModel,
                                as: 'customer',
                                required: false,
                                attributes: ['id', 'code', 'name', 'phone', 'email']
                            }
                        ]
                    },
                    {
                        model: ServiceRequestHistoryModel,
                        as: 'statusHistory',
                        required: false,
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
                    }
                ]
            };

            // Thực hiện truy vấn và chuyển đổi dữ liệu
            let result = await Skill.findAll(options);
            result = result.map((item: any) => {
                const data = item.toJSON();  // Chuyển đối tượng Sequelize thành đối tượng thường

                // Đưa customer ra ngoài cùng cấp
                if (data.appointment && data.appointment.customer) {
                    data.customer = data.appointment.customer;
                    delete data.appointment.customer;  // Xóa customer khỏi appointment để tránh trùng lặp
                    delete data.employeeId
                }
                delete data.appointmentId;  // Xóa appointmentId để tránh trùng lặp
                // Sắp xếp lại statusHistory theo createdAt
                if (data.statusHistory) {
                    data.statusHistory.sort((a: any, b: any) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                }

                return data;
            });

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
    // public findById = async (id: number) => {
    //     try {
    //         const result = await checkExistSequelize(Skill, 'id', id);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }
    //         if (!result) {
    //             return new HttpException(404, errorMessages.NOT_FOUND, 'id');
    //         }
    //         return {
    //             data: result
    //         }
    //     } catch (error) {
    //         return {
    //             error: error
    //         }
    //     }
    // }
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
    public findById = async (model: Partial<Skill>) => {
        // console.log("id", id);
        // const skillInstance = new Skill();
        // patial 
        // skillInstance.id = id;
        const result = await this.findAllUpdate(model as any, {});
        console.log("result121212", result);

        if (result.data instanceof Error) {
            return new HttpException(400, result.data.message);
        }
        if (!result.data || result.data.length == 0) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        return {
            data: (result as RowDataPacket).data[0]
        }
    }
    public getListServiceRequest = async (model: Partial<Skill>) => {
        try {
            // const result = await Skill.findAll({
            //     where: {
            //         ...model,
            //         order: [['checkInTime', 'ASC']]
            //     }

            // });
            let query = `SELECT * FROM ServiceRequests WHERE currentStatus = '${ServiceRequestStatus.PENDING}' ORDER BY checkInTime ASC`;
            const result = await Skill.sequelize?.query(query)
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: (result as RowDataPacket)[0]
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    private listenToEvent = async () => {


        // eventEmitterInstance.on('NEW_SERVICE_REQUEST', async (data: any) => {
        //     console.log('NEW_SERVICE_REQUEST', data);

        // })

        // eventEmitterInstance.on('APPROVE_SERVICE_REQUEST', async (data: any) => {
        //     console.log('APPROVE_SERVICE_REQUEST', data);
        //     const { serviceRequestId, userId } = data;
        //     const serviceRequest = await this.findById({ id: serviceRequestId });
        //     console.log('serviceRequest', serviceRequest);

        //     if (serviceRequest.data) {
        //         const serviceRequestData = serviceRequest.data;
        //         const result = await this.update({
        //             currentStatus: ServiceRequestStatus.APPROVED,
        //             userId: userId
        //         }, serviceRequestId);
        //         console.log('result', result);
        //     }
        // });
        // console.log(
        //     'Listeners count for NEW_SERVICE_REQUEST:',
        //     eventEmitterInstance.listenerCount('NEW_SERVICE_REQUEST')
        // );


        // eventEmitterInstance.on('1', async (data: any) => {
        //     console.log('NEW_SERVICE_REQUEST', data);

        //     const getListServiceRequest = await this.getListServiceRequest({ currentStatus: ServiceRequestStatus.PENDING });
        //     // console.log('getListServiceRequest', getListServiceRequest); // queue 

        //     // lay ra item dau tien trong queue
        //     if ((getListServiceRequest as RowDataPacket).data && (getListServiceRequest as RowDataPacket).data.length > 0) {
        //         const serviceRequestData = (getListServiceRequest as RowDataPacket).data[0];
        //         // console.log('serviceRequestData', serviceRequestData);

        //         // emit event den nhan vien ky thuat co cung skill de thong bao co yeu cau moi
        //         // get nhan vien co cung skill
        //         // const listEmployeesWithSuitableSkills: any = await this.employeeSkillService.getListEmployeeWithSuitableSkills(serviceRequestData.id);

        //         const getServiceIdOfAppointment = await AppointmentModel.findOne({
        //             where: {
        //                 id: serviceRequestData.appointmentId
        //             }
        //         })
        //         let eligibleEmployeeId: number | null = serviceRequestData.employeeId;
        //         if (serviceRequestData.employeeId == null) {
        //             if (getServiceIdOfAppointment instanceof Error) {
        //                 return new HttpException(400, getServiceIdOfAppointment.message);
        //             }
        //             // lay danh sach nhan vien co ky nang phu hop cung chi nhanh
        //             const listEmployeesWithSuitableSkills: any = await this.employeeSkillService.getEmployeesForService((getServiceIdOfAppointment as any).id, serviceRequestData.branchId);
        //             // console.log('listEmployeesWithSuitableSkills', listEmployeesWithSuitableSkills.data);

        //             // lay ds nhan vien co status la dang rảnh co cung chi nhanh
        //             const listEmployeeStatusFree = await this.employeeStatusService.getListEmployeeIdByStatus(serviceRequestData.branchId, 1);
        //             // console.log('listEmployeeStatusFree', listEmployeeStatusFree);

        //             // so sanh 2 danh sach nhan vien co ky nang phu hop va nhan vien co status la dang ranh
        //             // const listEmployeeSuitableAndFree = listEmployeesWithSuitableSkills.data.filter((item: any) => listEmployeeStatusFree.includes(item.id));

        //             const eligibleEmployees = (listEmployeeStatusFree as any).data.filter((employee: any) =>
        //                 ((listEmployeesWithSuitableSkills as any).data as any).some((freeEmployee: any) => freeEmployee.id == employee.employeeId)
        //             );
        //             // lay nhan vien dau tien trong danh sach nhan vien co ky nang phu hop va nhan vien co status la dang ranh
        //             eligibleEmployeeId = eligibleEmployees ? (eligibleEmployees as any)[0].employeeId : null;
        //             // console.log('eligibleEmployeeId1', eligibleEmployeeId);
        //         }
        //         console.log('eligibleEmployeeI2d', eligibleEmployeeId);

        //         // eventEmitterInstance.emit('NEW_SERVICE_REQUEST_TO_TECHNICAN_EMPLOYEE_HAVE_SKILL', {
        //         //     serviceRequestId: serviceRequestData.id,
        //         //     userId: serviceRequestData.userId
        //         // });
        //     }

        //     console.log("123434");
        // });
    }

    public findAllServiceRequestBegingServed = async (model: Skill, search: Partial<ISearchAndPagination>) => {
        console.log("model", model);
        try {
            const byUserId = search.byUserId;
            delete search.byUserId;
            // let result: any = [];
            const { page, limit, key, ...filteredModel } = model as any;
            const searchConditions: any = {
                [Op.and]: [{}, { ...filteredModel }]
            };

            if (key) {
                searchConditions[Op.and].push({
                    [Op.or]: [
                    ]
                });
            }

            const options: any = {
                where: {
                    ...searchConditions,
                    currentStatus: {
                        [Op.in]: [ServiceRequestStatus.SERVING, ServiceRequestStatus.PENDING]
                    },
                    //voi userId == id
                    employeeId: {
                        [Op.eq]: byUserId
                    }
                },
                order: [['id', 'DESC', 'currentStatus', 'ASC']],
            };

            let result = []
            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                result = await Skill.findAll({
                    ...options,
                    limit: limitNumber,
                    offset: offset,
                });
            }
            else {
                // Thực hiện truy vấn và chuyển đổi dữ liệu
                result = await Skill.findAll(options);
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
}