import { ModelNotFoundException } from "../root/model-not-found.exception";
import { ApiErrorCode } from "../root/http.exception";

export class CannotEditTaskException extends ModelNotFoundException {

  constructor() {
    super("Cannot Edit Task You Haven't Created!", ApiErrorCode.CANNOT_EDIT_TASK);
  }
}