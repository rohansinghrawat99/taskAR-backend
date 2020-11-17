import logger from "../../util/logger.util";
import { Group } from "../../models/group.model";
import { GroupCreateDto } from "../../dtos/group/group-create.dto";
import { Op } from "sequelize";
import { GroupUser } from "../../models/group-user.model";
import { User } from "../../models/user.model";
import { GroupRole, MemberStatus, SortOrder } from "../../util/enum.util";

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

    async showGroupMembers(groupId: number, status: MemberStatus): Promise<Group> {
        return Group.findOne({
            where: {
                id: groupId
            },
            include: [
                {
                    model: User,
                    as: "members",
                    required: true,
                    through: {
                        where: {
                            status: status
                        }
                    }
                }
            ]
        });
    }

    async showMyCreatedGroups(userId: number): Promise<Group[]> {
        return Group.findAll({
            where: {
                admin_id: userId
            },
            order: [
                [
                    "name", SortOrder.DESC
                ]
            ]
        });
    }

    async showMyJoinedGroups(userId: number): Promise<Group[]> {
        return Group.findAll({
            where: {
                admin_id: {
                    [Op.ne]: userId
                }
            },
            order: [
                [
                    "name", SortOrder.DESC
                ]
            ],
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

    async join(userId: number, groupId: number, role: GroupRole, status: MemberStatus): Promise<GroupUser> {
        return GroupUser.create({
            group_id: groupId,
            member_id: userId,
            role: role,
            status: status
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