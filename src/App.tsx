import React, { useMemo, useCallback, useState, useRef } from "react";
import { generateTreeData } from "./helper";
import "./App.css";
import { IBaseTreeNodeData, Tree } from "./Tree/Tree";
import { usePersistFn } from "ahooks";

export interface A {
  id: string;
  title: string;
  children: A[]
}
const itemHeight = () => 36;
const getNodeIndent = (item: A, level: number) => {
  if (level === 0) {
    return 0;
  }
  return level * 30;
};

const data: A[] = [
  generateTreeData({
    depth: 3,
    sisterNum: 5
  })
];

export default function App() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const treeController = useRef();

  const onNodeToggleExpand = usePersistFn((node, expand: boolean) => {
    let newExpandedKeys = expandedKeys.slice();
    if (expand) {
      newExpandedKeys.push(node.id);
    } else {
      newExpandedKeys = newExpandedKeys.filter((key) => key !== node.id);
    }
    setExpandedKeys(newExpandedKeys);
  });

  const getController = usePersistFn((ref) => {
    treeController.current = ref;
  });
  // const renderItem = useCallback((item) => {
  //   return (
  //     <div
  //       className="stand-list-item"
  //       style={{
  //         ...itemStyle,
  //         height: 36
  //       }}
  //     >
  //       id: {item.id}
  //     </div>
  //   );
  // }, []);

  return (
    <div className="App">
      <Tree
        data={data}
        expandedKeys={expandedKeys}
        onNodeToggleExpand={onNodeToggleExpand}
        itemHeight={itemHeight}
        containerHeight={500}
        className={"list-wrapper"}
        getNodeIndent={getNodeIndent}
        getController={getController}
        shouldCollectHeight={true}
        getNodeStyle={() => ({ border: "1px solid red" })}
      />
    </div>
  );
}
