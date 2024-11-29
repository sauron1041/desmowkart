import { HttpException } from "@core/exceptions";
import User from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { generateCodePrefixChar } from "@core/utils/gennerate.code";
import { CustomerService } from "modules/customer/service";
import { EmployeeService } from "modules/employee/service";
import EmployeeSkillModel from "modules/employeeSkill/model";
import CreateUser from "./dtos/create";
import EmployeeModel from "modules/employee/model";
import { Customer as CustomerModel } from "modules/customer/model";
import { avatars } from "@core/mocks/avatar";
import CreateCustomerDto from "./dtos/createCustomerDto";
import CreateEmpoyeeDto from "./dtos/createEmployeeDto";
import { RowDataPacket } from "mysql2";

export class UserService {
    private customerService = new CustomerService();
    private employeeService = new EmployeeService();

    public createEmployeeAccount = async (model: Partial<CreateEmpoyeeDto>) => {
        try {
            const check = await checkExistSequelize(User, 'username', model.username!);
            // const code = await generateCodePrefixChar('Users', 'ID', 8);
            // model.code = code;
            if (check) {
                return new HttpException(400, errorMessages.EXISTED, 'username');
            }
            const passwordHash = await bcryptjs.hash(model.password!, 10);
            model.password = passwordHash;
            if (model.avatar == undefined) {
                model.avatar = avatars[Math.floor(Math.random() * avatars.length)].imageUrl
            }
            const result = await User.create(model);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if (model.roleId == 2) {
                let employeeModel = new EmployeeModel();
                employeeModel = model as any;
                employeeModel.userId = result.id;
                employeeModel.avatar = model.avatar;
                employeeModel.id = result.id;
                employeeModel.address = model.address;
                employeeModel.city = model.city;
                employeeModel.district = model.district;
                employeeModel.ward = model.ward;
                employeeModel.name = model.name;
                employeeModel.email = model.email;
                employeeModel.dateOfBirth = model.dateOfBirth;
                employeeModel.gender = model.gender as any;
                const employeeResult = await this.employeeService.create(employeeModel);
                console.log("employeeResult", employeeResult);


                // const employeeResult = await this.employeeService.create({ userId: result.id, avatar: model.avatar });
                if (employeeResult instanceof Error) {
                } else {
                    if (model.employeeSkill) {
                        for (const skill of model.employeeSkill!) {
                            await EmployeeSkillModel.create({ employeeId: (employeeResult as any).data.id, skillId: skill.skillId });
                        }
                    }
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

    public createCustomerAccount = async (model: Partial<CreateCustomerDto>) => {
        try {
            const check = await checkExistSequelize(User, 'username', model.username!);
            // const code = await generateCodePrefixChar('Users', 'ID', 8);
            // model.code = code;
            if (check) {
                return new HttpException(400, errorMessages.EXISTED, 'username');
            }
            const passwordHash = await bcryptjs.hash(model.password!, 10);
            model.password = passwordHash;
            if (model.avatar == undefined) {
                model.avatar = avatars[Math.floor(Math.random() * avatars.length)].imageUrl
            }
            const result = await User.create(model);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if (model.roleId != undefined) {
                let customerModel = new CustomerModel();
                customerModel = model as any;
                customerModel.userId = result.id;
                customerModel.avatar = model.avatar;
                customerModel.id = result.id;
                customerModel.address = model.address;
                customerModel.city = model.city;
                customerModel.district = model.district;
                customerModel.ward = model.ward;
                customerModel.name = model.name;
                customerModel.email = model.email;
                customerModel.dateOfBirth = model.dateOfBirth;
                customerModel.gender = model.gender as any;
                if (model.roleId == 3) {
                    await this.customerService.create(customerModel);
                    // await this.customerService.create({ userId: result.id, avatar: model.avatar });
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

    // public create = async (model: Partial<CreateUser>) => {
    public create = async (model: Partial<any>) => {
        try {
            const check = await checkExistSequelize(User, 'username', model.username!);
            const code = await generateCodePrefixChar('Users', 'ID', 8);
            model.code = code;
            if (check) {
                return new HttpException(400, errorMessages.EXISTED, 'username');
            }
            const passwordHash = await bcryptjs.hash(model.password!, 10);
            model.password = passwordHash;
            if (model.avatar == undefined) {
                model.avatar = avatars[Math.floor(Math.random() * avatars.length)].imageUrl
            }
            const result = await User.create(model);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if (model.roleId != undefined) {
                if (model.roleId == 2) {
                    const employeeModel = new EmployeeModel();
                    employeeModel.userId = result.id;
                    const employeeResult = await this.employeeService.create({ userId: result.id, avatar: model.avatar });
                    if (employeeResult instanceof Error) {
                    } else {
                        if (model.employeeSkill) {
                            for (const skill of model.employeeSkill!) {
                                await EmployeeSkillModel.create({ employeeId: (employeeResult as any).data.id, skillId: skill.skillId });
                            }
                        }
                        // for (const skill of model.employeeSkill!) {
                        //     await EmployeeSkillModel.create({ employeeId: (employeeResult as any).data.id, skillId: skill.skillId });
                        // }
                    }

                }
                if (model.roleId == 3) {
                    await this.customerService.create({ userId: result.id, avatar: model.avatar });
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
    public update = async (model: Partial<User>, id: number) => {
        try {
            const check = await checkExistSequelize(User, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await User.update(model, {
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
            const check = await checkExistSequelize(User, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await User.update({ isRemoved: true }, {
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
    public findAll = async (model: User, search: Partial<ISearchAndPagination>) => {
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
                result = await User.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                    limit: limitNumber,
                    offset: offset,
                });
            } else {
                result = await User.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                });
            }

            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            const count = await User.count({
                where: searchConditions
            });
            return {
                data: result,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: result.length,
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
    public findOne = async (model: Partial<User>) => {
        try {
            const result = await User.findOne({
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
        const check = await checkExistSequelize(User, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await User.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(User, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await User.update({ status: status }, {
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
            const result = await checkExistSequelize(User, 'id', id);
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
                const check = await checkExistSequelize(User, 'id', id);
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
    public getProfile = async (id: number) => {
        try {
            const result = await User.findOne({
                where: {
                    id: id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            if(result?.roleId == 2 ) {
                console.log("result", result);
                
                const employee = await this.employeeService.findById(id);
                return {
                    data: {
                        roleId: result.roleId,
                        ...(employee as any).data.dataValues
                    }
                }
            }
            if (result?.roleId == 3) {
                const customer = await this.customerService.findById(id);
                return {
                    data: {
                        roleId: result.roleId,
                        ...(customer as any).data.dataValues
                    }
                }
            }
            return {
                data: result
            }
        } catch (error) { }
    }
}