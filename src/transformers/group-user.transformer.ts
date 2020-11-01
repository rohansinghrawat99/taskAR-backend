import { Dictionary } from "async";
import { TransformerAbstract } from "./base/transformer.abstract";
import { Group } from "../models/group.model";
import { isUndefined } from "util";
import { User } from "../models/user.model";
import { UserTransformer } from "./user.transformer";
import { GroupUser } from "../models/group-user.model";
import { GroupTransformer } from "./group.transformer";

export class GroupUserTransformer extends TransformerAbstract<GroupUser> {

    defaultIncludes = ["member", "group"];

    async includeMember(groupUser: GroupUser): Promise<Dictionary<any>> {
        // Checking if Tag is eager loaded...
        let user = groupUser.user;
        if (!groupUser.member_id) {
            return null;
        }

        if (isUndefined(user)) {
            // Loading it because it's not eager loaded...
            user = await groupUser.$get("user") as User;
        }
        return new UserTransformer().transform(user);
    }

    async includeGroup(groupUser: GroupUser): Promise<Dictionary<any>> {
        // Checking if Tag is eager loaded...
        let group = groupUser.group;
        if (!groupUser.group_id) {
            return null;
        }

        if (isUndefined(group)) {
            // Loading it because it's not eager loaded...
            group = await groupUser.$get("group") as Group;
        }
        return new GroupTransformer().transform(group);
    }

    protected _map(groupUser: GroupUser): Dictionary<any> {
        return {
            id: groupUser.id,
            group_id: groupUser.group_id,
            member_id: groupUser.member_id,
            role: groupUser.role,
            status: groupUser.status,
            created_at: groupUser.createdAt,
            updated_at: groupUser.updatedAt,
        };
    }
}