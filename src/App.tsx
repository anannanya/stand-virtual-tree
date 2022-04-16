import React, { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { generateTreeData } from "./helper";
import "./App.css";
import { Button, Input } from 'antd';
import useNextTick from "./hooks/useNextTick";
import { IBaseTreeNodeData, Tree } from "./Tree/Tree";
import { usePersistFn } from "ahooks";
import { ListController } from "./List/List";

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
  const treeController = useRef<ListController<A | string>>();

  const { updateId, setUpdate } = useNextTick()
  const [depth, setDepth] = useState('')
  const [updateDepth, setUpdateDepth] = useState('')
  const [sisterNum, setSisterNum] = useState('')
  const [updateSisterNum, setUpdateSisterNum] = useState('')
  const [jumpKey, setJumpKey] = useState('')
  const [updateJumpKey, setUpdateJumpKey] = useState('')

  const sureParams = useCallback(() => {
    setUpdateDepth(depth)
    setUpdateSisterNum(sisterNum)
  }, [depth, sisterNum])

  const sureJumpKey = useCallback(() => {
    setUpdateJumpKey(jumpKey)
    expandNode(jumpKey)
  }, [jumpKey])

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

  const jumpKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

    setJumpKey(e.target.value)

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
      if (Array.isArray(node)) {
        newExpandedKeys = newExpandedKeys.concat(node);
      } else {
        newExpandedKeys.push(node.id || node);
      }
    } else {
      newExpandedKeys = newExpandedKeys.filter((key) => key !== (node.id || node));
    }
    setExpandedKeys(newExpandedKeys);
  });

  const getController = usePersistFn((ref) => {
    treeController.current = ref;
  });

  const expandNode = useCallback((jumpKey: string) => {
    if (jumpKey) {
      if (jumpKey === '0') {
        onNodeToggleExpand(jumpKey, true)
      } else {
        const father = jumpKey.split('-')
        let fatherId: string[] = []
        father.reduce((prev, next) => {
          fatherId.push(prev)
          return `${prev}-${next}`
        })
        onNodeToggleExpand(fatherId, true)
      }
    }
    const newUpdateId = Number(updateId) + 1
    setUpdate(`${newUpdateId}`, () => {
      console.log(12345, jumpKey)
      treeController.current?.scrollTo({ id: jumpKey })
    })
  }, [])

  // useEffect(() => {
  //   // console.log(jumpKeyIdObj)
  //   if (jumpKeyIdObj.id) {
  //     treeController.current?.scrollTo(jumpKeyIdObj)
  //     setJumpKeyObj({ id: '' })
  //   }
  // })

  return (
    <div className="App">
      <h1>stand-virtual-tree</h1>
      <div className="select">
        <div className="inputArea">
          <div className='select-child-div'>
            树状列表深度:&nbsp;<Input placeholder='depth' value={depth} onChange={depthChange} />
          </div>
          <div className='select-child-div'>
            同层级节点数:&nbsp;<Input placeholder='sisterNum' value={sisterNum} onChange={sisterNumChange} />
          </div>
        </div>
        <div className="sureButton">
          <Button onClick={sureParams}>确认</Button>
        </div>
      </div>
      <div className="selectKey">
        输入跳转列号:&nbsp;<Input placeholder='eg: 0-0-2' value={jumpKey} onChange={jumpKeyChange} />
        <Button onClick={sureJumpKey}>确认</Button>
      </div>

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
