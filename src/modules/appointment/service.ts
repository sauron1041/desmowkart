import { HttpException } from "@core/exceptions";
import Appointment from "./model";
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Model, Op } from 'sequelize';
import { EmployeeStatusService } from "modules/employeeStatus/service";
import AppointmentStatus from "./interface";
import { ServiceRequestService } from "modules/serviceRequest/service";
import Branch from "modules/branch/model";
import Customer from "modules/customer/model";
import { User } from "modules/user";
import { Employee } from "modules/employee";
import Service from "modules/service/model";
import { generateCodePrefixChar } from "@core/utils/gennerate.code";

export class AppointmentService {

    private serviceRequestService = new ServiceRequestService();

    constructor() {
        this.serviceRequestService = new ServiceRequestService();
    }

    public create = async (model: Partial<Appointment>) => {
        try {
            const code = await generateCodePrefixChar('Appointments', 'LH', 8);
            model.code = code;
            const result = await Appointment.create(model);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: {
                    ...model,
                    id: result.id,
                    code: code
                }
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public update = async (model: Partial<Appointment>, id: number) => {
        try {
            console.log("model", model);

            const check = await checkExistSequelize(Appointment, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Appointment.update(model, {
                where: {
                    id: id
                }
            });
            console.log("result", result);

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
            const check = await checkExistSequelize(Appointment, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Appointment.update({ isRemoved: true }, {
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
    public findAll = async (model: Appointment, search: Partial<ISearchAndPagination>) => {
        try {
            let result;
            const { page, limit, key, ...filteredModel } = model as any;
            const searchConditions: any = {
                [Op.and]: [{}, { ...filteredModel }]
            };

            if (key) {
                searchConditions[Op.and].push({
                    // [Op.or]: [
                    // { name: { [Op.like]: `%${key}%` } },
                    // { phone: { [Op.like]: `%${key}%` } },
                    // ]
                });
            }

            const options: any = {
                where: searchConditions,
                order: [['id', 'DESC']],
                include: [
                    { model: Branch, attributes: ['id', 'name'], required: false },
                    { model: Service, attributes: ['id', 'name'], required: false },
                    {
                        model: Customer,
                        attributes: ['id', 'userId'],
                        required: false,
                        include: [
                            {
                                model: User,
                                attributes: ['name'],
                                required: false
                            }
                        ]
                    },
                    {
                        model: Employee,
                        attributes: ['id', 'userId'],
                        required: false,
                        include: [
                            {
                                model: User,
                                attributes: ['name'],
                                required: false
                            }
                        ]
                    }
                ],
            }

            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                options.limit = limitNumber;
                options.offset = offset
            }

            result = await Appointment.findAll(options);
            const count = await Appointment.count({ where: searchConditions });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            // map 
            result = result.map((item: any) => {
                return {
                    id: item.id,
                    code: item.code,
                    branchId: item.branchId,
                    customerId: item.customerId,
                    employeeId: item.employeeId,
                    status: item.status,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    note: item.note,
                    isRemoved: item.isRemoved,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    serviceId: item.serviceId,
                    serviceName: item.service ? item.service.name : null,
                    branchName: item.branch ? item.branch.name : null,
                    customerName: item.customer ? item.customer.user.name : null,
                    employeeName: item.employee ? item.employee.user.name : null,
                    time: item.time,
                    reminderSent: item.reminderSent,
                }
            });
            const totalRecords = result.length;
            return {
                data: result,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: totalRecords,
                    // totalPages: Math.ceil(result.length / Number(search.limit))
                    totalPages: Math.ceil(count / Number(search.limit))
                } : null
            };
        } catch (error) {
            console.log(error);

            return {
                error: error
            };
        }
    }
    public findOne = async (model: Partial<Appointment>) => {
        try {
            const result = await Appointment.findOne({
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
        const check = await checkExistSequelize(Appointment, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await Appointment.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Appointment, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await Appointment.update({ status: status }, {
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
            const result = await checkExistSequelize(Appointment, 'id', id);
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
                const check = await checkExistSequelize(Appointment, 'id', id);
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
    public appointmentApproval = async (id: number, status: AppointmentStatus) => {
        try {
            const check = await checkExistSequelize(Appointment, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Appointment.update({ status: status }, {
                where: {
                    id: id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            // create service request
            const serviceRequest = await this.serviceRequestService.create({
                appointmentId: id,
                currentStatus: status as any,
                userId: check.dataValues.userId,
                appointment: check,
                branchId: check.dataValues.branchId,
            })
            return {
                data: {
                    status: status
                }
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }

}