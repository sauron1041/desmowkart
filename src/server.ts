require('module-alias/register');
require('dotenv').config();
import App from "./app"
import validateEnv from "@core/utils/validate_env";
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

validateEnv();
const routes = [
    new UserRoute(),
    new AuthRoute(),
    new BranchRoute(),
    new CategoryRoute(),
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
    new ReceptionistEmployeeRoute()
];

const app = new App(routes);

app.listen();