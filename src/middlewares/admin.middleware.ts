import { NextFunction, Request, Response } from "express";
import { groupService } from "../services/entities/group.service";
import { GroupNotFoundException } from "../exceptions/group/group-not-found.exception";
import { GroupUserNotFoundException } from "../exceptions/group-user/group-user-not-found.exception";
import { GroupRole } from "../util/enum.util";
import { UnauthorizedException } from "../exceptions/root/unauthorized.exception";
import { ApiErrorCode } from "../exceptions/root/http.exception";
import { groupUserService } from "../services/entities/group-user.service";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const groupId = +req.params.id;
  const group = await groupService.showById(groupId);
  if (!group) {
      throw new GroupNotFoundException();
  }
  const groupUser = await groupUserService.showGroupUser(groupId, user.id);
  if (!groupUser) {
      throw new GroupUserNotFoundException();
  }
  if (groupUser.role !== GroupRole.ADMIN) {
      throw new UnauthorizedException("You are not authorized to perform this task", ApiErrorCode.USER_NOT_IN_THE_GROUP);
  }
  next();
};