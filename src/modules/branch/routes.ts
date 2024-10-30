import { BranchController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class BranchRoute implements IRoute {
    public path = '/branch';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public branchController = new BranchController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.branchController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.branchController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.branchController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.branchController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.branchController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.branchController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.branchController.findOne);
        this.router.get(this.path + '/find-by-id/:id', AuthMiddleware.authorization, this.branchController.findById);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.branchController.findAll);
    }
}