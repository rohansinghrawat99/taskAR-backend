import logger from "../../util/logger.util";
import { Group } from "../../models/group.model";
import { GroupCreateDto } from "../../dtos/group/group-create.dto";
import { Op } from "sequelize";
import { GroupUser } from "../../models/group-user.model";
import { User } from "../../models/user.model";
import { GroupRole } from "../../util/enum.util";

class GroupService {
    private constructor() {
        logger.silly("[tasker-backend] GroupService");
    }

    static getInstance(): GroupService {
        return new GroupService();
    }

    async index(): Promise<Group[]> {
        return Group.findAll();
    }

    async showById(id: number): Promise<Group> {
        return Group.findByPk(id);
    }

    async showByCode(code: string): Promise<Group> {
        return Group.findOne({
            where: {
                code: code
            }
        });
    }

    async showGroupUser(groupId: number, memberId: number): Promise<GroupUser> {
        return GroupUser.findOne({
            where: {
                group_id: groupId,
                member_id: memberId
            }
        });
    }

    async showGroupMembers(groupId: number): Promise<Group> {
        return Group.findOne({
            where: {
                id: groupId
            },
            include: [
                {
                    model: User,
                    as: "members"
                }
            ]
        });
    }

    async showMyCreatedGroups(userId: number): Promise<Group[]> {
        return Group.findAll({
            where: {
                admin_id: userId
            }
        });
    }

    async showMyJoinedGroups(userId: number): Promise<Group[]> {
        return Group.findAll({
            where: {
                admin_id: {
                    [Op.ne]: userId
                }
            },
            include: [
                {
                    model: User,
                    as: "members",
                    through: {
                        where: {
                            member_id: userId
                        }
                    }
                }
            ]
        });
    }

    async join(userId: number, groupId: number, role: GroupRole): Promise<GroupUser> {
        return GroupUser.create({
            group_id: groupId,
            member_id: userId,
            role: role
        });
    }

    async create(data: GroupCreateDto, admin_id: number, code: string): Promise<Group> {
        return Group.create({
            ...data,
            admin_id: admin_id,
            code: code
        });
    }
}

export const groupService = GroupService.getInstance();