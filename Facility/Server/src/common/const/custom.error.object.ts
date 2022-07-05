import { CustomTreeError } from "./custom.error.enum";


export const has_children_error: errorObject = {
  message: "This node has children, you can not delete it",
  code: CustomTreeError.HAS_CHILDREN,
};
