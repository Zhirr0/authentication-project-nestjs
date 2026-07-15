import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDtoTs {
    @ApiProperty({ example: 'john@example.com'})
    @IsEmail()
    email!: string;

    @ApiProperty({example: 'password123'})
    @IsString()
    @IsNotEmpty()
    password!: string;
}
