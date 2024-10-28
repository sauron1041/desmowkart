import { HttpException } from "@core/exceptions";
import { Customer } from "./model";
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { generateCodePrefixChar } from "@core/utils/gennerate.code";
import User from "modules/user/model";
import { RowDataPacket } from "mysql2";
import { ICustomer } from "./dtos/customer";

export class CustomerService {
    public create = async (model: Partial<Customer>) => {
        try {
            const code = await generateCodePrefixChar('Customers', 'KH', 8);
            model.code = code;
            model.userId = model.id;
            model.id = undefined;
            const result = await Customer.create(model);
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
    public update = async (model: Partial<Customer>, id: number) => {
        try {
            const check = await checkExistSequelize(Customer, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Customer.update(model, {
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
            const check = await checkExistSequelize(Customer, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Customer.update({ isRemoved: true }, {
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
    public findAll = async (model: Customer, search: Partial<ISearchAndPagination>) => {
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
                options.limit = limitNumber;
                options.offset = offset;
            }
            result = await Customer.findAll(options);
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
    public findOne = async (model: Partial<Customer>) => {
        try {
            const result = await Customer.findOne({
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
        const check = await checkExistSequelize(Customer, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await Customer.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Customer, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await Customer.update({ status: status }, {
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
            const result = await checkExistSequelize(Customer, 'id', id);
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
                const check = await checkExistSequelize(Customer, 'id', id);
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