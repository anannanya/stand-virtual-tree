import React, { useMemo, useCallback, useState, useRef } from "react";
import { generateTreeData } from "./helper";
import "./App.css";
import { Button, Input } from 'antd';
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



export default function App() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const treeController = useRef();

  const [depth, setDepth] = useState('')
  const [updateDepth, setUpdateDepth] = useState('')
  const [sisterNum, setSisterNum] = useState('')
  const [updateSisterNum, setUpdateSisterNum] = useState('')

  const sureParams = useCallback(() => {
    setUpdateDepth(depth)
    setUpdateSisterNum(sisterNum)
  }, [depth, sisterNum])

  const depthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      alert('请输入大于0的数字')
    } else {
      setDepth(e.target.value)
    }
  }, [])

  const sisterNumChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      alert('请输入大于0的数字')
    } else {
      setSisterNum(e.target.value)
    }
  }, [])

  const data: A[] = useMemo(() => {
    return [generateTreeData({
      depth: Number(updateDepth) || 3,
      sisterNum: Number(updateSisterNum) || 5,
    })]
  }, [updateDepth, updateSisterNum])


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


  return (
    <div className="App">
      <h1>stand-virtual-tree</h1>
      <div className="select">
        <div className='select-child-div'>
          输入tree深度:<Input placeholder='key' value={depth} onChange={depthChange} />
        </div>
        <div className='select-child-div'>
          输入横向条数:<Input placeholder='px' value={sisterNum} onChange={sisterNumChange} />
        </div>
      </div>
      <Button onClick={sureParams}>确认</Button>
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
        getNodeStyle={() => ({ border: "1px solid grey" })}
      />
    </div>
  );
}
