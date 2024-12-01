import { HttpException } from "@core/exceptions";
import Skill from "modules/skill/model";
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import { Op } from 'sequelize';
import ServiceSkill from "modules/serviceSkill/model";
import Employee from "modules/employee/model";
import EmployeeSkill from "./model";

export class EmployeeSkillService {
    public create = async (model: Partial<EmployeeSkill>) => {
        try {
            const result = await EmployeeSkill.create(model);
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
    public update = async (model: Partial<EmployeeSkill>, id: number) => {
        try {
            const check = await checkExistSequelize(EmployeeSkill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await EmployeeSkill.update(model, {
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
            const check = await checkExistSequelize(EmployeeSkill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await EmployeeSkill.update({ isRemoved: true }, {
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
    public findAll = async (model: EmployeeSkill, search: Partial<ISearchAndPagination>) => {
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
                result = await EmployeeSkill.findAll({
                    where: searchConditions,
                    order: [['id', 'DESC']],
                    limit: limitNumber,
                    offset: offset,
                });
            } else {
                result = await EmployeeSkill.findAll({
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
    public findOne = async (model: Partial<EmployeeSkill>) => {
        try {
            const result = await EmployeeSkill.findOne({
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
        const check = await checkExistSequelize(EmployeeSkill, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await EmployeeSkill.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(EmployeeSkill, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await EmployeeSkill.update({ status: status }, {
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
            const result = await checkExistSequelize(EmployeeSkill, 'id', id);
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
                const check = await checkExistSequelize(EmployeeSkill, 'id', id);
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
    public getEmployeesForService = async (serviceId: number, branchId: number) => {
        const serviceSkills = await ServiceSkill.findAll({
            where: { serviceId },
            include: [{ model: Skill }],
        });
        console.log("ds ky nang cua service", serviceSkills);

        // Lấy danh sách `skillId` của dịch vụ
        const requiredSkillIds = new Set((serviceSkills as any).map((ss: any) => ss.skillId));
        console.log("ds skill required", requiredSkillIds);

        // Lấy danh sách nhân viên trong chi nhánh
        const employees = await Employee.findAll({
            where: { branchId },
            include: [
                {
                    model: EmployeeSkill,
                    include: [{ model: Skill }],
                },
            ],
        });
        console.log('ds employee', employees);


        const result = employees.filter((employee) => {
            // console.log("employee 11", employee);

            const employeeSkills = (employee as any).dataValues.employeeSkill || [];
            console.log("employeeSkills111", employeeSkills);

            const employeeSkillIds = new Set(employeeSkills.map((es: any) => es.skillId));

            // Kiểm tra nếu nhân viên có đủ kỹ năng
            return [...requiredSkillIds].every((skillId) => employeeSkillIds.has(skillId));
        });
        console.log("datsssa", result);

        return {
            data: result
        }
    }
}