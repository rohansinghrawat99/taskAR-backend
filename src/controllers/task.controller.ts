import { Request, Response } from "express";
import { taskService } from "../services/entities/task.service";
import { TaskTransformer } from "../transformers/task.transformer";
import { TaskStatus } from "../util/enum.util";
import { TaskNotFoundException } from "../exceptions/tasks/task-not-found.exception";
import { groupService } from "../services/entities/group.service";
import { GroupNotFoundException } from "../exceptions/group/group-not-found.exception";
import { TaskUpdateDto } from "../dtos/task/task-update.dto";
import { TaskCreateDto } from "../dtos/task/task-create.dto";
import { CannotEditTaskException } from "../exceptions/tasks/cannot-edit-task.exception";

export class TaskController {
    static async listPersonalToDo(req: Request, res: Response) {
        const tasks = await taskService.listPersonalTasks(req.user.id, TaskStatus.TO_DO);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listPersonalOverDue(req: Request, res: Response) {
        const tasks = await taskService.listPersonalTasks(req.user.id, TaskStatus.OVERDUE);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listPersonalCompleted(req: Request, res: Response) {
        const tasks = await taskService.listPersonalTasks(req.user.id, TaskStatus.COMPLETED);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async showById(req: Request, res: Response) {
        const taskId = +req.params.id;
        const task = await taskService.showById(taskId);

        if (!task) {
            throw new TaskNotFoundException();
        }

        return res.json({
            data: await (new TaskTransformer().transform(task))
        });
    }

    static async listMyGroupTodo(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);

        if (!group) {
            throw new GroupNotFoundException();
        }

        const tasks = await taskService.listGroupTasks(groupId, TaskStatus.TO_DO, req.user.id);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listMyGroupCompleted(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);

        if (!group) {
            throw new GroupNotFoundException();
        }

        const tasks = await taskService.listGroupTasks(groupId, TaskStatus.COMPLETED, req.user.id);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listMyGroupOverDue(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);

        if (!group) {
            throw new GroupNotFoundException();
        }

        const tasks = await taskService.listGroupTasks(groupId, TaskStatus.OVERDUE, req.user.id);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listMyGroupUnderReview(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);

        if (!group) {
            throw new GroupNotFoundException();
        }

        const tasks = await taskService.listGroupTasks(groupId, TaskStatus.UNDER_REVIEW, req.user.id);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks))
        });
    }

    static async listAllGroupTasks(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);

        if (!group) {
            throw new GroupNotFoundException();
        }

        const tasks = await taskService.listAllGroupTasks(groupId);

        return res.json({
            data: await (new TaskTransformer().transformList(tasks, ["assignedTo"]))
        });
    }

    static async create(req: Request, res: Response) {
        const inputData = req.body as TaskCreateDto;
        const task = await taskService.create(inputData, req.user.id);
        return res.json({
            data: await (new TaskTransformer().transform(task))
        });
    }

    static async updateTaskStatus(req: Request, res: Response) {
        const taskId = +req.params.id;
        const inputData = req.body as TaskUpdateDto;
        const task = await taskService.showById(taskId);
        if (!task) {
            throw new TaskNotFoundException();
        }
        if (req.user.id !== task.creator_id) {
            throw new CannotEditTaskException();
        }
        const updatedTask = await taskService.update(task, inputData);
        return res.json({
            data: await (new TaskTransformer().transform(updatedTask))
        });
    }

    static async delete(req: Request, res: Response) {
        const taskId = +req.params.id;
        const task = await taskService.showById(taskId);
        if (!task) {
            throw new TaskNotFoundException();
        }
        await taskService.delete(task);
        return res.json({
            success: true
        });
    }
}