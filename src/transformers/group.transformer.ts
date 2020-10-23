import { Dictionary } from "async";
import { TransformerAbstract } from "./base/transformer.abstract";
import { Group } from "../models/group.model";
import { isUndefined } from "util";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";

export class GroupTransformer extends TransformerAbstract<Group> {

    defaultIncludes = ["admin"];

    async includeAdmin(group: Group): Promise<Dictionary<any>> {
        // Checking if Tag is eager loaded...
        let user = group.admin;
        if (!group.admin_id) {
            return null;
        }

        if (isUndefined(user)) {
            // Loading it because it's not eager loaded...
            user = await group.$get("admin") as User;
        }
        return new UserTransformer().transform(user);
    }

    async includeMembers(group: Group): Promise<Dictionary<any>> {
        // Checking if Tag is eager loaded...
        let users = group.members;

        if (isUndefined(users)) {
            // Loading it because it's not eager loaded...
            users = await group.$get("members") as User[];
        }
        return new UserTransformer().transformList(users);
    }

    protected _map(group: Group): Dictionary<any> {
        return {
            id: group.id,
            name: group.name,
            admin_id: group.admin_id,
            code: group.code,
            created_at: group.createdAt,
            updated_at: group.updatedAt,
        };
    }
}