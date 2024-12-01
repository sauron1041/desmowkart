"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
require('dotenv').config();
const app_1 = __importDefault(require("./app"));
require("reflect-metadata");
const user_1 = require("modules/user");
const auth_1 = require("modules/auth");
const branch_1 = require("modules/branch");
const category_1 = require("modules/category");
const skill_1 = require("modules/skill");
const service_1 = require("modules/service");
const customer_1 = require("modules/customer");
const employee_1 = require("modules/employee");
const appointment_1 = require("modules/appointment");
const membershipLevel_1 = require("modules/membershipLevel");
const serviceRequest_1 = require("modules/serviceRequest");
const serviceRequestHistory_1 = require("modules/serviceRequestHistory");
const cloudinary_1 = require("modules/cloudinary");
const serviceRequestImage_1 = require("modules/serviceRequestImage");
const feedback_1 = require("modules/feedback");
const receptionistEmployee_1 = require("modules/receptionistEmployee");
const order_1 = require("modules/order");
const orderDetail_1 = require("modules/orderDetail");
const employeeSkill_1 = require("modules/employeeSkill");
const routes = [
    new user_1.UserRoute(),
    new auth_1.AuthRoute(),
    new branch_1.BranchRoute(),
    new category_1.CategoryRoute(),
    new employeeSkill_1.EmployeeSkillRoute(),
    new skill_1.SkillRoute(),
    new service_1.ServiceRoute(),
    new customer_1.CustomerRoute(),
    new employee_1.EmployeeRoute(),
    new appointment_1.AppointmentRoute(),
    new membershipLevel_1.MembershipLevelRoute(),
    new serviceRequest_1.ServiceRequestRoute(),
    new serviceRequestHistory_1.ServiceRequestHistoryRoute(),
    new cloudinary_1.CloudDinaryRoute(),
    new serviceRequestImage_1.ServiceRequestImageRoute(),
    new feedback_1.FeedbackRoute(),
    new receptionistEmployee_1.ReceptionistEmployeeRoute(),
    new order_1.OrderRoute(),
    new orderDetail_1.OrderDetailRoute(),
];
const app = new app_1.default(routes);
app.listen();
//# sourceMappingURL=server.js.map