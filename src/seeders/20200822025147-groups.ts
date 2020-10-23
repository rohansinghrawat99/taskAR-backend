import { dbService } from "../services/db.service";
import faker from "faker";
import { userService } from "../services/entities/user.service";
import { Group } from "../models/group.model";
import { Helpers } from "../util/helpers.util";

dbService; // Initialising Sequelize...


const groups: any[] = [
    {
        name: "DevsLane",
        admin_id: 1,
        code: "jx3qrtlm"
    }
];

export = {

    up: async () => {

        const users = await userService.index();

        for (let i = 0; i < 20; i++) {

            groups.push({
                name: faker.company.companyName(),
                admin_id: faker.random.arrayElement(users).id,
                code: Helpers.generateRandomString(9, {includeLowerCase: true, includeSpecialCharacters: false, includeNumbers: true, includeUpperCase: true})
            });
        }

        return Group.bulkCreate(groups);
    },

    down: async () => {
        return Group.truncate();
    }
};
