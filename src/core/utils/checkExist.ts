import database from "@core/config/database";
import { RowDataPacket } from "mysql2";
import { Op } from "sequelize";

export const checkExist = async (tableName: string, column: string, value: string, id?: string) => {
    let query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;
    const params: any[] = [value];
    if (id) {
        query += ` AND id != ?`
        params.push(id);
    }
    const checkExist = await database.executeQuery(query, params);
    if (Array.isArray(checkExist) && checkExist.length > 0)
        return checkExist as RowDataPacket[0];
    return false
}

export const checkExistSequelize = async (model: any, column: string, value: string | number, id?: string | number) => {
    if (id) {
        const checkExist = await model.findOne({
            where: {
                [column]: value,
                id: {
                    [Op.ne]: id
                }
            }
        });
        if (checkExist)
            return checkExist;
        return false
    }
    const checkExist = await model.findOne({
        where: {
            [column]: value
        }
    });
    if (checkExist)
        return checkExist;
    return false
}
