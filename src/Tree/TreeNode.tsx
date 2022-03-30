import classname from "classnames";
import type { IBaseTreeNodeData } from "./Tree";
import { CaretRightOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { usePersistFn } from "ahooks";

interface ITreeProps<ITreeNodeData> {
    isExpanded: boolean;
    node: ITreeNodeData;
    nodeHeight: ((node: ITreeNodeData) => number) | number;
    onNodeToggleExpand: (node: ITreeNodeData, expand: boolean) => void;
}

const cls = "stand-tree-node";

export function TreeNode<
    ITreeNodeData extends IBaseTreeNodeData<ITreeNodeData>
>(props: ITreeProps<ITreeNodeData>) {
    const { isExpanded, node, nodeHeight, onNodeToggleExpand } = props;

    const onClickExpandArrow = usePersistFn(() => {
        onNodeToggleExpand(node, !isExpanded);
    });

    const renderExpandArrow = () => {
        const className = isExpanded ? "open" : "close";
        return (
            <CaretRightOutlined
                onClick={onClickExpandArrow}
                className={classname(`${cls}-expand-arrow`, className)}
            />
        );
    };

    const renderNodeContent = () => {
        return <div className={`${cls}-content`}>{node.title}</div>;
    };

    // const style = useMemo(
    //   () => ({
    //     height: typeof nodeHeight === "number" ? nodeHeight : nodeHeight(node)
    //   }),
    //   [nodeHeight, node]
    // );

    return (
        <div className={cls}>
            {renderExpandArrow()}
            {renderNodeContent()}
        </div>
    );
}
