import { Dictionary } from "async";
import { TransformerAbstract } from "./base/transformer.abstract";
import { Task } from "../models/task.model";
import { isUndefined } from "util";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";

export class TaskTransformer extends TransformerAbstract<Task> {

    defaultIncludes = ["assignedTo", "creatorUser"];

    async includeAssignedTo(task: Task): Promise<Dictionary<any>> {
        // Checking if User is eager loaded...
        let user = task.assignedTo;
        if (!task.assigned_to_id) {
            return null;
        }

        if (isUndefined(user)) {
            // Loading it because it's not eager loaded...
            user = await task.$get("assignedTo") as User;
        }
        return new UserTransformer().transform(user);
    }

    async includeCreatorUser(task: Task): Promise<Dictionary<any>> {
        // Checking if Creator is eager loaded...
        let creator = task.creatorUser;
        if (!task.creator_id) {
            return null;
        }

        if (isUndefined(creator)) {
            // Loading it because it's not eager loaded...
            creator = await task.$get("creatorUser") as User;
        }
        return new UserTransformer().transform(creator);
    }

    protected _map(task: Task): Dictionary<any> {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            group_id: task.group_id,
            assigned_to_id: task.assigned_to_id,
            due_time: task.due_time,
            status: task.status,
            creator: task.creator_id,
            created_at: task.createdAt,
            updated_at: task.updatedAt,
        };
    }
}