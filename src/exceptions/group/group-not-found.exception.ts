import { ModelNotFoundException } from "../root/model-not-found.exception";
import { ApiErrorCode } from "../root/http.exception";

export class GroupNotFoundException extends ModelNotFoundException {

  constructor() {
    super("Group Not Found!", ApiErrorCode.GROUP_NOT_FOUND);
  }
}