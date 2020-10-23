import { ModelNotFoundException } from "../root/model-not-found.exception";
import { ApiErrorCode } from "../root/http.exception";

export class TaskNotFoundException extends ModelNotFoundException {

  constructor() {
    super("Task Not Found!", ApiErrorCode.TASK_NOT_FOUND);
  }
}