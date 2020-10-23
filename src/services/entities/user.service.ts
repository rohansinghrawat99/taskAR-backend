import logger from "../../util/logger.util";
import { User } from "../../models/user.model";
import { UserCreateDto } from "../../dtos/user/user-create.dto";
import { UserUpdateDto } from "../../dtos/user/user-update.dto";


class UserService {
    private constructor() {
        logger.silly("[tasker-backend] UserService");
    }

    static getInstance(): UserService {
        return new UserService();
    }

    async index(): Promise<User[]> {
        return User.findAll();
    }

    async showById(id: number): Promise<User> {
        return User.findByPk(id);
    }

    async showByGoogleId(googleId: string): Promise<User> {
        return User.findOne({
            where: {
                google_id: googleId
            }
        });
    }

    async showByEmail(email: string): Promise<User> {
        return User.findOne({
            where: {
                email: email
            }
        });
    }

    async create(data: UserCreateDto): Promise<User> {
        return User.create({
            ...data
        });
    }

    async update(user: User, data: UserUpdateDto): Promise<User> {
        return user.update({
            ...data
        });
    }
}

export const userService = UserService.getInstance();