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
import ServiceRequest from "modules/serviceRequest/model";
import { databaseSequelize } from "@core/config/databaseSequelize";
import database from "@core/config/database";

export class AppointmentService {

    public serviceRequestService = new ServiceRequestService();

    // constructor() {
    //     this.serviceRequestService = new ServiceRequestService();
    // }

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
        }
        catch (error) {
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
        // session of customer
        // const statusCompleted = 2;
        // let countSessionQuery = ` SELECT COUNT(*) as count FROM appointments WHERE customerId = ${model.customerId} and serviceId = ${model.serviceId} and status = ${statusCompleted}  and isRemoved = false`;
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

            // if(search.fromDate && search.toDate) {
            //     delete search.fromDate;
            //     delete search.toDate;
            //     searchConditions[Op.and].push({
            //         startTime: {
            //             [Op.between]: [model.time, model.time]
            //         }
            //     });
            // }
            // if (search.fromDate && search.toDate) {
            //     searchConditions[Op.and].push({
            //       time: {
            //         [Op.gte]: searchConditions.fromDate, // Greater than or equal to fromDate (assuming DATETIME or TIMESTAMP)
            //         [Op.lte]: searchConditions.toDate   // Less than or equal to toDate
            //       },
            //       requeried: false
            //     });
            //   }

            if (search.fromDate && search.toDate) {
                searchConditions[Op.and].push({
                    time: {
                        [Op.gte]: search.fromDate, // Greater than or equal to fromDate (assuming DATETIME or TIMESTAMP)
                        [Op.lte]: search.toDate   // Less than or equal to toDate
                    }
                });
            }
            const options: any = {
                where: searchConditions,
                order: [['id', 'DESC']],
                include: [
                    { model: Branch, attributes: ['id', 'name'], required: false },
                    { model: Service, attributes: ['id', 'name', 'totalSessions'], required: false },
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
            result = Promise.all(result.map(async (item: any) => {
                const statusCompleted = 2;
                // let query = `SELECT COUNT(*) as count FROM appointments WHERE customerId = ${item.customerId} and serviceId = ${item.serviceId}   and isRemoved = false`;
                let query = `
                    SELECT COUNT(*) as count 
                    FROM appointments 
                    WHERE customerId = ${item.customerId} 
                      AND serviceId = ${item.serviceId} 
                      AND isRemoved = false 
                      and status = ${statusCompleted}
                      AND id <= ${item.id}
                `;
                const countSession = await databaseSequelize.getSequelize().query(query, {})
                console.log("countSession", countSession);

                let queryTotalPurchasedQuantity = `SELECT 
                CAST(SUM(od.quantity) AS UNSIGNED) AS totalPurchasedQuantity
                FROM 
                    OrderDetails od
                JOIN 
                    Orders o ON od.orderId = o.id
                WHERE 
                    od.serviceId = ${item.serviceId}
                    AND o.customerId = ${item.customerId}
                    AND o.isRemoved = false;
                `
                const totalPurchasedQuantity = await databaseSequelize.getSequelize().query(queryTotalPurchasedQuantity, {})

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
                    currentSession: countSession !== null ? (countSession as any)[0][0].count : 0,
                    totalPurchasedQuantity: totalPurchasedQuantity !== null ? (totalPurchasedQuantity as any)[0][0].totalPurchasedQuantity : 0,
                    totalSessionOfService: item.service ? item.service.totalSessions : 0,
                    // appointment: item.appointment,
                    // branch: item.branch,
                    // customer: item.customer,
                    // employee: item.employee,
                    // service: item.service
                }
            }));
            const totalRecords = (await result).length;
            return {
                data: await result,
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
        console.log("statw113212us", status);
        console.log("id", id);


        try {
            const check = await checkExistSequelize(Appointment, 'id', id);
            console.log("check", check);

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
            const checkServiceRequestExist = await checkExistSequelize(ServiceRequest, 'appointmentId', id);
            console.log("checkServiceRequestExist", checkServiceRequestExist);

            if (checkServiceRequestExist) {
            } else if (status == 1) { // status = 1 checkin -> tao service request
                const serviceRequest = await this.serviceRequestService.create({
                    appointmentId: id,
                    currentStatus: status as any,
                    userId: check.dataValues.userId,
                    appointment: check,
                    branchId: check.dataValues.branchId,
                    employeeId: check.dataValues.employeeId != null ? check.dataValues.employeeId : null,
                })
            }
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