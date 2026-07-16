import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/db/schema';
import { CreateTasksDto } from './dto/create-tasks.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'get all tasks for current user' })
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAllForUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'create a  new task' })
  create(@CurrentUser() user: User, @Body() dto: CreateTasksDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'updatea a task' })
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTasksDto>,
  ) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a task' })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tasksService.delete(user.id, id);
  }
}
