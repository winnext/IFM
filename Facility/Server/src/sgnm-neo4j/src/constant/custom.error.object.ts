import { CustomNeo4jError } from "./custom.error.enum";

export const has_children_error: errorObject = {
  message: "This node has children, you can not delete it",
  code: CustomNeo4jError.HAS_CHILDREN,
};

export const node_not_found: errorObject = {
  message: "This node is not found in the database maybe entered id not found in the database",
  code: CustomNeo4jError.NOT_FOUND,
};

export const tree_not_found: errorObject = {
  message: "Tree is not found in the database",
  code: CustomNeo4jError.NOT_FOUND,
};

export const parent_has_not_children: errorObject = {
  message: "This parent has not children",
  code: CustomNeo4jError.HAS_NOT_CHILDREN,
};

export const root_node_not_found: errorObject = {
  message: "There is not found root node",
  code: CustomNeo4jError.ROOT_NODE_NOT_FOUND,
};

export const parent_of_child_not_found: errorObject = {
  message: "This child has not a parent",
  code: CustomNeo4jError.PARENT_NOT_FOUND,
};

export const get_children_count_by_id_and_labels__not_found_error: errorObject = {
  message: "This children count not found by id and labels",
  code: CustomNeo4jError.GET_CHILDREN_COUNT_BY_ID_AND_LABELS_NOT_FOUND,
};

export const node_not_created: errorObject = { 
  message: "Node not created",
  code: CustomNeo4jError.NODE_NOT_CREATED,
};
export const create_node_with_label__node_not_created_error: errorObject = { 
  message: "Node not created maybe entity has missing properties or label is not valid",
  code: CustomNeo4jError.CREATE_NODE_WITH_LABEL__NODE_NOT_CREATED,
};
export const create_node__node_not_created_error: errorObject = {
  message: "Node not created",
  code: CustomNeo4jError.CREATE_NODE__NODE_NOT_CREATED_ERROR,
};


export const create_node_with_label_add_parent_by_labelclass_error: errorObject = {
  message: "Node not created",
  code: CustomNeo4jError.CREATE_NODE_WITH_LABEL_ADD_PARENT_BY_LABELCLASS,
};


export const deleteParentRelationError: errorObject = {
  message: "Relation not deleted",
  code: CustomNeo4jError.CREATE_NODE_WITH_LABEL_ADD_PARENT_BY_LABELCLASS,
};

export const invalid_label_error: errorObject = {
  message: "This label is not valid",
  code: CustomNeo4jError.INVALID_LABEL_ERROR,
};

export const delete_children_nodes_by_id_and_labels__not_deleted_error: errorObject = {
  message: "Children id or labels not found in database",
  code: CustomNeo4jError.DELETE_CHILDREN_NODES_BY_ID_AND_LABELS__NOT_DELETED_ERROR,
};


export const find_all_by_classname__find_node_count_by_classname_error: errorObject = {
  message: "This classname has not used in the any nodess",
  code: CustomNeo4jError.FIND_ALL_BY_CLASSNAME__FIND_NODE_COUNT_BY_CLASSNAME_ERROR,
};

export const get_node_without_parent: errorObject = {
  message: "This classname has not used in the any node",
  code: CustomNeo4jError.GET_NODE_WITHOUT_PARENT_ERROR,
};

export const delete__get_parent_by_id_error: errorObject = {
  message: "This parent was not found in the database",
  code: CustomNeo4jError.DELETE__GET_PARENT_BY_ID,
};

export const find_with_children_by_id_and_labels_as_tree__has_not_children_error: errorObject = {
  message: "This parent was not found in the database",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_ID_AND_LABELS_AS_TREE__HAS_NO_CHILDREN_ERROR,
};

export const find_node_count_by_classname_error: errorObject = {
  message: "This classname not used any nodes in the database",
  code: CustomNeo4jError.FIND_NODE_COUNT_BY_CLASSNAME_ERROR,
};

export const update_by_id__node_not_found: errorObject = {
  message: "This node is not found in the database",
  code: CustomNeo4jError.UPDATE_BY_ID__NODE_NOT_FOUND,
};

export const update_by_id__update_error: errorObject = {
  message: "This node not updated because cypher query or params are invalid",
  code: CustomNeo4jError.UPDATE_BY_ID__UPDATE_ERROR,
};

export const delete_children_relation_error: errorObject = {
  message: "This relation of children not deleted maybe there is no relation or this children has not a relation defined",
  code: CustomNeo4jError.DELETE_CHILDREN_RELATION_ERROR,
};

export const delete_relation_by_relation_name__not_deleted_error: errorObject = {
  message: "This relation can be deleted because relation name is not defined or wrong",
  code: CustomNeo4jError.DELETE_RELATION_BY_RELATION_NAME__NOT_DELETED_ERROR,
};


export const add_parent_relation_by_id__not_created_error: errorObject = {
  message: "This relation can not created because node id's maybe wrong or not found in database",
  code: CustomNeo4jError.ADD_PARENT_RELATION_BY_ID__NOT_CREATED_ERROR,
};

export const find_by_realm__not_found_error: errorObject = {
  message: "There is no node has this realm name or wrong realm name",
  code: CustomNeo4jError.FIND_BY_REALM__NOT_FOUND_ERROR,
};

export const tree_structure_not_found_by_realm_name_error: errorObject = {
  message: "There is no tree structure by realm name",
  code: CustomNeo4jError.FIND_BY_REALM_WITH_TREE_STRUCTURE_ERROR,
};


export const find_with_children_by_realm_as_tree__find_by_realm_error: errorObject = {
  message: "There is no node has this realm name or wrong realm name",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_REALM_AS_TREE__FIND_BY_REALM_ERROR,
};

export const find_with_children_by_realm_as_tree_error: errorObject = {
  message: "There is no tree structure by realm",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_REALM_AS_TREE_ERROR,
};


export const find_with_children_by_id_as_tree_error: errorObject = {
  message: "There is no tree structure by id in the database",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_ID_AS_TREE_ERROR,
};

export const add_children_relation_by_id_error: errorObject = {
  message: "child_id or target_parent_id is must not empty",
  code: CustomNeo4jError.ADD_CHILDREN_RELATION_BY_ID_ERROR,
};

export const add_relation_with_relation_name__must_entered_error: errorObject = {
  message: "first_node_id, second_node_id or relationName are must not empty",
  code: CustomNeo4jError.ADD_RELATION_WITH_RELATION_NAME_ERROR,
};


export const add_relation_with_relation_name__create_relation_error: errorObject = {
  message: "This relation already exists between those two nodes",
  code: CustomNeo4jError.ADD_RELATION_WITH_RELATION_NAME__CREATE_RELATION_ERROR,
};

export const find_by_realm__not_entered_error: errorObject = {
  message: "Must entered a realm name",
  code: CustomNeo4jError.FIND_BY_REALM__NOT_ENTERED_ERROR,
};

export const find_with_children_by_realm_as_tree__not_entered_error: errorObject = {
  message: "Must entered a realm name",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_REALM_AS_TREE__NOT_ENTERED_ERROR,
};

export const find_by_realm_with_tree_structure__not_entered_error: errorObject = {
  message: "Must entered a realm name",
  code: CustomNeo4jError.FIND_BY_REALM_WITH_TREE_STRUCTURE__NOT_ENTERED_ERROR,
};


export const get_children_count__must_entered_error: errorObject = {
  message: "There is no node's id",
  code: CustomNeo4jError.GET_CHILDREN_COUNT__MUST_ENTERED_ERROR,
};


export const get_parent_by_id__must_entered_error: errorObject = {
  message: "There is no node's id",
  code: CustomNeo4jError.GET_PARENT_BY_ID__MUST_ENTERED_ERROR,
};

export const set_deleted_true_to_node_and_child_by_id_and_labels__must_entered_error: errorObject = {
  message: "id, label1 and label2 must entered",
  code: CustomNeo4jError.SET_DELETED_TRUE_TO_NODE_AND_CHILD_BY_ID_AND_LABELS__MUST_ENTERED_ERROR,
};


export const get_childrens_children_count_by_id_and_labels__must_entered_error: errorObject = {
  message: "id, label1, label2 and label3 must entered",
  code: CustomNeo4jError.GET_CHILDRENS_CHILDREN_COUNT_BY_ID_AND_LABELS__MUST_ENTERED_ERROR,
};

export const get_childrens_children_count_by_id_and_labels__not_found_error: errorObject = {
  message: "",
  code: CustomNeo4jError.GET_CHILDRENS_CHILDREN_COUNT_BY_ID_AND_LABELS__NOT_FOUND_ERROR,
};


export const get_children_count_by_id_and_labels__must_entered_error: errorObject = {
  message: "id, label1 and label2  must entered",
  code: CustomNeo4jError.GET_CHILDRENS_CHILDREN_COUNT_BY_ID_AND_LABELS__MUST_ENTERED_ERROR,
};


export const delete_children_nodes_by_id_and_labels__must_entered_error: errorObject = {
  message: "id, label1 and label2  must entered",
  code: CustomNeo4jError.DELETE_CHILDREN_NODES_BY_ID_AND_LABELS__MUST_ENTERED_ERROR,
};

export const create_node_with_label__must_entered_error: errorObject = {
  message: "entity and label must entered or ", // yazılacakkk
  code: CustomNeo4jError.CREATE_NODE_WITH_LABEL__MUST_ENTERED_ERROR,
};

export const update_has_type_prop__must_entered_error: errorObject = {
  message: "id and hasLabeledNode must entered",
  code: CustomNeo4jError.UPDATE_HAS_TYPE_PROP__MUST_ENTERED_ERROR,
};

export const update_has_type_prop_error: errorObject = {
  message: "field can not updated may be there is not a node with this id or id is not valid",
  code: CustomNeo4jError.UPDATE_HAS_TYPE_PROP__MUST_ENTERED_ERROR,
};


export const create__must_entered_error: errorObject = {
  message: "entity and label must entered",
  code: CustomNeo4jError.CREATE__MUST_ENTERED_ERROR,
};


export const delete_relation_with_relation_name__must_entered_error: errorObject = {
  message: "id and relationName must entered",
  code: CustomNeo4jError.DELETE_RELATION_WITH_RELATION_NAME__MUST_ENTERED_ERROR,
};


export const add_parent_relation_by_id__must_entered_error: errorObject = {
  message: "child_id and parent_id must entered",
  code: CustomNeo4jError.ADD_PARENT_RELATION_BY_ID__MUST_ENTERED_ERROR,
};

export const update_selectable_prop__must_entered_error: errorObject = {
  message: "id and selectable must entered",
  code: CustomNeo4jError.UPDATE_SELECTABLE_PROP__MUST_ENTERED_ERROR,
};

export const find_by_id_and_labels_with_active_child_nodes__must_entered_error: errorObject = {
  message: "id, label1 and label2 must entered",
  code: CustomNeo4jError.FIND_BY_ID_AND_LABELS_WITH_ACTIVE_CHILD_NODES__MUST_ENTERED_ERROR,
};


export const find_with_children_by_id_as_tree__must_entered_error: errorObject = {
  message: "id must entered",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_ID_AS_TREE__MUST_ENTERED_ERROR,
};

export const find_by_id_with_tree_structure__must_entered_error: errorObject = {
  message: "id must entered",
  code: CustomNeo4jError.FIND_BY_ID_WITH_TREE_STRUCTURE__MUST_ENTERED_ERROR,
};

export const find_by_id_and_labels_with_active_child_nodes__not_found_error: errorObject = {
  message: "This node not found in database maybe entered id value wrong",
  code: CustomNeo4jError.FIND_BY_ID_AND_LABELS_WITH_ACTIVE_CHILD_NODES__NOT_FOUND_ERROR,
};


export const find_by_id_and_labels_with_active_child_node__not_found_error: errorObject = {
  message: "Nodes not found according to searched id and label criteria",
  code: CustomNeo4jError.FIND_BY_ID_AND_LABELS_WITH_ACTIVE_CHILD_NODE__NOT_FOUND_ERROR,
};

export const find_node_by_id_and_label__must_entered_error: errorObject = {
  message: "id and label must be entered",
  code: CustomNeo4jError.FIND_NODE_BY_ID_AND_LABEL__MUST_ENTERED_ERROR,
};

export const find_node_by_id_and_label__not_found_error: errorObject = {
  message: "Node not found maybe label is invalid or id not found",
  code: CustomNeo4jError.FIND_NODE_BY_ID_AND_LABEL__NOT_FOUND_ERROR,
};

export const find_by_id__must_entered_error: errorObject = {
  message: "id must entered",
  code: CustomNeo4jError.FIND_BY_ID__MUST_ENTERED_ERROR,
};

export const find_node_count_by_classname__must_entered_error: errorObject = {
  message: "classname must entered",
  code: CustomNeo4jError.FIND_NODE_COUNT_BY_CLASSNAME__MUST_ENTERED_ERROR,
};


export const find_with_children_by_id_and_labels_as_tree__must_entered_error: errorObject = {
  message: "id, label1 and label2 must entered",
  code: CustomNeo4jError.FIND_WITH_CHILDREN_BY_ID_AND_LABELS_AS_TREE__MUST_ENTERED_ERROR,
};

export const create_node__must_entered_error: errorObject = {
  message: "params and label must entered",
  code: CustomNeo4jError.CREATE_NODE__MUST_ENTERED_ERROR,
};

export const update_by_id__must_entered_error: errorObject = {
  message: "id and params must entered",
  code: CustomNeo4jError.UPDATE_BY_ID__MUST_ENTERED_ERROR,
};

export const find_root_node_by_classname__must_entered_error: errorObject = {
  message: "id and params must entered",
  code: CustomNeo4jError.FIND_ROOT_NODE_BY_CLASSNAME__MUST_ENTERED_ERROR,
};

export const update_selectable_prop__not_updated_error: errorObject = {
  message: "Node not updated, id value maybe wrong",
  code: CustomNeo4jError.UPDATE_SELECTABLE_PROP__NOT_UPDATED_ERROR,
};

export const set_deleted_true_to_node_and_child_by_id_and_labels_not_updated_error: errorObject = {
  message: "There is nothing updated maybe id and labels wrong or node not exists",
  code: CustomNeo4jError.SET_DELETED_TRUE_TO_NODE_AND_CHILD_BY_ID_AND_LABELS__NOT_UPDATED_ERROR,
};

export const find_by_id_and_labels_with_tree_structure__not_found_error: errorObject = {
  message: "Tree structure not found maybe id and labels wrong",
  code: CustomNeo4jError.FIND_BY_ID_AND_LABELS_WITH_TREE_STRUCTURE__NOT_FOUND_ERROR,
};

export const find_by_id_and_labels_with_tree_structure__must_entered_error: errorObject = {
  message: "id, label1 and label2 must be entered",
  code: CustomNeo4jError.FIND_BY_ID_AND_LABELS_WITH_TREE_STRUCTURE__MUST_ENTERED_ERROR,
};

export const add_parent_by_label_class_must_entered_error: errorObject = {
  message: "entity and label must be entered",
  code: CustomNeo4jError.ADD_PARENT_BY_LABEL_CLASS__MUST_ENTERED_ERROR,
};

export const delete_relation_must_entered_error: errorObject = {
  message: "id must be entered",
  code: CustomNeo4jError.DELETE_RELATION__MUST_ENTERED_ERROR,
};

export const add_relation_must_entered_error: errorObject = {
  message: "id and target_parent_id must be entered",
  code: CustomNeo4jError.ADD_RELATION__MUST_ENTERED_ERROR,
};

export const find_one_node_by_key_must_entered_error: errorObject = {
  message: "id must be entered",
  code: CustomNeo4jError.FIND_ONE_NODE_BY_KEY__MUST_ENTERED_ERROR,
};

export const delete__must_entered_error: errorObject = {
  message: "id must be entered",
  code: CustomNeo4jError.DELETE__MUST_ENTERED_ERROR,
};