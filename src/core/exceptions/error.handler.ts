import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'SequelizeDatabaseError' && err.parent?.code === 'ER_BAD_FIELD_ERROR') {
        // Trường hợp lỗi do cột không tồn tại
        return res.status(400).json({
            status: 'error',
            message: 'Lỗi truy vấn: Cột không tồn tại trong cơ sở dữ liệu.',
            details: err.parent.sqlMessage,
        });
    } else if (err instanceof ValidationError) {
        // Trường hợp lỗi validation trong Sequelize
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            details: err.errors.map((e: any) => e.message),
        });
    } else {
        // Các lỗi khác
        console.error(err);
        return res.status(500).json({
            status: 'error',
            message: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        });
    }
};

export default errorHandler;