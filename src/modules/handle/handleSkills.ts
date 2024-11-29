import Employee from "modules/employee/model";
import Customer from "modules/customer/model";
import ServiceSkill from "modules/serviceSkill/model";
import Skill from "modules/skill/model";
import EmployeeSkill from "modules/employeeSkill/model";
import { RowDataPacket } from "mysql2";


export const checkEmployeeSkillsForService = async (employeeId: number, serviceId: number) => {
    console.log("employeeId", employeeId);
    console.log("serviceId", serviceId);
    const emoployeeSkills = await EmployeeSkill.findAll({
        where: {
            employeeId: employeeId
        },
        include: [
            { model: Skill }
        ]

    })
    const serviceSkills = await ServiceSkill.findAll({
        where: {
            serviceId: serviceId
        },
        include: [
            { model: Skill }
        ]
    })
    const employeeSkillIds = new Set(emoployeeSkills.map((es) => es.skillId));
    const serviceSkillIds = new Set(serviceSkills.map((ss) => ss.skillId));

    return [...serviceSkillIds].every((skillId) => employeeSkillIds.has(skillId));
    // const employeeSkillIds = new Set(emoployeeSkills.map((es) => es.skillId));

    // for (const serviceSkill of serviceSkills) {
    //   if (!employeeSkillIds.has(serviceSkill.skillId)) {
    //     return false
    //   }
    // }
    // return true;
}

export const getEmployeesForService = async (serviceId: number, branchId: number) => {
    // Lấy danh sách kỹ năng cần thiết cho dịch vụ
    const serviceSkills = await ServiceSkill.findAll({
        where: { serviceId },
        include: [{ model: Skill }],
    });

    // Lấy danh sách `skillId` của dịch vụ
    const requiredSkillIds = new Set((serviceSkills as any).map((ss: any) => ss.skillId));

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

    const ineligibleEmployees = employees.filter((employee) => {
        const employeeSkills = (employee as any).EmployeeSkills || [];
        const employeeSkillIds = new Set(employeeSkills.map((es: any) => es.skillId));
    
        // Kiểm tra nếu thiếu kỹ năng nào
        return ![...requiredSkillIds].every((skillId) => employeeSkillIds.has(skillId));
    });

    const result = employees.filter((employee) => !ineligibleEmployees.includes(employee));
    return result;


};
