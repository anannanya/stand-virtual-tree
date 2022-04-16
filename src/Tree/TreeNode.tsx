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
    renderNodeContent?: (node: ITreeNodeData) => React.ReactElement;
    renderIcon?: () => React.ReactElement;
    renderArrow?: () => React.ReactElement;
}

const cls = "stand-tree-node";

export function TreeNode<
    ITreeNodeData extends IBaseTreeNodeData<ITreeNodeData>
>(props: ITreeProps<ITreeNodeData>) {
    const { isExpanded, node, nodeHeight, onNodeToggleExpand, renderArrow, renderIcon } = props;

    const onClickExpandArrow = usePersistFn((e) => {
        onNodeToggleExpand(node, !isExpanded);
    });

    const renderExpandArrow = () => {
        const className = isExpanded ? "open" : "close";
        if (renderArrow) {
            return (
                <div onClick={onClickExpandArrow} className={classname(`${cls}-expand-arrow`, className)}>
                    {renderArrow()}
                </div>
            )
        }
        return (
            <CaretRightOutlined
                onClick={onClickExpandArrow}
                className={classname(`${cls}-expand-arrow`, className)}
            />
        );
    };

    const renderNodeContent = () => {
        if (renderIcon) {
            if (props.renderNodeContent) {
                return (
                    <div>
                        {renderIcon()}
                        {props.renderNodeContent(node)}
                    </div>
                );
            }
            return <div className={`${cls}-content`}>{renderIcon()}{node.title}</div>;
        } else {
            if (props.renderNodeContent) {
                return props.renderNodeContent(node)
            }
            return <div className={`${cls}-content`}>{node.title}</div>;
        }

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
