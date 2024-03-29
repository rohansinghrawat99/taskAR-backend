import logger from "../../util/logger.util";
import { Task } from "../../models/task.model";
import { SortOrder, TaskStatus } from "../../util/enum.util";
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
            },
            order: [
                [
                    "due_time", SortOrder.DESC
                ]
            ]
        });
    }

    async listGroupTasks(groupId: number, status: TaskStatus, userId?: number): Promise<Task[]> {
        return Task.findAll({
            where: {
                group_id: groupId,
                assigned_to_id: userId ? userId : null,
                status: status
            },
            order: [
                [
                    "due_time", SortOrder.DESC
                ]
            ]
        });
    }

    async listAllGroupTasks(groupId: number): Promise<Task[]> {
        return Task.findAll({
            where: {
                group_id: groupId,
            },
            order: [
                [
                    "due_time", SortOrder.DESC
                ]
            ]
        });
    }

    async showById(id: number): Promise<Task> {
        return Task.findByPk(id);
    }

    async create(data: TaskCreateDto, userId: number): Promise<Task> {
        return Task.create({
            ...data,
            status: TaskStatus.TO_DO,
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