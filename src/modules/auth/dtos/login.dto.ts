import { IsNotEmpty, IsOptional, IsString } from "class-validator";
export class LoginDto {
    @IsOptional()
    @IsString()
    public username!: string;

    @IsOptional()
    @IsString()
    public phone?: string;

    @IsNotEmpty()
    @IsString()
    public password!: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
export default LoginDto;