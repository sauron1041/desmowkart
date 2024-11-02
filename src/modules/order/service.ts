import { HttpException } from "@core/exceptions";
import Skill from "./model"
import errorMessages from "@core/config/constants";
import { ISearchAndPagination } from "@core/types/express";
import { checkExistSequelize } from "@core/utils/checkExist";
import OrderDetailModel from "modules/orderDetail/model";
import { OrderDetailService } from "modules/orderDetail/service";
import { raw, RowDataPacket } from "mysql2";
import sequelize from "sequelize"; // Import sequelize from the package
import Customer from "modules/customer/model";
import Service from "modules/service/model";
import OrderDetail from "modules/orderDetail/model";
import { Op } from "sequelize";
import { calculateTotalAmount } from "./utils/calc";
export class OrderService {

    private orderDetailService = new OrderDetailService();

    constructor() {
        this.orderDetailService = new OrderDetailService();
    }
    // public create = async (model: Partial<Skill>) => {
    //     try {
    //         let result = await Skill.create(model);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }
    //         //create orderdetail
    //         for (const orderDetail of (model as RowDataPacket).orderDetail) {
    //             orderDetail.orderId = result.id;
    //             const rsDetail = await this.orderDetailService.create(orderDetail);
    //         }

    //         return {
    //             data: result
    //         }
    //     } catch (error) {
    //         return {
    //             error: error
    //         }
    //     }
    // }
    public create = async (model: Partial<Skill>) => {
        try {
            let result = await Skill.create(model);

            if (model.orderDetails && Array.isArray(model.orderDetails)) {
                for (const orderDetail of model.orderDetails) {
                    orderDetail.orderId = result.id;
                    await this.orderDetailService.create(orderDetail);
                }
            }

            return {
                data: {
                    ...result.dataValues,
                    ...model,

                }
            };
        } catch (error) {
            console.error('Error creating Skill:', error);
            return {
                error: error instanceof Error ? error.message : 'An unexpected error occurred.',
            };
        }
    }
    public update = async (model: Partial<Skill>, id: number) => {
        try {
            const check = await checkExistSequelize(Skill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const checkCustomer = await checkExistSequelize(Customer, 'id', model.customerId!);
            if (!checkCustomer) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'customerId');
            }
            const result = await Skill.update(model, {
                where: {
                    id: id
                }
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
            await this.orderDetailService.deleteByOrderId(id);
            if (model.orderDetails && Array.isArray(model.orderDetails)) {
                for (const orderDetails of model.orderDetails) {
                    orderDetails.orderId = Number(id);
                    await this.orderDetailService.create(orderDetails);
                }
            }
            return {
                data: {
                    id: result[0],
                    ...model
                }
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public delete = async (id: number) => {
        try {
            const check = await checkExistSequelize(Skill, 'id', id);
            if (!check) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }
            const result = await Skill.update({ isRemoved: true }, {
                where: {
                    id: id
                }
            });
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    // public findAll = async (model: Skill, search: Partial<ISearchAndPagination>) => {
    //     try {
    //         let result;
    //         const { page, limit, key, ...filteredModel } = model as any;
    //         const searchConditions: any = {
    //             [Op.and]: [{}, { ...filteredModel }]
    //         };

    //         if (key) {
    //             searchConditions[Op.and].push({
    //                 [Op.or]: [
    //                     { name: { [Op.like]: `%${key}%` } },
    //                     { phone: { [Op.like]: `%${key}%` } },
    //                 ]
    //             });
    //         }

    //         const options: any = {
    //             where: searchConditions,
    //             order: [['id', 'DESC']],
    //             includes: [
    //                 {
    //                     model: OrderDetail,
    //                     as: 'orderDetails',
    //                     required: false,
    //                     // attributes: ['id', 'orderId', 'serviceId', 'quantity', 'price', 'status'],
    //                     // include: [
    //                     //     {
    //                     //         model: Service,
    //                     //         as: 'service',
    //                     //         required: false,
    //                     //         attributes: ['id', 'name', 'price', 'status']
    //                     //     }
    //                     // ]
    //                 }
    //             ]
    //         }

    //         if (search.page && search.limit) {
    //             const pageNumber = parseInt(search.page.toString(), 10);
    //             const limitNumber = parseInt(search.limit.toString(), 10);
    //             const offset = (pageNumber - 1) * limitNumber;
    //             options.limit = limitNumber;
    //             options.offset = offset;
    //         }

    //         result = await Skill.findAll(options);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }

    //         return {
    //             data: result,
    //             pagination: search.page && search.limit ? {
    //                 page: Number(search.page),
    //                 limit: Number(search.limit),
    //                 totalRecords: result.length
    //             } : null
    //         };
    //     } catch (error) {
    //         return {
    //             error: error
    //         };
    //     }
    // }

    // public findAll = async (model: Skill, search: Partial<ISearchAndPagination>) => {
    //     try {
    //         let result;
    //         const { page, limit, key, ...filteredModel } = model as any;
    //         const searchConditions: any = {
    //             [Op.and]: [{}, { ...filteredModel }]
    //         };

    //         if (key) {
    //             searchConditions[Op.and].push({
    //                 [Op.or]: [
    //                     { name: { [Op.like]: `%${key}%` } },
    //                     { phone: { [Op.like]: `%${key}%` } },
    //                 ]
    //             });
    //         }

    //         const options: any = {
    //             where: searchConditions,
    //             order: [['id', 'DESC']],
    //             include: [
    //                 {
    //                     model: OrderDetail,
    //                     as: 'orderDetails',
    //                     required: false,
    //                     attributes: ['id', 'orderId', 'serviceId', 'quantity', 'price', 'createdAt',
    //                         [sequelize.col('service.name'), 'serviceName']
    //                     ],
    //                     include: [
    //                         {
    //                             model: Service,
    //                             as: 'service',
    //                             required: false,
    //                             attributes: []
    //                         }
    //                     ]
    //                 }
    //             ]
    //         };

    //         if (search.page && search.limit) {
    //             const pageNumber = parseInt(search.page.toString(), 10);
    //             const limitNumber = parseInt(search.limit.toString(), 10);
    //             const offset = (pageNumber - 1) * limitNumber;
    //             options.limit = limitNumber;
    //             options.offset = offset;
    //         }

    //         result = await Skill.findAll(options);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }

    //         return {
    //             data: result,
    //             pagination: search.page && search.limit ? {
    //                 page: Number(search.page),
    //                 limit: Number(search.limit),
    //                 totalRecords: result.length
    //             } : null
    //         };
    //     } catch (error) {
    //         return {
    //             error: error
    //         };
    //     }
    // };
    public findAll = async (model: Skill, search: Partial<ISearchAndPagination>) => {
        try {
            let result;
            const { page, limit, key, ...filteredModel } = model as any;
            const searchConditions: any = {
                [Op.and]: [{}, { ...filteredModel }]
            };

            if (key) {
                searchConditions[Op.and].push({
                    [Op.or]: [
                        { name: { [Op.like]: `%${key}%` } },
                        { phone: { [Op.like]: `%${key}%` } },
                    ]
                });
            }

            const options: any = {
                where: searchConditions,
                order: [['id', 'DESC']],
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetails',
                        required: false,
                        attributes: [
                            'id',
                            'orderId',
                            'serviceId',
                            'quantity',
                            'price',
                            'createdAt',
                        ],
                        include: [
                            {
                                model: Service,
                                as: 'service',
                                required: false,
                                attributes: [
                                    'id',
                                    'name',
                                ]
                            }
                        ]
                    }
                ],
            };
            if (search.page && search.limit) {
                const pageNumber = parseInt(search.page.toString(), 10);
                const limitNumber = parseInt(search.limit.toString(), 10);
                const offset = (pageNumber - 1) * limitNumber;
                options.limit = limitNumber;
                options.offset = offset;
            }
            result = await Skill.findAll(options);
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }

            let ordersWithTotal = [];
            // if(result.length > 0) {
            //     ordersWithTotal = result.map((order) => {
            //         const orderData = order.get({ plain: true });
            //         const totalAmount = calculateTotalAmount(orderData.orderDetails);
            //         return {
            //             ...orderData,
            //             totalAmount
            //         };
            //     });
            // }
            if (result.length > 0) {
                ordersWithTotal = result.map((order) => {
                    // const orderDetail = order.get({ plain: true }).orderDetails;

                    //tinh tong tien trong order detail xong moi tinh ben ngoai order
                    const orderDetailHanle = order.get({ plain: true }).orderDetails;
                    // let totalAmount = 0;
                    // orderDetailHanle.forEach((orderDetail: any) => {
                    //     totalAmount += orderDetail.price * orderDetail.quantity;

                    //     return {
                    //         ...orderDetail,
                    //         totalAmount
                    //     }
                    // });
                    // const orderMap = orderDetailHanle.map((orderDetail: any) => {
                    //     totalAmount += orderDetail.price * orderDetail.quantity;

                    //     console.log("orderDetail", orderDetail);

                    //     return {
                    //         ...orderDetail,
                    //         totalAmount
                    //     }
                    // })
                    // return {
                    //     // ...order.get({ plain: true }),
                    //     ...order.get({ plain: true }),
                    //     orderDetails: orderMap,
                    //     totalAmount
                    // };

                    // const orderMap = orderDetailHanle.map((orderDetail: any) => {
                    //     // Tính tổng cho từng chi tiết đơn hàng (orderDetail)
                    //     const itemTotalAmount = orderDetail.price * orderDetail.quantity;

                    //     console.log("orderDetail", orderDetail);

                    //     return {
                    //         ...orderDetail,
                    //         totalAmount: itemTotalAmount
                    //     };
                    // });

                    const orderMap = orderDetailHanle.map((orderDetail: any) => {
                        const itemTotalAmount = orderDetail.price * orderDetail.quantity;

                        return {
                            ...orderDetail,
                            serviceName: orderDetail.service.name, // Thêm serviceName từ service
                            totalAmount: itemTotalAmount,
                            service: undefined // Xóa đối tượng service
                        };
                    });

                    // Tính tổng của tất cả các chi tiết đơn hàng
                    const totalAmount = orderMap.reduce((acc: any, item: any) => acc + item.totalAmount, 0);

                    return {
                        ...order.get({ plain: true }),
                        orderDetails: orderMap,
                        totalAmount
                    };


                })
            }
            return {
                data: ordersWithTotal,
                pagination: search.page && search.limit ? {
                    page: Number(search.page),
                    limit: Number(search.limit),
                    totalRecords: result.length
                } : null
            };
        } catch (error) {
            return {
                error: error
            };
        }
    };
    public findOne = async (model: Partial<Skill>) => {
        try {
            const result = await Skill.findOne({
                where: model
            });
            if (result instanceof Error) {
                return new HttpException(400, result.message);
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public updateStatus = async (id: number) => {
        const check = await checkExistSequelize(Skill, 'id', id);
        if (!check) {
            return new HttpException(404, errorMessages.NOT_FOUND, 'id');
        }
        const status = check.status === true ? false : true;
        const result = await Skill.update({ status: status }, {
            where: {
                id: id
            }
        });
    }
    public updateListStatus = async (ids: number[], status: boolean) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Skill, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await Skill.update({ status: status }, {
                    where: {
                        id: id
                    }
                });
            }
            return {
                data: ids
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    // public findById = async (id: number) => {
    //     try {
    //         const result = await checkExistSequelize(Skill, 'id', id);
    //         if (result instanceof Error) {
    //             return new HttpException(400, result.message);
    //         }
    //         if (!result) {
    //             return new HttpException(404, errorMessages.NOT_FOUND, 'id');
    //         }
    //         return {
    //             data: result
    //         }
    //     } catch (error) {
    //         return {
    //             error: error
    //         }
    //     }
    // }
    public findById = async (model: Partial<Skill>) => {
        console.log("model", model);
        
        try {

            const options: any = {
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetails',
                        required: false,
                        attributes: [
                            'id',
                            'orderId',
                            'serviceId',
                            'quantity',
                            'price',
                            'createdAt',
                        ],
                        include: [
                            {
                                model: Service,
                                as: 'service',
                                required: false,
                                attributes: [
                                    'id',
                                    'name',
                                ]
                            }
                        ]
                    }
                ],
            };

            const result = await Skill.findOne({
                where: model,
                ...options
            })

            if (!result) {
                return new HttpException(404, errorMessages.NOT_FOUND, 'id');
            }

            const resultData = result.get({ plain: true });
            const orderMap = resultData.orderDetails?.map((orderDetail: any) => {
                const itemTotalAmount = orderDetail.price * orderDetail.quantity;
    
                return {
                    ...orderDetail,
                    serviceName: orderDetail.service?.name, // Thêm serviceName từ service
                    totalAmount: itemTotalAmount,
                    service: undefined // Xóa đối tượng service
                };
            }) || [];
    
            // Tính tổng của tất cả các chi tiết đơn hàng
            const totalAmount = orderMap.reduce((acc: number, item: any) => acc + item.totalAmount, 0);
    
            return {
                ...resultData,
                orderDetails: orderMap,
                totalAmount
            };
    

        } catch (error) {
            return {
                error: error
            };
        }
    };

    public deleteList = async (ids: number[]) => {
        try {
            for (const id of ids) {
                const check = await checkExistSequelize(Skill, 'id', id);
                if (!check) {
                    return new HttpException(404, errorMessages.NOT_FOUND, 'id');
                }
                await this.delete(id);
            }
            return {
                data: ids
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public findAllOrderByOrderDetailId = async (orderDetailId: number) => {
        try {
            // const result = await sequelize.query(`
            //     SELECT * FROM Orders
            //     WHERE id IN (
            //         SELECT orderId FROM order_details
            //         WHERE id = ${orderDetailId}
            //     )
            // `);
            return {
                // data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
    public deleteByOrderId = async (orderId: number) => {
        try {
            const result = await OrderDetailModel.destroy({
                where: {
                    orderId: orderId
                }
            });
            return {
                data: result
            }
        } catch (error) {
            return {
                error: error
            }
        }
    }
}