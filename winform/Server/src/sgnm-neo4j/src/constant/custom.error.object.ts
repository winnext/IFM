import { CustomNeo4jError } from "./custom.error.enum";

export const has_children_error: errorObject = {
  message: "This node has children, you can not delete it",
  code: CustomNeo4jError.HAS_CHILDREN,
};
