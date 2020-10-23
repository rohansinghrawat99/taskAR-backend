import { TaskStatus } from "../../util/enum.util";

export interface TaskUpdateDto {
  title: string;
  description: string;
  group_id: number;
  assigned_to_id: number;
  due_time: string;
  creator_id: number;
  status: TaskStatus;
}