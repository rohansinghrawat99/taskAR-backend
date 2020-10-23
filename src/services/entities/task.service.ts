import logger from "../../util/logger.util";
import { Task } from "../../models/task.model";
import { TaskStatus } from "../../util/enum.util";
import { TaskCreateDto } from "../../dtos/task/task-create.dto";
import { TaskUpdateDto } from "../../dtos/task/task-update.dto";


class TaskService {
    private constructor() {
        logger.silly("[tasker-backend] UserService");
    }

    static getInstance(): TaskService {
        return new TaskService();
    }

    async listPersonalTasks(userId: number, status: string): Promise<Task[]> {
        return Task.findAll({
            where: {
                group_id: null,
                creator_id: userId,
                status: status
            }
        });
    }

    async listGroupTasks(groupId: number, status: TaskStatus, userId?: number): Promise<Task[]> {
        return Task.findAll({
            where: {
                group_id: groupId,
                assigned_to_id: userId ? userId : null,
                status: status
            }
        });
    }

    async listAllGroupTasks(groupId: number): Promise<Task[]> {
        return Task.findAll({
            where: {
                group_id: groupId,
            }
        });
    }

    async showById(id: number): Promise<Task> {
        return Task.findByPk(id);
    }

    async create(data: TaskCreateDto, userId: number): Promise<Task> {
        return Task.create({
            ...data,
            creator_id: userId
        });
    }

    async update(task: Task, data: TaskUpdateDto): Promise<Task> {
        return task.update({
            ...data
        });
    }

    async delete(task: Task): Promise<void> {
        return task.destroy();
    }
}

export const taskService = TaskService.getInstance();