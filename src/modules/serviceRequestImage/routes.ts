import { ServiceRequestImageController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class ServiceRequestImageRoute implements IRoute {
    public path = '/sevice-request-image';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public skillController = new ServiceRequestImageController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.upload.single('file'), this.skillController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.skillController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.skillController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.skillController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.skillController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.skillController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.skillController.findOne);
        this.router.get(this.path + '/find-by-id/:id', AuthMiddleware.authorization, this.skillController.findById);
        this.router.get(this.path + '/find-all-service-request-images-by-service-id/:serviceId', AuthMiddleware.authorization, this.skillController.findAllServiceRequestImageByServiceId);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.skillController.findAll);
    }
}