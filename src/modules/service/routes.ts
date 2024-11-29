import { ServiceController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class ServiceRoute implements IRoute {
    public path = '/services';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public serviceController = new ServiceController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.serviceController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.serviceController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.serviceController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.serviceController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.serviceController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.serviceController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.serviceController.findOne);
        this.router.get(this.path + '/find-by-id/:id', this.serviceController.findById);
        this.router.get(this.path + '/', this.serviceController.findAll);
    }
}