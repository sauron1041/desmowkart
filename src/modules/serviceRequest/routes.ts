import { ServiceRequestController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class ServiceRequestRoute implements IRoute {
    public path = '/service-request';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public skillController = new ServiceRequestController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.skillController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.skillController.createUpdate);
        // this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.skillController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.skillController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.skillController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.skillController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.skillController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.skillController.findOne);
        this.router.get(this.path + '/find-by-id/:id', AuthMiddleware.authorization, this.skillController.findById);
        this.router.get(this.path + '/find-all-service-request-being-served', AuthMiddleware.authorization, this.skillController.findAllServiceRequestBegingServed);
        this.router.get(this.path + '/', this.skillController.findAll);
        // this.router.get(this.path + '/', AuthMiddleware.authorization, this.skillController.findAll);
    }
}