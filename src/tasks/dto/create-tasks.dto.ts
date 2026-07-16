import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTasksDto {
  @ApiProperty({ example: 'build auth system' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'implement JWT with refresh tokens',
    required: false,
  })
  @IsString()
  @IsOptional()
  description!: string;
}
