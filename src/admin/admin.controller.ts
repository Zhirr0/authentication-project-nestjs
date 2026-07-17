import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  @ApiOperation({ summary: 'list all users - admin only' })
  findall() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'delete a user - admin only' })
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
