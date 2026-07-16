import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/db';
import { tasks } from 'src/db/schema';
import { CreateTasksDto } from './dto/create-tasks.dto';

@Injectable()
export class TasksService {
  async findAllForUser(userId: string) {
    return db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
    });
  }

  async create(userId: string, dto: CreateTasksDto) {
    const [task] = await db
      .insert(tasks)
      .values({ ...dto, userId })
      .returning();

    return task;
  }

  async update(id: string, userId: string, data: Partial<CreateTasksDto>) {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) throw new NotFoundException('task not found');

    if (task.userId !== userId) {
      throw new ForbiddenException('you do not own this task');
    }

    const [update] = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    return update;
  }

  async delete(id: string, userId: string) {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) {
      throw new NotFoundException("a task like this doesn't exist to delete");
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('you do not own this task');
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return {
      message: 'task deleted successfuly',
    };
  }
}
