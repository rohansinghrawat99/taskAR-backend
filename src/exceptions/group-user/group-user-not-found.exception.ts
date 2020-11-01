import { ModelNotFoundException } from "../root/model-not-found.exception";
import { ApiErrorCode } from "../root/http.exception";

export class GroupUserNotFoundException extends ModelNotFoundException {

  constructor() {
    super("User Not In The Group!", ApiErrorCode.USER_NOT_IN_THE_GROUP);
  }
}