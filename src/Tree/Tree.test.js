import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tree } from "./Tree";

function generateTreeData(props) {
    const { depth, sisterNum } = props;
    const realDepth = Array.isArray(depth)
        ? Math.ceil(Math.random() * (depth[1] - depth[0]) + depth[0])
        : depth;
    const realSisNum = Array.isArray(sisterNum)
        ? Math.ceil(Math.random() * (sisterNum[1] - sisterNum[0]) + sisterNum[0])
        : sisterNum;
    let rootNode = {
        id: "0",
        title: `0`,
        children: []
    };

    let helpFun = (treeData, depth, sisterNum, fatherId) => {
        if (depth > 0) {
            for (let i = 0; i < sisterNum; i++) {
                treeData.children[i] = {
                    id: `${fatherId}-${i}`,
                    title: `${fatherId}-${i}`,
                    children: []
                };
            }
            depth = depth - 1;
            treeData.children.forEach((item) => {
                helpFun(item, depth, sisterNum, item.id);
            });
        } else {
            return;
        }
    };
    helpFun(rootNode, realDepth, realSisNum, "0");

    return rootNode;
}
test("空数据渲染", () => {
    const containerHeight = 70;
    const itemHeight = 30;
    const data = [];
    const getNodeIndent = () => 0;
    render(
        <Tree
            data={data}
            expandedKeys={[]}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
            getNodeIndent={getNodeIndent}
        />
    );

    const items = screen.queryAllByText("123");
    expect(items).toHaveLength(0);
});

test("只渲染展开", () => {
    const containerHeight = 70;
    const itemHeight = 30;
    /**
     * 0
     *  0-0
     *  0-1
     *    0-1-0
     *    0-1-1
     *    0-1-2
     *    0-1-3
     *  0-2
     *  0-3
     */
    const data = [
        generateTreeData({
            depth: 4,
            sisterNum: 4
        })
    ];
    const renderNodeContent = (item) => {
        return <div data-testid="tree-item">{item.id}</div>;
    };
    const getNodeIndent = () => 0;
    const expandedKeys = ["0", "0-0", "0-1-0"];
    render(
        <Tree
            data={data}
            renderNodeContent={renderNodeContent}
            expandedKeys={expandedKeys}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
            getNodeIndent={getNodeIndent}
        />
    );

    const items = screen.queryAllByTestId("tree-item");
    expect(items).toHaveLength(3);
});

test("点击箭头, 调用展开节点方法", () => {
    const containerHeight = 70;
    const itemHeight = 30;
    /**
     * 0
     *  0-0
     *  0-1
     *    0-1-0
     *    0-1-1
     *    0-1-2
     *    0-1-3
     *  0-2
     *  0-3
     */
    const data = [
        generateTreeData({
            depth: 4,
            sisterNum: 4
        })
    ];
    const renderNodeContent = (item) => {
        return <div data-testid="tree-item">{item.id}</div>;
    };
    const getNodeIndent = () => 0;
    const expandedKeys = ["0", "0-0", "0-1-0"];
    const onNodeToggleExpand = jest.fn();

    const { container } = render(
        <Tree
            data={data}
            renderNodeContent={renderNodeContent}
            expandedKeys={expandedKeys}
            containerHeight={containerHeight}
            itemHeight={itemHeight}
            getNodeIndent={getNodeIndent}
            onNodeToggleExpand={onNodeToggleExpand}
        />
    );

    const node = container.querySelector(".stand-tree-node");
    const arrow = node.querySelector(".stand-tree-node-expand-arrow");
    fireEvent.click(arrow);
    expect(onNodeToggleExpand.mock.calls.length).toBe(1);
    expect(onNodeToggleExpand.mock.calls[0][0].id).toBe("0");
});
