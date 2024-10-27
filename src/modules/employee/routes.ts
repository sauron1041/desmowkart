import { EmployeeController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class EmployeeRoute implements IRoute {
    public path = '/employee';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public userController = new EmployeeController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.userController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.userController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.userController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.userController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.userController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.userController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.userController.findOne);
        this.router.get(this.path + '/find-by-id:id', AuthMiddleware.authorization, this.userController.findById);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.userController.findAll);
    }
}