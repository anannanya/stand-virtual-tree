import { useMemo, useState, useCallback, useRef } from "react";
import { Input, Switch, Button, message } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'

import Tree from "../Tree";
import "./tree.css"

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { usePersistFn } from "ahooks";
import { generateTreeData } from "../helper";
import { ListController } from "../List/List";
import useNextTick from "../hooks/useNextTick";

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
            console.log(12345, jumpKey)
            treeController.current?.scrollTo({ id: jumpKey })
        })
    }, [])

    return (
        <>
            <h2>基础用法</h2>
            <div className="select">
                <div className="inputArea">
                    <div className='select-child-div'>
                        树状列表深度:&nbsp;5
                    </div>
                    <div className='select-child-div'>
                        同层级节点数:&nbsp;5
                    </div>
                </div>

            </div>
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

    const renderArrow = () => {
        return (
            <div>

            </div>
        )
    }
    const renderIcon = () => {
        return <FolderOutlined />
    }

    return (
        <>
            <h2>添加自定义Icon</h2>

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
                    renderIcon={renderIcon}
                />
            </div>

        </>
    )
};
export const CustomIcon = Template2.bind({});

