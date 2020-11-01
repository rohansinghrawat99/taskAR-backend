import { MemberStatus } from "../../util/enum.util";

export interface GroupUserUpdateDto {
  user_id: number;
  status: MemberStatus;
}