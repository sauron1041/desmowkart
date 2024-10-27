import database from "@core/config/database";
import { HttpException } from "@core/exceptions";
import { checkExist } from "@core/utils/checkExist";
import { IPagiantion } from "@core/interfaces";
import { RowDataPacket } from "mysql2";
import errorMessages from "@core/config/constants";
import { AppointmentService } from "./appointment.service";
import { ServiceRequestService } from "./serviceRequest.service";
import { CreateDto as ServiceRequest } from "../dtos/serviceRequest/create.dto";
import { AvailableEmployeeService } from "./availableEmployee.service";
import { CreateDto as AvailableeEmployee } from "dtos/availableEmployee/create.dto";
import { SerivceSkillService } from "./serviceSkill.service";
import ServiceService from "./service.service";
import { EmployeeSkillService } from "./employeeSkill.service";

export class EmployeeService {
    private tableNameAppointment = 'appointment';
    private fieldId = 'id'
    private appointmentService = new AppointmentService();
    private serviceRequestService = new ServiceRequestService();
    private availableEmployeeService = new AvailableEmployeeService();
    private serviceSkillsService = new SerivceSkillService();
    private serviceService = new ServiceService();
    private employeeSkillService = new EmployeeSkillService();

    public findAllQueueByBranchAndStatus = async (branch_id: number, status: number) => {
        const result = await this.serviceRequestService.findQueueByBranchAndStatus(branch_id, status)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }
    public findAllEmployeeWithCondition = async (model: AvailableeEmployee) => {
        const result = await this.availableEmployeeService.findAllEmployeeWithCondition(model)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }

    // public findEmployeeWithSkillOfService = async (service_id: number) => {
    //     const service = await this.serviceService.findAllSerivceWithSkill({ id: service_id });
    //     let model: AvailableeEmployee = {};
    //     const employeeSkill = await this.findAllEmployeeWithSkill(model);
    //     if ((employeeSkill as RowDataPacket).data.length == 0) {
    //         return new HttpException(400, errorMessages.NOT_FOUND);
    //     }
    //     const employees = (employeeSkill as RowDataPacket).data;
    //     const services = (service as RowDataPacket).data;
    //     let result = [];
    //     // chua chinh xac
    //     for (let i = 0; i < employees.length; i++) {
    //         if (employees[i].skills && services[0].skills) {
    //             for (let j = 0; j < employees[i].skills.length; j++) {
    //                 for (let k = 0; k < services[0].skills.length; k++) {
    //                     if (employees[i].skills[j].id == services[0].skills[k].id) {
    //                             result.push(employees[i])
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return {
    //         data: result
    //     }
    // }

    public findEmployeeWithSkillOfService = async (service_id: number) => {
        const service = await this.serviceService.findAllSerivceWithSkill({ id: service_id });  
        console.log(service);
        
        let model: AvailableeEmployee = {};
        const employeeSkill = await this.findAllEmployeeWithSkill(model); // thieu branch
        if ((employeeSkill as RowDataPacket).data.length == 0) {
            return new HttpException(400, errorMessages.NOT_FOUND);
        }
        const SkillOfService = (service as RowDataPacket).data
        const skills = SkillOfService[0].skills;
        const listSkillIdOfService = skills.map((item: any) => item.skill_id)
        const employees = (employeeSkill as RowDataPacket).data;

        const employeeSkillsMap = employees.reduce((acc: { [key: number]: number[] }, employee: any) => {
            if (!acc[employee.employee_id]) {
                acc[employee.employee_id] = [];
            }
            if (employee.skills == null) return acc;
            (employee.skills as RowDataPacket).forEach((skill: { skill_id: number }) => {
                if (!acc[employee.employee_id].includes(skill.skill_id)) {
                    acc[employee.employee_id].push(skill.skill_id);
                }
            });
            return acc;
        }, {});

        const result = Object.keys(employeeSkillsMap).reduce((acc: number[], employeeId) => {
            const employeeSkills = employeeSkillsMap[employeeId];
            if (employeeSkills.length === 0) return acc;
            const isMatch = listSkillIdOfService.every((skillId: number) => employeeSkills.includes(skillId));
            if (isMatch) {
                acc.push(parseInt(employeeId));
            }
            return acc;
        }, []);
        return {
            data: result
        }
    }

    public findAllEmployeeWithSkill = async (model: AvailableeEmployee) => {
        const result = await this.availableEmployeeService.findAllEmployeeWithCondition(model)
        if (result instanceof HttpException) { return new HttpException(400, errorMessages.NOT_FOUND) }
        return {
            data: result.data
        }
    }
}