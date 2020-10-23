import { dbService } from "../services/db.service";
import faker from "faker";
import { userService } from "../services/entities/user.service";
import { groupService } from "../services/entities/group.service";
import moment from "moment";
import { Task } from "../models/task.model";
import { Helpers } from "../util/helpers.util";
import { TaskStatus } from "../util/enum.util";

dbService; // Initialising Sequelize...


const tasks: any[] = [
    {
        title: "Trash",
        description: "Take the trash bags out",
        group_id: 1,
        assigned_to_id: 1,
        due_time: moment().add(1, "hour"),
        status: TaskStatus.TO_DO,
        creator_id: 1
    }
];

export = {

    up: async () => {

        const group_ids = [];
        const users = await userService.index();
        const groups = await groupService.index();
        const status = Helpers.iterateEnum(TaskStatus);
        groups.forEach((group) => group_ids.push(group.id));
        group_ids.push(null);

        for (let i = 1; i <= 50; i++) {

            tasks.push({
                title: faker.random.words(),
                description: faker.random.words(),
                due_time: moment().add(i + 1, "hours"),
                status: faker.random.arrayElement(status),
                creator_id: faker.random.arrayElement(users).id
            });
        }

        for (let j = 1; j <= 20; j++) {
            for (let i = 1; i <= 20; i++) {
                tasks.push({
                    title: faker.random.words(),
                    description: faker.random.words(),
                    assigned_to_id: faker.random.arrayElement(users).id,
                    group_id: groups[j].id,
                    due_time: moment().add(i + 1, "hours"),
                    status: faker.random.arrayElement(status),
                    creator_id: groups[j].admin_id
                });
            }
        }

        return Task.bulkCreate(tasks);
    },

    down: async () => {
        return Task.truncate();
    }
};
