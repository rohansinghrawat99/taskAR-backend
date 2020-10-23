import { dbService } from "../services/db.service";
import faker from "faker";
import { User } from "../models/user.model";

dbService; // Initialising Sequelize...


const users: any[] = [
    {
        google_id: "3Wopu3vrHBPYtIBWU2aBre6xzUq2",
        name: "Rohan Singh Rawat",
        email: "rsrofficial99@gmail.com",
        profile_picture_url: "https://images.hdqwalls.com/wallpapers/bthumb/rog-logo-2020-4k-ii.jpg"
    }
];

export = {

    up: async () => {


        for (let i = 0; i < 20; i++) {

            users.push({
                google_id: faker.random.number(99999999999999),
                name: faker.name.firstName(0).concat(" " + faker.name.lastName()),
                email: faker.internet.email(),
                profile_picture_url: faker.internet.avatar(),
                createdAt: new Date()
            });
        }

        return User.bulkCreate(users);
    },

    down: async () => {
        return User.truncate();
    }
};
