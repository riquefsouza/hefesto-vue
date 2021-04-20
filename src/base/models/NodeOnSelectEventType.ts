import TreeNode from "./TreeNode";

export const emptyTreeNode: TreeNode = {
    'key': 0,
    'label': '',
    'data': '0',
    'children': []
};

// eslint-disable-next-line
export type NodeOnSelectEventType = { originalEvent?: Event, node: TreeNode, data?: any };
