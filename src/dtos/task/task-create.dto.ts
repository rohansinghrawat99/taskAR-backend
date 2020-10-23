import { TaskStatus } from "../../util/enum.util";

export interface TaskCreateDto {
  title: string;
  description: string;
  group_id?: number;
  assigned_to_id: number;
  due_time: string;
  status: TaskStatus;
}