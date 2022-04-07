import { usePersistFn } from "ahooks";
import { TreeNode } from "./TreeNode";
import React, { useCallback, useRef } from "react";
import List, { IBaseListItem } from "../List";
import { IListProps, ListController } from "../List/List";
import { useFlatten } from "./hooks/useFlatten";
import "./index.css";
import 'antd/dist/antd.css'

export interface IBaseTreeNodeData<ITreeNodeData> extends IBaseListItem {
    children: ITreeNodeData[];
}

// 上层透传给 List 的 props
type ITreePropsForList<ITreeNodeData> = Omit<
    IListProps<ITreeNodeData>,
    // 由 Tree 传给 List 的 props
    "renderItem"
>;

interface ITreeProps<ITreeNodeData> extends ITreePropsForList<ITreeNodeData> {
    data: ITreeNodeData[];
    expandedKeys: string[];
    renderNodeContent?: (node: ITreeNodeData) => React.ReactElement;
    // callback
    onNodeToggleExpand: (node: ITreeNodeData | string | string[], expand: boolean) => void;

    // getter
    getNodeStyle?: (node: ITreeNodeData) => React.CSSProperties;
    getNodeIndent: (node: ITreeNodeData, level: number) => number;
    getController?: (controller: ListController<ITreeNodeData>) => void;
}

export function Tree<ITreeNodeData extends IBaseTreeNodeData<ITreeNodeData>>(
    props: ITreeProps<ITreeNodeData>
) {
    const {
        data,
        renderNodeContent,
        expandedKeys,
        getNodeStyle,
        getNodeIndent,
        onNodeToggleExpand,
        ...listProps
    } = props;
    const { flattenedData, levelMap } = useFlatten({
        data,
        expandedKeys
    });

    const getItemStyle = usePersistFn((node: ITreeNodeData) => {
        const styleFromProps = getNodeStyle ? getNodeStyle(node) : {};
        const indent = getNodeIndent(node, levelMap[node.id]);
        return {
            ...styleFromProps,
            paddingLeft: indent
        };
    });

    const renderItem = useCallback(
        (node: ITreeNodeData) => {
            const { itemHeight } = props;
            return (
                <TreeNode
                    nodeHeight={itemHeight}
                    isExpanded={expandedKeys.includes(node.id)}
                    node={node}
                    onNodeToggleExpand={onNodeToggleExpand}
                    renderNodeContent={renderNodeContent}
                />
            );
        },
        [expandedKeys, onNodeToggleExpand, renderNodeContent, props.itemHeight]
    );

    return (
        <List
            {...listProps}
            data={flattenedData}
            getItemStyle={getItemStyle}
            renderItem={renderItem}
        />
    );
}
