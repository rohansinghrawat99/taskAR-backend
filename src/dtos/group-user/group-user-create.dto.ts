import { GroupRole } from "../../util/enum.util";

export interface GroupUserCreateDto {
  group_id: number;
  user_id: number;
  role: GroupRole;
}