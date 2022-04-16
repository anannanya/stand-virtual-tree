import { renderHook } from "@testing-library/react-hooks";
import { useFlatten } from "./useFlatten";

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

test("当 expandedKeys 为空时，flattenedData 中没有子节点", () => {
    const data = [
        generateTreeData({
            depth: 4,
            sisterNum: 4
        })
    ];
    const { result } = renderHook(() =>
        useFlatten({
            data,
            expandedKeys: []
        })
    );
    expect(result.current.flattenedData.length).toBe(1);
});

test("flattenedData 中只会存在父节点展开的子节点", () => {
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
    const { result } = renderHook(() =>
        useFlatten({
            data,
            // 0-2-0 的父节点 0-2 没有被展开，因此其子节点也不会被展开
            expandedKeys: ["0", "0-1", "0-2-0"]
        })
    );
    const { flattenedData } = result.current;

    expect(flattenedData.length).toBe(9);
    expect(flattenedData[0].id).toBe("0");
    expect(flattenedData[1].id).toBe("0-0");
    expect(flattenedData[2].id).toBe("0-1");
    expect(flattenedData[3].id).toBe("0-1-0");
    expect(flattenedData[4].id).toBe("0-1-1");
    expect(flattenedData[5].id).toBe("0-1-2");
    expect(flattenedData[6].id).toBe("0-1-3");
    expect(flattenedData[7].id).toBe("0-2");
    expect(flattenedData[8].id).toBe("0-3");
});

test("levelMap 计算正确", () => {
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
    const { result } = renderHook(() =>
        useFlatten({
            data,
            expandedKeys: ["0", "0-1"]
        })
    );
    const { flattenedData, levelMap } = result.current;
    expect(Object.keys(levelMap).length).toBe(9);
    expect(levelMap[flattenedData[0].id]).toBe(0);
    expect(levelMap[flattenedData[1].id]).toBe(1);
    expect(levelMap[flattenedData[2].id]).toBe(1);
    expect(levelMap[flattenedData[3].id]).toBe(2);
    expect(levelMap[flattenedData[4].id]).toBe(2);
    expect(levelMap[flattenedData[5].id]).toBe(2);
    expect(levelMap[flattenedData[6].id]).toBe(2);
    expect(levelMap[flattenedData[7].id]).toBe(1);
    expect(levelMap[flattenedData[8].id]).toBe(1);
});
