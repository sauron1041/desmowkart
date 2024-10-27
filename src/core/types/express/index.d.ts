export interface IPagination {
  page: number;
  limit: number;
  filters?: any;
}

export interface ISearchAndPagination {
    key?: string;
    page?: number;
    limit?: number;
}

import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            pagination? : IPagination,
            email?: string,
            id?: number,
            role?: number,
        }
    }
}