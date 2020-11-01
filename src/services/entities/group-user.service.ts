import logger from "../../util/logger.util";
import { GroupUser } from "../../models/group-user.model";
import { GroupUserCreateDto } from "../../dtos/group-user/group-user-create.dto";
import { GroupListDto } from "../../dtos/group/group-list.dto";
import { Op } from "sequelize";
import { MemberStatus, SortOrder } from "../../util/enum.util";
import { Group } from "../../models/group.model";

class GroupUserService {
  private constructor() {
    logger.silly("[tasker-backend] GroupUserService");
  }

  static getInstance(): GroupUserService {
    return new GroupUserService();
  }

  async index(): Promise<GroupUser[]> {
    return GroupUser.findAll();
  }

  async list(filters: GroupListDto, id: number): Promise<{ count: number, rows: GroupUser[] }> {
    const limit  = filters.limit ? filters.limit : 20;
    const offset = filters.page ? (filters.page - 1) * limit : 0;
    let whereClause: any;

    if (filters.query) {
      whereClause = {
        [Op.or]: {
          name: {
            [Op.like]: `%${filters.query}%`
          },
        },
      };
    }

    return GroupUser.findAndCountAll({
      where: {
        member_id: id
      },
      limit   : limit,
      offset  : offset,
      order   : [
        [
          filters.sort_by ? filters.sort_by : "name",
          filters.sort_order ? filters.sort_order : SortOrder.ASC
        ]
      ],
      include: [
        {
          model: Group,
          as: "group",
          where: whereClause
        }
      ]
    });
  }

  async showGroups(id: number): Promise<GroupUser[]> {
    return GroupUser.findAll({
      where: {
        member_id: id
      }
    });
  }

  async showMembers(id: number, status: MemberStatus): Promise<GroupUser[]> {
    return GroupUser.findAll({
      where: {
        group_id: id,
        status: status
      },
      order: [
        [
            "updatedAt",
            SortOrder.DESC
        ]
      ]
    });
  }

  async create(data: GroupUserCreateDto): Promise<GroupUser> {
    return GroupUser.create({
      ...data
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

  async acceptOrRejectMember(groupUser: GroupUser, status: MemberStatus): Promise<GroupUser> {
    return groupUser.update({
      status: status
    });
  }
}

export const groupUserService = GroupUserService.getInstance();