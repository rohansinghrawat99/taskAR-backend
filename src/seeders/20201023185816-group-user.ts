import { dbService } from "../services/db.service";
import faker from "faker";
import { GroupRole } from "../util/enum.util";
import { groupService } from "../services/entities/group.service";
import { GroupUser } from "../models/group-user.model";

dbService; // Initialising Sequelize...


const groupUsers: any[] = [
    {
        group_id: 1,
        member_id: 1,
        role: GroupRole.ADMIN
    }
];

export = {

    up: async () => {

        const groups = await groupService.index();
        const groupIds = groups.map(i => i.id);
        for (let i = 0; i < 20; i++) {
            groupUsers.push({
                group_id: faker.random.arrayElement(groupIds),
                member_id: 1,
                role: GroupRole.MEMBER
            });
        }

        return GroupUser.bulkCreate(groupUsers);
    },

    down: async () => {
        return GroupUser.truncate();
    }
};
