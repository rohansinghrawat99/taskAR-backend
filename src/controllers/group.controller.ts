import { Request, Response } from "express";
import { groupService } from "../services/entities/group.service";
import { GroupTransformer } from "../transformers/group.transformer";
import { GroupCreateDto } from "../dtos/group/group-create.dto";
import { Helpers } from "../util/helpers.util";
import { GroupRole, MemberStatus } from "../util/enum.util";
import { GroupJoinDto } from "../dtos/group/group-join.dto";
import { GroupUserTransformer } from "../transformers/group-user.transformer";
import { GroupNotFoundException } from "../exceptions/group/group-not-found.exception";
import { MemberAlreadyExistsException } from "../exceptions/group/member-already-exists.exception";
import { groupUserService } from "../services/entities/group-user.service";
import { GroupUserUpdateDto } from "../dtos/group-user/group-user-update.dto";
import { GroupUserNotFoundException } from "../exceptions/group-user/group-user-not-found.exception";

export class GroupController {
    static async listMyCreatedGroups(req: Request, res: Response) {
        const myGroups = await groupService.showMyCreatedGroups(req.user.id);
        return res.json({
            data: await (new GroupTransformer().transformList(myGroups))
        });
    }

    static async listMyJoinedGroups(req: Request, res: Response) {
        const joinedGroups = await groupService.showMyJoinedGroups(req.user.id);
        return res.json({
            data: await (new GroupTransformer().transformList(joinedGroups))
        });
    }

    static async create(req: Request, res: Response) {
        const inputData = req.body as GroupCreateDto;
        const code = Helpers.generateRandomString(9, {
            includeLowerCase: true,
            includeSpecialCharacters: false,
            includeNumbers: true,
            includeUpperCase: true
        });
        const group = await groupService.create(inputData, req.user.id, code);
        const join = await groupService.join(req.user.id, group.id, GroupRole.ADMIN, MemberStatus.ACCEPTED);
        return res.json({
            data: await (new GroupTransformer().transform(group))
        });
    }

    static async join(req: Request, res: Response) {
        const inputData = req.body as GroupJoinDto;
        const group = await groupService.showByCode(inputData.code);
        if (!group) {
            throw new GroupNotFoundException();
        }
        const groupUser = await groupUserService.showGroupUser(group.id, req.user.id);
        if (groupUser) {
            throw new MemberAlreadyExistsException();
        }
        const join = await groupService.join(req.user.id, group.id, GroupRole.MEMBER, MemberStatus.PENDING);
        return res.json({
            data: await (new GroupUserTransformer().transform(join))
        });
    }

    static async showAcceptedGroupMembers(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);
        if (!group) {
            throw new GroupNotFoundException();
        }
        const members = await groupUserService.showMembers(groupId, MemberStatus.ACCEPTED);
        return res.json({
            data: await (new GroupUserTransformer().transformList(members, ["member"]))
        });
    }

    static async showPendingGroupMembers(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);
        if (!group) {
            throw new GroupNotFoundException();
        }
        const members = await groupUserService.showMembers(groupId, MemberStatus.PENDING);
        return res.json({
            data: await (new GroupUserTransformer().transformList(members, ["member"]))
        });
    }

    static async acceptOrRejectGroupMember(req: Request, res: Response) {
        const groupId = +req.params.id;
        const group = await groupService.showById(groupId);
        if (!group) {
            throw new GroupNotFoundException();
        }
        const inputData = req.body as GroupUserUpdateDto;

        const groupUser = await groupUserService.showGroupUser(groupId, inputData.user_id);
        if (!groupUser) {
            throw new GroupUserNotFoundException();
        }
        const updatedGroupUser = await groupUserService.acceptOrRejectMember(groupUser, inputData.status);

        return res.json({
            data: await (new GroupUserTransformer().transform(updatedGroupUser, ["member"]))
        });
    }
}