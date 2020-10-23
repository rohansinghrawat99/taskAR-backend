import { SortOrder } from "../util/enum.util";

export interface IndexDto {
  query?: string;
  limit?: number;
  offset?: number;
  page?: number;
  sort_order?: SortOrder;
  sort_by?: string;
}