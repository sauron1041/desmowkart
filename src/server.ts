require('module-alias/register');
require('dotenv').config();

const port = process.env.PORT || 3001;
console.log("port111111", port);

import App from "./app"
import 'reflect-metadata';
import { UserRoute } from "modules/user";
import { AuthRoute } from "modules/auth";
import { BranchRoute } from "modules/branch";
import { CategoryRoute } from "modules/category";
import { SkillRoute } from "modules/skill";
import { ServiceRoute } from "modules/service";
import { CustomerRoute } from "modules/customer";
import { EmployeeRoute } from "modules/employee";
import { AppointmentRoute } from "modules/appointment";
import { MembershipLevelRoute } from "modules/membershipLevel";
import { ServiceRequestRoute } from "modules/serviceRequest";
import { ServiceRequestHistoryRoute } from "modules/serviceRequestHistory";
import { CloudDinaryRoute } from "modules/cloudinary";
import { ServiceRequestImageRoute } from "modules/serviceRequestImage";
import { FeedbackRoute } from "modules/feedback";
import { ReceptionistEmployeeRoute } from "modules/receptionistEmployee";
import { OrderRoute } from "modules/order";
import { OrderDetailRoute } from "modules/orderDetail";
import { EmployeeSkillRoute } from "modules/employeeSkill";



const routes = [
    new UserRoute(),
    new AuthRoute(),
    new BranchRoute(),
    new CategoryRoute(),
    new EmployeeSkillRoute(),
    new SkillRoute(),
    new ServiceRoute(),
    new CustomerRoute(),
    new EmployeeRoute(),
    new AppointmentRoute(),
    new MembershipLevelRoute(),
    new ServiceRequestRoute(),
    new ServiceRequestHistoryRoute(),
    new CloudDinaryRoute(),
    new ServiceRequestImageRoute(),
    new FeedbackRoute(),
    new ReceptionistEmployeeRoute(),
    new OrderRoute(),
    new OrderDetailRoute(),
];

const app = new App(routes, port);

app.listen();