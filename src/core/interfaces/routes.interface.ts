import { Router } from "express"

interface IRoute {
    path: string;
    router: Router;
    swaggerConfig?: object | any;
}

export default IRoute;