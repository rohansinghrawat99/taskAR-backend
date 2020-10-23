import { ApiErrorCode } from "../root/http.exception";
import { ModelAlreadyExistsException } from "../root/model-already-exists.exception";

export class MemberAlreadyExistsException extends ModelAlreadyExistsException {

  constructor() {
    super("Member Already Exists In The Group!", ApiErrorCode.MEMBER_ALREADY_EXISTS);
  }
}