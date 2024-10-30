import { CategoryController } from "./controller";
import { IRoute } from "@core/interfaces";
import { Router } from "express";
import multer from "multer";
import { AuthMiddleware } from "@core/middleware";

export class CategoryRoute implements IRoute {
    public path = '/category';
    public router = Router();
    public upload = multer({ storage: multer.memoryStorage() });

    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(this.path + '/', AuthMiddleware.authorization, this.categoryController.create);
        this.router.patch(this.path + '/:id', AuthMiddleware.authorization, this.categoryController.update);
        this.router.put(this.path + '/update-list-status', AuthMiddleware.authorization, this.categoryController.updateListStatus);
        this.router.put(this.path + '/update-status/:id', AuthMiddleware.authorization, this.categoryController.updateStatus);
        this.router.delete(this.path + '/delete-list', AuthMiddleware.authorization, this.categoryController.deleteList);
        this.router.delete(this.path + '/:id', AuthMiddleware.authorization, this.categoryController.delete);
        this.router.get(this.path + '/find-one/:id', AuthMiddleware.authorization, this.categoryController.findOne);
        this.router.get(this.path + '/find-by-id/:id', AuthMiddleware.authorization, this.categoryController.findById);
        this.router.get(this.path + '/', AuthMiddleware.authorization, this.categoryController.findAll);
    }
}