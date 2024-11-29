import eventEmitterInstance from "@core/pubSub/pubSub";
import ServiceRequestStatus from "modules/serviceRequest/interface";
import { ServiceRequestService } from "modules/serviceRequest/service";
import { RowDataPacket } from "mysql2";
import AppointmentModel from "modules/appointment/model";
import { HttpException } from "@core/exceptions";
import { EmployeeSkillService } from "modules/employeeSkill/service";
import { EmployeeStatusService } from "modules/employeeStatus/service";
import App from "app";
import { Socket } from "socket.io";
import SocketService from "modules/socket/service";
// import App from "app";

export class HandleQueue {
    private serviceRequestService = new ServiceRequestService();
    private employeeSkillService = new EmployeeSkillService();
    private employeeStatusService = new EmployeeStatusService
    constructor() {
        this.listenToEvent();
    }
    private listenToEvent = async () => {
        console.log(
            'Listeners count for NEW_SERVICE_REQUEST:',
            eventEmitterInstance.listenerCount('NEW_SERVICE_REQUEST')
        );
        eventEmitterInstance.on('NEW_SERVICE_REQUEST', async (data: any) => {
            const getListServiceRequest = await this.serviceRequestService.getListServiceRequest({ currentStatus: ServiceRequestStatus.PENDING });
            // lay ra item dau tien trong queue
            if ((getListServiceRequest as RowDataPacket).data && (getListServiceRequest as RowDataPacket).data.length > 0) {
                const serviceRequestData = (getListServiceRequest as RowDataPacket).data[0];
                // console.log('serviceRequestData', serviceRequestData);

                // emit event den nhan vien ky thuat co cung skill de thong bao co yeu cau moi
                // get nhan vien co cung skill
                const getServiceIdOfAppointment = await AppointmentModel.findOne({
                    where: {
                        id: serviceRequestData.appointmentId
                    }
                })
                let eligibleEmployeeId: number | null = serviceRequestData.employeeId;
                // if (serviceRequestData.employeeId == null) {
                if (getServiceIdOfAppointment instanceof Error) {
                    return new HttpException(400, getServiceIdOfAppointment.message);
                }
                // lay danh sach nhan vien co ky nang phu hop cung chi nhanh
                const listEmployeesWithSuitableSkills: any = await this.employeeSkillService.getEmployeesForService((getServiceIdOfAppointment as any).id, serviceRequestData.branchId);
                // console.log('listEmployeesWithSuitableSkills', listEmployeesWithSuitableSkills.data);

                // lay ds nhan vien co status la dang rảnh co cung chi nhanh
                const listEmployeeStatusFree = await this.employeeStatusService.getListEmployeeIdByStatus(serviceRequestData.branchId, 1);
                // so sanh 2 danh sach nhan vien co ky nang phu hop va nhan vien co status la dang ranh
                const eligibleEmployees = (listEmployeeStatusFree as any).data.filter((employee: any) =>
                    ((listEmployeesWithSuitableSkills as any).data as any).some((freeEmployee: any) => freeEmployee.id == employee.employeeId)
                );
                // lay nhan vien dau tien trong danh sach nhan vien co ky nang phu hop va nhan vien co status la dang ranh
                eligibleEmployeeId = eligibleEmployees ? (eligibleEmployees as any)[0].employeeId : null;
                const sendNewServiceRequestNotification = SocketService.getInstance().sendNewServiceRequestNotification(eligibleEmployeeId as number, 'You have a new service request');
                console.log('sendNewServiceRequestNotification', sendNewServiceRequestNotification);
                // }
                console.log('eligibleEmployeeI2d', eligibleEmployeeId);
            }
        });
    }
}