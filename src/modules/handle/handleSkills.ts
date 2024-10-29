import Employee from "modules/employee/model";
import Customer from "modules/customer/model";
import ServiceSkill from "modules/serviceSkill/model";
import Skill from "modules/skill/model";
import EmployeeSkill from "modules/employeeSkill/model";


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