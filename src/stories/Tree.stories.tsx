import { useMemo, useState, useCallback, useRef } from "react";
import { Input, Switch, Button, message } from 'antd';
import { FolderOutlined, RightCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'

import Tree from "../Tree";
import "./tree.css"

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { usePersistFn } from "ahooks";
import { ListController } from "../List/List";
import useNextTick from "../hooks/useNextTick";
import { sentence } from "./txtgen";

const generateTreeData = (props: any) => {
    const { depth, sisterNum } = props;
    const realDepth = Array.isArray(depth)
        ? Math.ceil(Math.random() * (depth[1] - depth[0]) + depth[0])
        : depth;
    const realSisNum = Array.isArray(sisterNum)
        ? Math.ceil(Math.random() * (sisterNum[1] - sisterNum[0]) + sisterNum[0])
        : sisterNum;
    let rootNode = {
        id: '0',
        title: `0 ${sentence()}`,
        children: []
    };
    console.time('www')
    // let count = 0
    // let root = rootNode
    // while (count < depth) {
    //     let children = root.children
    //     for (let i = 0; i < sisterNum; i++) {
    //         root.children[i] = {
    //             id: `${root.id}-${i}`,
    //             title: `${root.id}-${i}: ${sentence()}`,
    //             children: []
    //         }

    //     }
    //     root = children
    //     count++
    // }
    let helpFun = (treeData: any, depth: number, sisterNum: number, fatherId: string) => {
        // console.log(1111)
        if (depth > 0) {
            for (let i = 0; i < sisterNum; i++) {
                treeData.children[i] = {
                    id: `${fatherId}-${i}`,
                    // title: `${fatherId}-${i}: ${sentence()}`,
                    title: `${fatherId}-${i} ${sentence()}`,
                    children: []
                };
            }
            depth = depth - 1;
            treeData.children.forEach((item: any) => {
                helpFun(item, depth, sisterNum, item.id);
            });
        } else {
            return;
        }
    };
    helpFun(rootNode, realDepth, realSisNum, '0');
    console.timeEnd('www')

    console.log(rootNode)
    return rootNode;
}


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/Tree',
    component: Tree,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tree>;

interface ITreeData {
    id: string;
    title: string;
    children: ITreeData[]
}
const ITEM_HEIGHT = 40;
const itemHeight = () => ITEM_HEIGHT;
const staticHeightitemStyle = {
    boxSizing: 'border-box',
} as React.CSSProperties;

const getNodeIndent = (item: ITreeData, level: number) => {
    if (level === 0) {
        return 0;
    }
    return level * 30;
};
const inputStyle = { width: 300, marginRight: 8, marginBottom: 8 };
const Template: ComponentStory<typeof Tree> = (args) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const treeController = useRef<ListController<ITreeData>>();

    const { updateId, setUpdate } = useNextTick()

    const getTreeNodeStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const data: ITreeData[] = useMemo(() => {
        return [generateTreeData({
            depth: 5,
            sisterNum: 5,
        })]
    }, [])


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
            treeController.current?.scrollTo({ id: jumpKey })
        })
    }, [])

    return (
        <>
            <h2>基础用法</h2>
            <div className="wrapper">
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
                    getNodeStyle={getTreeNodeStyle}
                />
            </div>

        </>
    )
};
export const Basic = Template.bind({});

const Template2: ComponentStory<typeof Tree> = (args) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const treeController = useRef<ListController<ITreeData>>();

    const getTreeNodeStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const data: ITreeData[] = useMemo(() => {
        return [generateTreeData({
            depth: 5,
            sisterNum: 5,
        })]
    }, [])


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

    const renderIcon = () => {
        return <FolderOutlined style={{ marginRight: 6 }} width={24} height={24} />
    }

    return (
        <>
            <h2>添加节点自定义 icon</h2>
            <div className="wrapper">
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
                    getNodeStyle={getTreeNodeStyle}
                    renderIcon={renderIcon}
                />
            </div>

        </>
    )
};
export const CustomIcon = Template2.bind({});


const Template3: ComponentStory<typeof Tree> = (args) => {
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const treeController = useRef<ListController<ITreeData>>();

    const getTreeNodeStyle = useCallback(() => {
        return staticHeightitemStyle
    }, [])

    const data: ITreeData[] = useMemo(() => {
        return [generateTreeData({
            depth: 5,
            sisterNum: 5,
        })]
    }, [])


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

    const renderArrow = () => {
        return <RightCircleOutlined />
    }

    return (
        <>
            <h2>自定义展开箭头 icon</h2>
            <div className="wrapper">
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
                    getNodeStyle={getTreeNodeStyle}
                    renderArrow={renderArrow}
                />
            </div>

        </>
    )
};
export const CustomArrowIcon = Template3.bind({});

