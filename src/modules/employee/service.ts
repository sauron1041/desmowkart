import { HttpException } from "@core/exceptions";
import { Employee } from "./model";
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import { generateCodePrefixChar } from "@core/utils/gennerate.code";
import User from "modules/user/model";
import { EmployeeStatusService } from "modules/employeeStatus/service";
import EmployeeStatusModel from "modules/employeeStatus/model";
export class EmployeeService {
    private employeeStatusService = new EmployeeStatusService();

    public create = async (model: Partial<Employee>) => {
        try {
            const code = await generateCodePrefixChar('Employees', 'NV', 8);
            model.code = code;
            model.id = undefined;
            const result = await Employee.create(model);
            console.log(result);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            return {
                data: result
            }
        } catch (error) {
            console.log(error);

            return {
                error: error
            }
        }
    }
    public update = async (model: Partial<Employee>, id: number) => {
        try {
            const check = await checkExistSequelize(Employee, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Employee.update(model, {
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
            const check = await checkExistSequelize(Employee, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Employee.update({ isRemoved: true }, {
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
    public findAll = async (model: Employee, search: Partial<ISearchAndPagination>) => {
        try {
            let result;
            const { page, limit, key, ...filteredModel } = model as any;
            const searchConditions: any = {
                [Op.and]: [{}, { ...filteredModel }]
            };

            // if (key) {
            //     searchConditions[Op.and].push({
            //         [Op.or]: [
            //             { name: { [Op.like]: `%${key}%` } },
            //             { phone: { [Op.like]: `%${key}%` } },
            //         ]
            //     });
            // }

            const options: any = {
                where: searchConditions,
                order: [['id', 'DESC']],
            }

            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                // result = await Employee.findAll({
                //     where: searchConditions,
                //     limit: limitNumber,
                //     offset: offset,
                // });
                options.limit = limitNumber;
                options.offset = offset
            }
            // else {
            //     result = await Employee.findAll({
            //         where: searchConditions,
            //     });
            // }
            result = await Employee.findAll(options);

            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            //map user  to customer
            for (let i = 0; i < result.length; i++) {
                const user = await User.findOne({
                    where: {
                        id: result[i].userId
                    }
                });
                if (user instanceof Error) {
                    return new HttpException(400, user.message);
                }
                delete result[i].dataValues.userId;
                delete result[i].dataValues.id;
                delete user?.dataValues.password;
                delete user?.dataValues.roleId;
                delete user?.dataValues.isRemoved;
                delete user?.dataValues.createdAt;
                delete user?.dataValues.updatedAt;
                delete user?.dataValues.status;

                result[i].dataValues = {
                    ...user?.dataValues,
                    ...result[i].dataValues
                }
            }

            return {
                data: result,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: result.length,
                    totalPages: Math.ceil(result.length / Number(search.limit))
                } : null
            };
        } catch (error) {
            console.log(error);

            return {
                error: error
            };
        }
    }
    public findOne = async (model: Partial<Employee>) => {
        try {
            const result = await Employee.findOne({
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
        const check = await checkExistSequelize(Employee, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await Employee.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Employee, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await Employee.update({ status: status }, {
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
            const result = await checkExistSequelize(Employee, 'id', id);
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
                const check = await checkExistSequelize(Employee, 'id', id);
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
    public findAllEmployeeWithWorkingStatus = async (status: number, branchId: number) => {
        let modelEmployeeStatus: EmployeeStatusModel = new EmployeeStatusModel();
        modelEmployeeStatus.employeeStatus = status;
        modelEmployeeStatus.branchId = branchId;

        console.log("modelEmployeeStatus", modelEmployeeStatus);
        console.log("this.employeeStatusService", branchId);
        

        
        const result = await this.employeeStatusService.findAll(modelEmployeeStatus, {});
        if (result instanceof HttpException) {
            return new HttpException(400, errorMessages.NOT_FOUND);
        }
        return {
            data: result ? result.data : []
        }

    }
}