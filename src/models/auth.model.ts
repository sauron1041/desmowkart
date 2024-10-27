export interface IAuth {
    id?: number;
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    publish?: boolean;
    created_at?: Date;
    updated_at?: Date;
}